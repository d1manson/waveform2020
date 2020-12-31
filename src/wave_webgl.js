import webglUtils from "./webgl-utils";

const state = {
  canv: null,
  gl: null,
  program: null,
  locs: {},
  buffers: {},
};

const vertexShaderSource = `#version 300 es
in lowp vec2 a_voltage;
in vec2 a_group_xy;

void main() {  
  
  int segmentId = gl_InstanceID % 54; 

  // because of the way we've setup our instanced rendinering, the builtin
  // glVertexID variable is either 0 or 1, indicating left or right of line segment.
  int x_within_wave = segmentId + gl_VertexID;

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
  float clip = segmentId >= 5 ? 1.0 : 0.0;

  gl_Position = vec4(
    float(a_group_xy.x) + float(x_within_wave)/51. -1.,
    a_group_xy.y + float(a_voltage[gl_VertexID]) -0.5,
    0.0, // we don't care about depth
    clip
    );
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec4 u_color;
out vec4 outColor;

void main() {
  outColor = u_color;
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
  state.gl.viewport(0, 0, 400, 400);
  state.gl.useProgram(state.program);

  state.locs.voltage = state.gl.getAttribLocation(state.program, "a_voltage");
  state.buffers.voltage = gl.createBuffer();

  state.locs.group_xy = gl.getAttribLocation(state.program, "a_group_xy");
  state.buffers.group_xy = gl.createBuffer();

  state.locs.color = gl.getUniformLocation(state.program, "u_color");
}

export function render(voltage, group_xy, nWaves) {
  // Voltage data should consist of nWaves, where each wave contains:
  //  four instances of [4-time-bytes 50 voltage bytes].
  // And there should be a single dummy byte at the start (see
  // the note within the vertex shader for why this is needed).

  const gl = state.gl; // for short

  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.voltage);
  gl.bufferData(gl.ARRAY_BUFFER, voltage, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(state.locs.voltage);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffers.group_xy);
  gl.bufferData(gl.ARRAY_BUFFER, group_xy, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(state.locs.group_xy);
  gl.vertexAttribPointer(
    state.locs.group_xy,
    2, // two elements per point (x,y)
    gl.FLOAT,
    false, // normalize
    0,
    0
  );
  gl.vertexAttribDivisor(state.locs.group_xy, 54);

  gl.uniform4fv(state.locs.color, [1, 0, 0, 1]);

  gl.drawArraysInstanced(gl.LINES, 0, 2, 54 * nWaves);
}
