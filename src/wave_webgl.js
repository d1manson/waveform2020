import webglUtils from "./webgl-utils";

const nChannelsPerSpike = 4;
const nVoltageSampsPerChannel = 50;
const nIrrelevantPrefixBytesPerChannel = 4;

const renderGapBetweenChannels = 2; // 1 unit here is equal to the width of once voltage time step

const nLinesPerChannel =
  nIrrelevantPrefixBytesPerChannel + nVoltageSampsPerChannel; // 54, but first 5 clipped out

const state = {
  canv: null,
  gl: null,
  program: null,
  locs: {},
  buffers: {},
};

const vertexShaderSource = `#version 300 es
// see notes on normalizing unsigned/signed data here:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer

in lowp vec2 a_voltage; // values between [-1, 1]
in vec2 a_group_xy; // values between [0, 1]
in lowp float a_group_color; // values between [0, 1]
flat out lowp float v_group_color;

void main() {  

  int channelSegmentId = gl_InstanceID % ${nLinesPerChannel}; 
  int spikeSegmentId = gl_InstanceID % ${nLinesPerChannel * nChannelsPerSpike};

  // because of the way we've setup our instanced rendinering, the builtin
  // glVertexID variable is either 0 or 1, indicating left or right of line segment.
  int x_within_spike = (spikeSegmentId + gl_VertexID) 
  - (spikeSegmentId/${nLinesPerChannel}+1) * ${nIrrelevantPrefixBytesPerChannel -
  renderGapBetweenChannels};
  
  // the first 5 line segments are nonsense (so we clip them out):
  // segment 0: previous_byte -- time_byte_1   (to make this work for first wave we ask that the voltage data to be prefixed with a dummy byte)
  // segment 1: time_byte_1 -- time_byte_2
  // segment 2: time_byte_2 -- time_byte_3
  // segment 3: time_byte_3 -- time_byte_4
  // segment 4: time_byte_4 -- voltage_samp_1
  // then it's real line segments:
  // segment 5: voltage_samp_1 -- voltage_samp_2
  // segment 6: voltage_samp_2 -- voltage_samp_3
  // ..
  // segment 52: voltage_samp_48 -- voltage_samp_49
  // segment 53: voltage_samp_49 -- voltage_samp_50
  float clip = channelSegmentId >= 5  ? 1.0 : 0.0;

  gl_Position = vec4(
    -1. + a_group_xy.x*2. 
    + float(x_within_spike)/${nLinesPerChannel * nChannelsPerSpike}. ,
    -1. + a_group_xy.y*2. + (a_voltage[gl_VertexID] + 1.)/8.,
    0.0, // we don't care about depth
    clip
    );

    v_group_color = a_group_color ;

}
`;

const fragmentShaderSource = `#version 300 es

flat in lowp float v_group_color;
out lowp vec4 outColor;

void main() {
  outColor = vec4(v_group_color*20.,  sin(v_group_color*100.) ,  sin(v_group_color*150.), 1.);
}
`;

export function setOffScreenCanvas(canvas) {
  state.canv = canvas;
  state.gl = state.canv.getContext("webgl2");
  const gl = state.gl; // for short

  state.program = webglUtils.createProgramFromSources(
    gl,
    [vertexShaderSource, fragmentShaderSource],
    null,
    null,
    (err) => console.dir(err)
  );
  state.gl.viewport(0, 0, canvas.width, canvas.height);
  state.gl.useProgram(state.program);

  state.locs.voltage = state.gl.getAttribLocation(state.program, "a_voltage");
  state.buffers.voltage = gl.createBuffer();
  gl.enableVertexAttribArray(state.locs.voltage);

  state.locs.group_xy = gl.getAttribLocation(state.program, "a_group_xy");
  state.buffers.group = gl.createBuffer();
  gl.enableVertexAttribArray(state.locs.group_xy);

  state.locs.group_color = gl.getAttribLocation(state.program, "a_group_color");
  gl.enableVertexAttribArray(state.locs.group_color);
}

function makeDummyCutXYData(cut) {
  const nSpikes = cut.length;

  const CUT_DATA = new Uint8Array(nSpikes * 3);

  for (let ii = 0; ii < nSpikes; ii++) {
    // TODO: page through 12 at a time
    if (cut[ii] > 11) {
      CUT_DATA[ii * 3 + 0] = 255;
      CUT_DATA[ii * 3 + 1] = 255;
      CUT_DATA[ii * 3 + 2] = 255;
    } else {
      CUT_DATA[ii * 3 + 0] = (cut[ii] % 2) * 128;
      CUT_DATA[ii * 3 + 1] = (cut[ii] >> 1) * 43;
      CUT_DATA[ii * 3 + 2] = cut[ii];
    }
  }

  return CUT_DATA;
}

export function render(voltage, cut) {
  // Voltage data should consist of nSpikes, where each wave contains:
  //  four instances of [4-time-bytes 50 voltage bytes].
  // And there should be a single dummy byte at the start (see
  // the note within the vertex shader for why this is needed).

  const gl = state.gl; // for short

  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.voltage);
  gl.bufferData(gl.ARRAY_BUFFER, voltage, gl.STATIC_DRAW);

  // we start with a 1D vector of voltage data.
  // for simplicitly, lets pretend the data within is:
  // [0, 1, 2, 3, 4, 5, 6, ...]
  // this is going to produce a sequence of points as follows:
  // Point 1. [0,1]
  // Point 2. [1,2]
  // Point 3. [2,3]
  // Point 4. [3,4]
  // ...
  //
  // This is achieved by having two floats per point, but having the
  // stride only advance 4 bytes, which is one float rather than two
  gl.vertexAttribPointer(
    state.locs.voltage,
    2, // two elements per point
    gl.BYTE,
    true, // normalize
    1, // only advance 1 bytes (i.e. 1 8-bit int) after each point
    0
  );
  // Now, we take that sequence and say that we will treat each element as
  // being the per-instance data for an "instance", where each instance has
  // two points. However, the two points are entirely the same, except for the
  // gl_InstanceID which is 0 for the first point and 1 for the second point.
  // Thus we get the following data for instances:
  // Instance 1. [Point1, Point1] i.e. [0: [0,1], 1: [0,1] ]
  // Instance 2. [Point2, Point2] i.e. [0: [1,2], 1: [1,2] ]
  // Instance 3. [Point3, Point3] i.e. [0: [2,3], 1: [2,3] ]
  // By using instances, with 2 points per instance we sneakily end up with
  // with duplicating each point, once for use on the LHS of a line, and once for
  // use on the RHS of a line...which is exactly what we need!
  gl.vertexAttribDivisor(state.locs.voltage, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.group);
  gl.bufferData(gl.ARRAY_BUFFER, makeDummyCutXYData(cut), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    state.locs.group_xy,
    2, // two elements per point (x,y)
    gl.UNSIGNED_BYTE,
    true, // normalize
    3, // the data is 3 byte elements of x,y,palletId
    0
  );
  gl.vertexAttribDivisor(
    state.locs.group_xy,
    nLinesPerChannel * nChannelsPerSpike
  );

  gl.vertexAttribPointer(
    state.locs.group_color,
    1, // one element of palletId
    gl.UNSIGNED_BYTE,
    true, // normalize
    3, // the data is 3 byte elements of x,y,palletId
    2 // offset 2 bytes (i.e. after x and y bytes)
  );
  gl.vertexAttribDivisor(
    state.locs.group_color,
    nLinesPerChannel * nChannelsPerSpike
  );

  gl.drawArraysInstanced(
    gl.LINES,
    0,
    2,
    nLinesPerChannel * nChannelsPerSpike * cut.length
  );
}
