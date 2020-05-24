<template>
  <svg class="h100 w100" ref="svg">
    <g v-bind:transform="this.transform" ref="viewport">
      <slot />
    </g>
  </svg>
</template>
<script>
import VsTransformManager from "./VsTransformManager";

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
    });
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