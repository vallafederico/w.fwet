import Emitter from "tiny-emitter";

export default class extends Emitter {
  constructor(el) {
    super();
    this.el = el;

    this.config = {
      in: {
        t: 0.2,
        my: "00%",
      },
      out: {
        t: 0,
        my: "00%",
      },
    };

    this.setup();
    if (this.el) this.init();
  }

  init() {
    this.observerIn.observe(this.el);
    this.observerOut.observe(this.el);
  }

  stop() {
    this.observerIn.unobserve(this.el);
    this.observerOut.unobserve(this.el);
  }

  setup() {
    this.observerIn = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.emit("isIn");
        });
      },
      {
        root: null,
        threshold: this.config.in.t,
        rootMargin: `${this.config.in.my} ${this.config.in.my} ${this.config.in.my} ${this.config.in.my}`,
      }
    );

    this.observerOut = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) this.emit("isOut");
        });
      },
      {
        root: null,
        threshold: this.config.out.t,
        rootMargin: `${this.config.out.my} ${this.config.out.my} ${this.config.out.my} ${this.config.out.my}`,
      }
    );
  }
}
