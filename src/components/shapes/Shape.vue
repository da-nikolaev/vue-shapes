<template></template>
<script>
export default {
  props: ["data"],
  data: function() {
    return {
      meta: {
        dragX: 0,
        dragY: 0,
        dragWidth: 0,
        dragHeight: 0,
        selected: false,
        resizable: false
      }
    };
  },
  methods: {
    intersect: function(pos) {
      return false;
    },
    intersectRect: function(point, rect) {
      if (
        point.x >= rect.left &&
        point.y >= rect.top &&
        point.x <= rect.right &&
        point.y <= rect.bottom
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>