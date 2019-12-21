<template>
  <rect :x="data.x" :y="data.y" :width="data.width" :height="data.height" fill="blue" />
</template>
<script>
import Shape from "./Shape";

export default {
  extends: Shape,
  methods: {
    intersect: function(pos) {
      return this.intersectRect(pos, {
        left: this.data.x,
        top: this.data.y,
        right: this.data.x + this.data.width,
        bottom: this.data.y + this.data.height
      });
    }
  }
};
</script>
<style scoped>
</style>