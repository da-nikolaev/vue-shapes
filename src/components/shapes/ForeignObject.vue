<template>
  <foreignObject
    :draggable="true"
    :x="data.x"
    :y="data.y"
    :width="data.width"
    :height="data.height"
  >
    <div xmlns="http://www.w3.org/1999/xhtml" class="vue-shapes-w100 vue-shapes-h100">
      <slot />
    </div>
  </foreignObject>
</template>
<script>
import Shape from './Shape'
import Slot from './Slot'

export default {
  extends: Shape,
  props: ["data"],
  mounted: function() {
    this.$nextTick(() => {
      this.addSlot(new Slot('foreignObject', this.data.width / 2, 0, this.data.width / 2, - 40));
      this.addSlot(new Slot('foreignObject', this.data.width, this.data.height / 2, this.data.width + 40, this.data.height / 2));
      this.addSlot(new Slot('foreignObject', this.data.width / 2, this.data.height, this.data.width / 2, this.data.height + 40));
      this.addSlot(new Slot('foreignObject', 0, this.data.height / 2, - 40, this.data.height / 2));
    });
  }
};
</script>
<style scoped>
foreignObject[draggable] {
  cursor: move;
}
foreignObject div {
  pointer-events: none;
}
</style>