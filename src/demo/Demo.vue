<template>
  <div class="h100 w100">
    <VsView ref="view" v-bind:nodes="nodes" v-bind:edges="edges"></VsView>
  </div>
</template>
<script>
import Vue from "vue";
import Example from "./Example";
import { VsView, EventBus } from "../VueShapes";

export default {
  data: function() {
    return {
      nodes: [],
      edges: []
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      Vue.component("Example", Example);
      this.nodes = Vue.observable([
        { id: "1", type: "Example", x: 15, y: 10, width: 200, height: 150 },
        { id: "2", type: "Example", x: 250, y: 310, width: 300, height: 150 }
      ]);
      this.edges = Vue.observable([{ from: "1", to: "2" }]);
      // EventBus.$on("contextMenu", () => alert('context menu triggered'));
      // EventBus.$on("nodeContextMenu", ({ nodeId }) => alert(`node ${nodeId} context menu triggered`));
    });
  },
  components: {
    VsView
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
</style>