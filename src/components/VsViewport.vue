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
import { animate, linear } from "./Animation";

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
        .onViewportChanged((e, t) => {
          this.transform = t;
          EventBus.$emit("viewportChanged", t);
        })
        .onDrag((e, t) => {
          let p = {
            nodeId: e.getAttribute("nodeId"),
            transform: t
          };
          EventBus.$emit("nodeDragged", p);
        });

      EventBus.$on("zoomIn", () => this.zoomIn());
      EventBus.$on("zoomOut", () => this.zoomOut());
      EventBus.$on("zoomFit", () => this.zoomFit());
    });
  },
  methods: {
    animateZoom: function(sign) {
      let evt = {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      };
      animate({
        timing: linear,
        draw: t =>
          this.transformManager.zoom(
            Object.assign(evt, { wheelDelta: t * sign * 50 })
          ),
        duration: 300
      });
    },
    zoomIn: function() {
      this.animateZoom(1);
    },
    zoomOut: function() {
      this.animateZoom(-1);
    },
    zoomFit: function() {
      this.transformManager.zoomFit();
    }
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