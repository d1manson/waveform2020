import webglUtils from "./webgl-utils";
import { trigger } from "./worker-events";

const nChannelsPerSpike = 4;
const nVoltageSampsPerChannel = 50;
const nIrrelevantPrefixBytesPerChannel = 4;

const nClippedLinesPerChannel = 1 + nIrrelevantPrefixBytesPerChannel;
const nVoltageLinesPerChannel = nVoltageSampsPerChannel - 1;

const nLinesPerChannel = nClippedLinesPerChannel + nVoltageLinesPerChannel;

// these are all in the same units, "pixels"
const offCanvW = 1024;
const offCanvH = 1024;
const hTimeStep = 2; // horizontal spacing of voltage values
const hGapBetweenChannels = 2;
const vGapBetweenSpikes = 2;
const spikeH = 128;

const spikeW =
  (nVoltageLinesPerChannel * hTimeStep + hGapBetweenChannels) *
  nChannelsPerSpike;

const nColumns = Math.floor(offCanvW / spikeW);
const nRowsPerPage = Math.floor(offCanvH / (spikeH + vGapBetweenSpikes));
const nGroupsPerPage = nColumns * nRowsPerPage;

const vertexShaderSource = `#version 300 es
// see notes on normalizing unsigned/signed data here:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer

in lowp vec2 a_voltage; // values between [-1, 1]
in vec2 a_group_col_row; // values between [0, 1]
uniform lowp int u_page;

in lowp float a_group_color; // values between [0, 1]
flat out lowp float v_group_color;

void main() {  

  int segment_within_channel = gl_InstanceID % ${nLinesPerChannel}; 

  // because of the way we've setup our instanced rendinering, the builtin
  // gl_VertexID variable is either 0 or 1, indicating left or right of line segment.
  int t_within_channel = (segment_within_channel - ${nClippedLinesPerChannel} + gl_VertexID);
  int channel_within_spike = 
    (gl_InstanceID % ${nLinesPerChannel * nChannelsPerSpike})
    / ${nLinesPerChannel};

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

  gl_Position = vec4(

    // x coordinate
    -1. 
    + a_group_col_row.x * 255. * ${spikeW.toFixed(1)} * 2./${offCanvW.toFixed(
  1
)} 
    + float(
        // this bit is in pixel coordinates
        channel_within_spike * 
          ${nVoltageLinesPerChannel * hTimeStep + hGapBetweenChannels} + 
        t_within_channel * ${hTimeStep}
      ) 
      // convert to [-1,+1] gl coords
      * 2./${offCanvW.toFixed(1)},

    // y coordinate
    -1. 
     + (a_group_col_row.y *255. - float(u_page) * ${nRowsPerPage.toFixed(1)})
     * ${(spikeH + vGapBetweenSpikes).toFixed(1)} * 2./${offCanvH.toFixed(1)}
     + (
      // this is [0, 2]
      a_voltage[gl_VertexID] + 1.
      ) 
      // convert to [-1, +1] gl coords
      * ${spikeH.toFixed(1)} /${offCanvH.toFixed(1)},

    // depth ..we don't care
    0.0, // we don't care about depth

    // clip
    segment_within_channel >= ${nClippedLinesPerChannel}
     ? 1.0 : 0.0

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

const offCanv = new OffscreenCanvas(offCanvW, offCanvH);

const gl = offCanv.getContext("webgl2");

const program = webglUtils.createProgramFromSources(
  gl,
  [vertexShaderSource, fragmentShaderSource],
  null,
  null,
  (err) => console.dir(err)
);
gl.viewport(0, 0, offCanvW, offCanvH);
gl.useProgram(program);

const locs = {
  voltage: gl.getAttribLocation(program, "a_voltage"),
  group_col_row: gl.getAttribLocation(program, "a_group_col_row"),
  group_color: gl.getAttribLocation(program, "a_group_color"),
  page: gl.getUniformLocation(program, "u_page"),
};
gl.enableVertexAttribArray(locs.voltage);
gl.enableVertexAttribArray(locs.group_col_row);
gl.enableVertexAttribArray(locs.group_color);

const buffers = {
  voltage: gl.createBuffer(),
  group: gl.createBuffer(),
};

const outputCanvs = [];
export function setCanvasForIdx(idx, canvas) {
  outputCanvs[idx] = canvas.getContext("2d");
  // outputCanvs[idx].fillText(`offscreen ${idx}`, 5, 10);
}

function makeGroupColRowData(cut) {
  const nSpikes = cut.length;

  const CUT_DATA = new Uint8Array(nSpikes * 3);

  for (let ii = 0; ii < nSpikes; ii++) {
    CUT_DATA[ii * 3 + 0] = cut[ii] % nColumns;
    CUT_DATA[ii * 3 + 1] = (cut[ii] / nColumns) | 0;
    CUT_DATA[ii * 3 + 2] = cut[ii];
  }

  return CUT_DATA;
}

export function render(voltage, cut, nGroups) {
  // Voltage data should consist of nSpikes, where each wave contains:
  //  four instances of [4-time-bytes 50 voltage bytes].
  // And there should be a single dummy byte at the start (see
  // the note within the vertex shader for why this is needed).

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.voltage);
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
    locs.voltage,
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
  gl.vertexAttribDivisor(locs.voltage, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.group);
  gl.bufferData(gl.ARRAY_BUFFER, makeGroupColRowData(cut), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    locs.group_col_row,
    2, // two elements per point (x,y)
    gl.UNSIGNED_BYTE,
    true, // normalize
    3, // the data is 3 byte elements of x,y,palletId
    0
  );
  gl.vertexAttribDivisor(
    locs.group_col_row,
    nLinesPerChannel * nChannelsPerSpike
  );

  gl.vertexAttribPointer(
    locs.group_color,
    1, // one element of palletId
    gl.UNSIGNED_BYTE,
    true, // normalize
    3, // the data is 3 byte elements of x,y,palletId
    2 // offset 2 bytes (i.e. after x and y bytes)
  );
  gl.vertexAttribDivisor(
    locs.group_color,
    nLinesPerChannel * nChannelsPerSpike
  );

  const nPages = Math.ceil(nGroups / nGroupsPerPage);

  for (let page = 0; page < nPages; page++) {
    gl.uniform1i(locs.page, page);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(
      gl.LINES,
      0,
      2,
      nLinesPerChannel * nChannelsPerSpike * cut.length
    );

    for (
      let ii = page * nGroupsPerPage;
      ii < Math.min(outputCanvs.length, (page + 1) * nGroupsPerPage);
      ii++
    ) {
      const col = ii % nColumns,
        row = ((ii / nColumns) | 0) - page * nRowsPerPage;

      outputCanvs[ii].clearRect(0, 0, spikeW, spikeH);
      outputCanvs[ii].drawImage(
        offCanv,
        col * spikeW,
        offCanvH - 1 - row * (spikeH + vGapBetweenSpikes) - spikeH,
        spikeW,
        spikeH,
        0,
        0,
        spikeW,
        spikeH
      );
    }

    if (process.env.NODE_ENV === "development") {
      const bitmap = offCanv.transferToImageBitmap();
      trigger("offscreen-page-rendered", bitmap, [bitmap]);
    }
  }
}
