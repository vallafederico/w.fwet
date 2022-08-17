import Page from "./page";
import GridQuad from "../mod/gridQuad";

export default class extends Page {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    console.log("PAGE -> work");

    this.create();
  }

  create() {
    // quads
    const quad = [...document.querySelectorAll('[data-gl="work"]')];
    if (quad) this.dq = quad.map((q) => new GridQuad(this.gl, q));
  }

  /** Lifecycle */
  render(t, y) {
    if (this.dq) this.dq.forEach((item) => item.render(t, y));
  }

  resize(gl) {
    this.gl = gl;

    if (this.dq) this.dq.forEach((item) => item.resize(this.gl));
  }

  /* ---- Animation */
  transitionOut(duration = 0.8) {
    if (this.dq) this.dq.forEach((item) => item.transitionOut(duration));
  }
}
