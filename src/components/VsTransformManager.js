export default class VsTransformManager {
  constructor(svg, viewport) {
    this.svg = svg
    this.viewport = viewport
    this.state = {
      type: "",
      target: null,
      prigin: null,
      transform: null
    }
    this.zoomSensitivity = 0.4

    this.svg.addEventListener("mousedown", e => this.startDrag(e));
    this.svg.addEventListener("mousemove", e => this.drag(e));
    this.svg.addEventListener("mouseup", e => this.endDrag(e));
    this.svg.addEventListener("mouseleave", e => this.endDrag(e));
    this.svg.addEventListener("touchstart", e => this.startDrag(e));
    this.svg.addEventListener("touchmove", e => this.drag(e));
    this.svg.addEventListener("touchend", e => this.endDrag(e));
    this.svg.addEventListener("touchleave", e => this.endDrag(e));
    this.svg.addEventListener("touchcancel", e => this.endDrag(e));
    this.svg.addEventListener("wheel", e => this.zoom(e));
  }
  onViewportChanged(handler) {
    this.onViewportChangedHandler = handler
    return this
  }
  onDrag(handler) {
    this.onDragHandler = handler
    return this
  }
  onSelect(handler) {
    this.onSelectHandler = handler
    return this
  }
  onUnselect(handler) {
    this.onUnselectHandler = handler
    return this
  }
  getEventPoint(evt) {
    let p = this.svg.createSVGPoint();

    p.x = evt.clientX;
    p.y = evt.clientY;
    return p;
  }
  setCTM(element, matrix) {
    let transform = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`

    if (element == this.viewport) {
      if (typeof this.onViewportChangedHandler === 'function') {
        this.onViewportChangedHandler(element, transform)
      }
    }
    else {
      if (typeof this.onDragHandler === 'function') {
        this.onDragHandler(element, transform)
      }
    }
  }
  startDrag(evt) {
    let g = this.viewport;

    if (evt.target.tagName == "svg") {
      // Pan mode
      this.state.type = "pan";
      this.state.target = g;
      this.state.transform = g.getCTM().inverse();
      this.state.origin = this.getEventPoint(evt).matrixTransform(
        this.state.transform
      );
      if (typeof this.onUnselectHandler === 'function') {
        this.onUnselectHandler()
      }
    } else {
      // Drag mode
      let e = evt.target;
      while (e.tagName != "g") e = e.parentElement;

      this.state.type = "drag";
      this.state.target = e;
      this.state.transform = g.getCTM().inverse();
      this.state.origin = this.getEventPoint(evt).matrixTransform(
        this.state.transform
      );
      if (typeof this.onSelectHandler === 'function') {
        this.onSelectHandler(this.state.target)
      }
    }
  }
  drag(evt) {
    let g = this.viewport;

    if (this.state.type == "pan") {
      // Pan mode
      let p = this.getEventPoint(evt).matrixTransform(this.state.transform);
      this.setCTM(
        this.state.target,
        this.state.transform
          .inverse()
          .translate(p.x - this.state.origin.x, p.y - this.state.origin.y)
      );
    } else if (this.state.type == "drag") {
      // Drag mode
      let p = this.getEventPoint(evt).matrixTransform(g.getCTM().inverse());
      this.setCTM(
        this.state.target,
        this.svg
          .createSVGMatrix()
          .translate(p.x - this.state.origin.x, p.y - this.state.origin.y)
          .multiply(g.getCTM().inverse())
          .multiply(this.state.target.getCTM())
      );
      this.state.origin = p;
    }
  }
  endDrag(evt) {
    this.state.type = "";
  }
  zoom(evt) {
    let delta;

    if (evt.wheelDelta) {
      delta = evt.wheelDelta / 360; // Chrome/Safari
    } else delta = evt.detail / -9; // Mozilla

    let z = Math.pow(1 + this.zoomSensitivity, delta);
    let g = this.viewport;
    let p = this.getEventPoint(evt);

    p = p.matrixTransform(g.getCTM().inverse());

    let k = this.svg
      .createSVGMatrix()
      .translate(p.x, p.y)
      .scale(z)
      .translate(-p.x, -p.y);

    let m = g.getCTM().multiply(k)
    this.setCTM(g, m);

    if (!this.state.transform) this.state.transform = g.getCTM().inverse();

    this.state.transform = this.state.transform.multiply(k.inverse());
  }
  zoomFit() {
    let s = this.svg;
    let g = this.viewport;
    let gr = g.getBoundingClientRect();
    let sr = s.getBoundingClientRect();

    let p = this.getEventPoint({ clientX: gr.left, clientY: gr.top }).matrixTransform(g.getCTM().inverse());
    let z = Math.min(sr.height / (gr.height / g.getCTM().a), sr.width / (gr.width / g.getCTM().a), 1.0);

    this.setCTM(
      g,
      this.svg
        .createSVGMatrix()
        .translate(-p.x, -p.y)
        .scale(z)
        .multiply(g.getCTM().inverse())
        .multiply(g.getCTM())
    );
  }
}