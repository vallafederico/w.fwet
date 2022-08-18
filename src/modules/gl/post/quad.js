import * as twgl from "twgl.js";
import shaders from "./mat/";

export default class {
  constructor(gl, data = {}) {
    this.gl = gl;
    this.data = data;
    this.shaders = shaders;
    this.programInfo = twgl.createProgramInfo(this.gl, this.shaders);

    this.gl.useProgram(this.programInfo.program);
    this.setBuffAtt();
    this.setUniforms();
  }

  setBuffAtt() {
    const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, arrays);
  }

  setUniforms() {
    this.checkerTxt = getCheckerTexture(this.gl);

    this.uniforms = {
      u_res: [this.gl.canvas.width, this.gl.canvas.height],
      u_time: 0,
      u_mouse: [0, 0],
      u_speed: 0,
      u_checker: this.checkerTxt,
      //  u_diff: null
    };

    this.gl.useProgram(this.programInfo.program);
    twgl.setUniforms(this.programInfo, this.uniforms);
  }

  render(time, diff = null, { x, y }, speed) {
    this.gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    twgl.setUniforms(this.programInfo, {
      u_time: time,
      u_diff: diff,
      u_mouse: [x, y],
      u_speed: speed,
      u_checker: this.checkerTxt,
    });

    twgl.drawBufferInfo(this.gl, this.bufferInfo);
    // this.gl.LINES
  }

  resize(gl) {
    this.gl = gl;

    this.gl.useProgram(this.programInfo.program);
    twgl.setUniforms(this.programInfo, {
      u_res: [this.gl.canvas.width, this.gl.canvas.height],
    });
  }
}

/* --- Checker */
function getCheckerTexture(gl) {
  const size = 320;

  const array = [];
  for (let i = 0; i < size * size; i++) {
    const res = Math.random() * 255;
    array.push(res, res, res, 255);
  }

  return twgl.createTexture(gl, {
    mag: gl.NEAREST,
    min: gl.LINEAR,
    src: array,
  });
}
