<template>
  <div class="h100 w100" onwheel>
    <VsViewport v-on:nodeDragged="this.dragNode">
      <VsNode v-for="node in this.internalNodes" v-bind:key="node.id" v-bind:data="node" />
      <VsEdge v-for="edge in this.internalEdges" v-bind:key="edge.id" v-bind:data="edge" />
    </VsViewport>
    <VsScale />
  </div>
</template>
<script>
import Vue from "vue";
import VsNode from "./VsNode";
import VsEdge from "./VsEdge";
import VsViewport from "./VsViewport";
import VsScale from "./VsScale";

export default {
  props: ["nodes", "edges"],
  data: function() {
    return {
      internalNodes: [],
      internalEdges: []
    };
  },
  watch: {
    nodes: function(list) {
      this.internalNodes = list;
    }
  },
  methods: {
    dragNode: function({ nodeId, transform }) {
      let node = this.internalNodes.find(e => e.id == nodeId);
      Vue.set(node, "transform", transform);
    }
  },
  components: {
    VsNode,
    VsEdge,
    VsViewport,
    VsScale
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