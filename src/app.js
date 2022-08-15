import Dom from "./modules/dom";
import Gl from "./modules/gl/gl";
import Preloader from "./modules/preloader";
import { Router } from "./modules/router";

import Scroll from "./modules/scroll";

class App {
  constructor() {
    this.body = document.querySelector("body");
    // this.load()
    this.init();
  }

  load() {
    this.preloader = new Preloader();
    this.preloader.once("finished", (data) => console.log(data));
    this.preloader.once("out", () => this.init());
    this.preloader.preload();
  }

  init() {
    // this.addEventsListeners();

    // routes
    this.router = new Router();
    this.router.on("T_CLICK", () => this.preTransition());
    this.router.on("T_START", (data) => this.transition(data));

    // dom
    this.scroll = new Scroll();
    this.dom = new Dom();

    // gl
    this.gl = new Gl();

    this.update();
  }

  /*
   ** Pages
   */

  preTransition() {
    //  transition current out
    if (this.dom) {
      this.dom.transition(0.9);
      if (this.gl && this.gl.scene) this.gl.scene.current.transitionOut(0.4);
    }
  }

  transition({ current, next }) {
    // console.log(current, "->", next);
    // trigger page change
    setTimeout(() => this.changePage(next), 1000);
  }

  changePage(next) {
    //  remove old and next new in
    this.router.swap().then(() => {
      //  setup next
      this.handleNext(next);

      //  transition next in
    });

    // fix page
  }

  handleNext(next) {
    if (this.scroll) this.scroll.scrollTo(0, true);
    if (this.dom) this.dom.create();
    if (this.gl?.scene) this.gl.scene.handlePageChange(next);
  }

  /*
   ** Loop
   */

  update() {
    if (this.gl && this.scroll)
      this.gl.render(this.scroll.y.current, this.scroll.speed);

    window.requestAnimationFrame(this.update.bind(this));
  }

  /*
   ** Events
   */

  addEventsListeners() {
    new ResizeObserver((entry) => this.onResize(entry[0].contentRect)).observe(
      this.body
    );

    if ("ontouchmove" in window) {
      window.addEventListener("touchstart", this.handleMouseDown.bind(this));
      window.addEventListener("touchmove", this.handleMouseMove.bind(this));
      window.addEventListener("touchend", this.handleMouseUp.bind(this));
    } else {
      window.addEventListener("mousedown", this.handleMouseDown.bind(this));
      window.addEventListener("mousemove", this.handleMouseMove.bind(this));
      window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }
  }

  onResize() {
    // console.log('resizing');
  }

  handleMouseDown() {}
  handleMouseMove() {}
  handleMouseUp() {}
}

new App();