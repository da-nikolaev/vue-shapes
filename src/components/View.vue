<template>
  <svg class="h100 w100">
    <component
      v-for="shape in children"
      v-bind:is="shape.group"
      v-bind:key="shape.id"
      v-bind:data="shape"
    />
  </svg>
</template>
<script>
import Curve from "./shapes/Curve";
import ForeignObject from "./shapes/ForeignObject";

export default {
  props: ["children"],
  data: function() {
    return {
      currentSelect: null,
      isDrag: false,
      isResize: false,
      startX: -1,
      startY: -1
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$el.onpointerdown = event => this.onMouseDown(event);
      document.onpointerup = event => this.onMouseUp(event);
      this.$el.onpointermove = event => this.onMouseMove(event);
      this.$el.onmouseleave = event => this.onMouseLeave(event);
    });
  },
  methods: {
    onMouseDown: function(event) {
      var pos = { x: event.offsetX, y: event.offsetY };
      var shapes = this.$children;

      for (var i in shapes) {
        var ret = false;
        var shape = shapes[i];
        if (shape.meta.resizable) {
          this.isResize = true;
          ret = true;
        } else if (shape.intersect(pos)) {
          debugger;
          this.isDrag = true;
          ret = true;
        }

        if (ret) {
          this.currentSelect = shape;
          this.currentSelect.save();
          this.startX = event.offsetX;
          this.startY = event.offsetY;
          return;
        }
      }
      this.isResize = false;
      this.isDrag = false;
      this.clearSelection();
    },
    onMouseMove: function(event) {
      var pos = { x: event.offsetX, y: event.offsetY };
      if (this.isDrag) {
        this.select(this.currentSelect);
        // this._updateMoveShapes(palette, pos);
      } else if (this.isResize) {
        // this._updateResizableShapes(palette, pos);
      } else {
        // this._updateResizableCursor(palette, pos);
      }
    },
    onMouseLeave: function(event) {},
    onMouseUp: function(event) {
      if (
        this.currentSelect &&
        this.startX == event.offsetX &&
        this.startY == event.offsetY
      ) {
        this.select(this.currentSelect);
      }
      this.isDrag = false;
      this.isResize = false;
    },
    select: function(selected) {
      if (!selected) return;

      this.clearSelection();
      this.$emit("select", selected);
      selected.meta.selected = true;
    },
    clearSelection: function() {
      this.currentSelect = null;

      var shapes = this.$children;
      for (var i in shapes) {
        var shape = shapes[i];
        shape.meta.selected = false;
      }
    }
  },
  components: { Curve, ForeignObject }
};
</script>
<style scoped>
.h100 {
  height: 100%;
}

.w100 {
  width: 100%;
}
</style>