<template>
  <svg class="h100 w100" ref="svg">
    <g v-bind:transform="this.transform" ref="viewport">
      <slot />
    </g>
  </svg>
</template>
<script>
import VsTransformManager from "./VsTransformManager";
import { EventBus } from "./EventBus";
import { animate, cube } from "./Animation";

export default {
  data: function() {
    return {
      transform: ""
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      this.transformManager = new VsTransformManager(
        this.$refs.svg,
        this.$refs.viewport
      );

      this.transformManager
        .onPan((e, t) => {
          this.transform = t;
          this.$emit("viewportChanged", t);
        })
        .onDrag((e, t) => {
          let p = {
            nodeId: e.getAttribute("nodeId"),
            transform: t
          };
          this.$emit("nodeDragged", p);
        });

      EventBus.$on("zoomIn", () => this.zoomIn());
      EventBus.$on("zoomOut", () => this.zoomOut());
      EventBus.$on("zoomFit", () => this.zoomFit());
    });
  },
  methods: {
    animateZoom: function(delta) {
      let evt = {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
        wheelDelta: delta
      };
      animate({
        timing: cube,
        draw: e => this.transformManager.zoom(evt),
        duration: 300
      });
    },
    zoomIn: function() {
      this.animateZoom(15);
    },
    zoomOut: function() {
      this.animateZoom(-15);
    },
    zoomFit: function() {}
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