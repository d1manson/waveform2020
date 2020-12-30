import webglUtils from "./webgl-utils";

const nWaves = 7;

const WAVE_DATA = new Int8Array(50 * nWaves);

for (let ii = 0; ii < nWaves; ii++) {
  for (let t = 0; t < 50; t++) {
    WAVE_DATA[ii * 50 + t] =
      (Math.sin((t / 50) * 5) / 4 + Math.random() * 0.05 + (ii % 5) * 0.01) *
      128;
  }
}

console.dir(WAVE_DATA);

const CUT_DATA = new Float32Array(nWaves * 2);
for (let ii = 0; ii < nWaves; ii++) {
  CUT_DATA[ii * 2 + 0] = ii % 2;
  CUT_DATA[ii * 2 + 1] = (ii & 2) >> 1;
}

const vertexShaderSource = `#version 300 es
in lowp vec2 a_wave_data;
in vec2 a_cut_data;

void main() {  
  gl_Position = vec4(float(gl_InstanceID%50 + gl_VertexID)/60. -1. + float(a_cut_data[0]), float(a_wave_data[gl_VertexID]) -0.5+ a_cut_data[1], 0.0, 1.0);
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

function main(canvas) {
  // Get A WebGL context
  const gl = canvas.getContext("webgl2");

  const program = webglUtils.createProgramFromSources(
    gl,
    [vertexShaderSource, fragmentShaderSource],
    null,
    null,
    (err) => console.dir(err)
  );
  gl.viewport(0, 0, 400, 400);
  gl.useProgram(program);

  const waveDataLoc = gl.getAttribLocation(program, "a_wave_data");
  const waveBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, waveBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, WAVE_DATA, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(waveDataLoc);

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
    waveDataLoc,
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
  gl.vertexAttribDivisor(waveDataLoc, 1);

  const cutDataLoc = gl.getAttribLocation(program, "a_cut_data");
  const cutBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cutBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, CUT_DATA, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(cutDataLoc);
  gl.vertexAttribPointer(
    cutDataLoc,
    2, // two elements per point (x,y)
    gl.FLOAT,
    false, // normalize
    0,
    0
  );
  gl.vertexAttribDivisor(cutDataLoc, 50);

  const colorLoc = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorLoc, [1, 0, 0, 1]);

  gl.drawArraysInstanced(gl.LINES, 0, 2, 50 * nWaves);
}

export default main;
