<template>
  <div class="h100 w100" onwheel>
    <VsViewport>
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
import { EventBus } from "./EventBus";

export default {
  props: ["nodes", "edges"],
  data: function() {
    return {
      internalNodes: [],
      internalEdges: [],
      selectedNodes: []
    };
  },
  watch: {
    nodes: function(list) {
      this.internalNodes = list;
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      EventBus.$on("nodeDragged", this.nodeDragged);
      EventBus.$on("nodeResized", this.nodeResized);
      EventBus.$on("nodeSelected", this.nodeSelected);
      EventBus.$on("nodeUnselected", this.nodeUnselected);
    });
  },
  methods: {
    getNode: function(nodeId) {
      return this.internalNodes.find(e => e.id == nodeId);
    },
    nodeDragged: function({ nodeId, transform }) {
      Vue.set(this.getNode(nodeId), "transform", transform);
    },
    nodeResized: function({ nodeId, width, height }) {
      let node = this.getNode(nodeId);
      Vue.set(node, "width", width);
      Vue.set(node, "height", height);
    },
    nodeSelected: function({ nodeId }) {
      let node = this.getNode(nodeId);
      this.updateSelectedNodes([node]);
    },
    nodeUnselected: function() {
      this.updateSelectedNodes([]);
    },
    updateSelectedNodes: function(nodes) {
      this.selectedNodes.forEach((node) => Vue.set(node, "selected", false));
      this.selectedNodes = nodes;
      this.selectedNodes.forEach((node) => Vue.set(node, "selected", true));
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