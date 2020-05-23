<template>
  <div class="h100 w100" onwheel mousedown>
    <svg class="h100 w100">
      <g class="viewport">
        <VsNode v-for="node in computedNodes" v-bind:key="node.id" v-bind:data="node" />
        <VsEdge v-for="edge in computedEdges" v-bind:key="edge.id" v-bind:data="edge" />
      </g>
    </svg>
    <VsScale />
  </div>
</template>
<script>
import VsNode from "./VsNode";
import VsEdge from "./VsEdge";
import VsScale from "./VsScale";

export default {
  props: ["nodes", "edges"],
  data: function() {
    return {
      state: "",
      stateTarget: null,
      stateOrigin: null,
      stateTransform: null,
      zoomSensitivity: 0.4
    };
  },
  computed: {
    computedNodes: function() {
      return this.nodes;
    },
    computedEdges: function() {
      return [];
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      let svg = this.svg();

      svg.addEventListener("mousedown", e => this.startDrag(e));
      svg.addEventListener("mousemove", e => this.drag(e));
      svg.addEventListener("mouseup", e => this.endDrag(e));
      svg.addEventListener("mouseleave", e => this.endDrag(e));
      svg.addEventListener("touchstart", e => this.startDrag(e));
      svg.addEventListener("touchmove", e => this.drag(e));
      svg.addEventListener("touchend", e => this.endDrag(e));
      svg.addEventListener("touchleave", e => this.endDrag(e));
      svg.addEventListener("touchcancel", e => this.endDrag(e));
      svg.addEventListener("wheel", e => this.zoom(e));
    });
  },
  methods: {
    svg: function() {
      return this.$el.firstElementChild;
    },
    viewport: function() {
      return this.svg().firstElementChild;
    },
    getEventPoint(evt) {
      let p = this.svg().createSVGPoint();

      p.x = evt.clientX;
      p.y = evt.clientY;
      return p;
    },
    setCTM(element, matrix) {
      element.setAttribute(
        "transform",
        `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`
      );
    },
    startDrag: function(evt) {
      // evt.returnValue = false;

      var g = this.viewport();

      if (evt.target.tagName == "svg") {
        // Pan mode
        this.state = "pan";
        this.stateTransform = g.getCTM().inverse();
        this.stateOrigin = this.getEventPoint(evt).matrixTransform(
          this.stateTransform
        );
      } else {
        // Drag mode
        let e = evt.target;
        // debugger;
        while (e.tagName != "g") e = e.parentElement;

        this.state = "drag";
        this.stateTarget = e;
        this.stateTransform = g.getCTM().inverse();
        this.stateOrigin = this.getEventPoint(evt).matrixTransform(
          this.stateTransform
        );
      }
    },
    drag: function(evt) {
      // evt.returnValue = false;
      var g = this.viewport();

      if (this.state == "pan") {
        // Pan mode
        var p = this.getEventPoint(evt).matrixTransform(this.stateTransform);
        this.setCTM(
          g,
          this.stateTransform
            .inverse()
            .translate(p.x - this.stateOrigin.x, p.y - this.stateOrigin.y)
        );
      } else if (this.state == "drag") {
        // Drag mode
        var p = this.getEventPoint(evt).matrixTransform(g.getCTM().inverse());
        this.setCTM(
          this.stateTarget,
          this.svg()
            .createSVGMatrix()
            .translate(p.x - this.stateOrigin.x, p.y - this.stateOrigin.y)
            .multiply(g.getCTM().inverse())
            .multiply(this.stateTarget.getCTM())
        );
        this.stateOrigin = p;
      }
    },
    endDrag: function(evt) {
      // evt.returnValue = false;
      this.state = "";
    },
    zoom: function(evt) {
      // evt.returnValue = false;

      let delta;

      if (evt.wheelDelta) {
        delta = evt.wheelDelta / 360; // Chrome/Safari
      } else delta = evt.detail / -9; // Mozilla

      var z = Math.pow(1 + this.zoomSensitivity, delta);
      var g = this.viewport();
      var p = this.getEventPoint(evt);

      p = p.matrixTransform(g.getCTM().inverse());

      var k = this.svg()
        .createSVGMatrix()
        .translate(p.x, p.y)
        .scale(z)
        .translate(-p.x, -p.y);

      this.setCTM(g, g.getCTM().multiply(k));

      if (!this.stateTransform) this.stateTransform = g.getCTM().inverse();

      this.stateTransform = this.stateTransform.multiply(k.inverse());
    }
  },
  components: {
    VsNode,
    VsEdge,
    VsScale
  }
};
</script>
<style scoped>
.h100 {
  height: 100%;
}
.w100 {
  width: 100%;
}
svg {
  background-image: url("../images/background.png");
}
</style>