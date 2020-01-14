<template>
  <path :d="path" :not-draggable="true"></path>
</template>
<script>
export default {
  props: ["data"],
  computed: {
    path: function() {
      return (
        "M" +
        this.data.x1 +
        " " +
        this.data.y1 +
        " C" +
        this.data.x2 +
        " " +
        this.data.y2 +
        ", " +
        this.data.x3 +
        " " +
        this.data.y3 +
        ", " +
        this.data.x4 +
        " " +
        this.data.y4
      );
    }
  }
};
</script>
<style scoped>
path {
  stroke: #a0a8b0;
  stroke-width: 1px;
  fill: none;
}
</style>