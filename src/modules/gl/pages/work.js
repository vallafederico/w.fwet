import Page from "./page";

export default class extends Page {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    console.log("PAGE -> work");

    this.create();
  }

  create() {
    // quads
  }

  /** Lifecycle */
  render(t, y) {}

  resize(gl) {
    this.gl = gl;
  }
}
