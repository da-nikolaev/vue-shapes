<template>
  <foreignObject :x="data.x" :y="data.y" :width="data.width" :height="data.height">
    <div ref="contentBody">
      <slot />
    </div>
  </foreignObject>
</template>
<script>
import { EventBus } from "../EventBus";

export default {
  props: ["data"],
  mounted: function() {
    this.$nextTick(() => {
      this.obs = new ResizeObserver(e => {
        e.forEach(el => {
          EventBus.$emit("nodeResized", {
            nodeId: this.data.id,
            width: el.contentRect.width,
            height: el.contentRect.height
          });
        });
      });
      this.obs.observe(this.$refs.contentBody);
    });
  }
};
</script>
<style scoped>
</style>