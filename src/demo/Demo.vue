<template>
  <div class="h100 w100">
    <vue-shapes-view ref="view" v-bind:nodes="nodes" v-bind:edges="edges"></vue-shapes-view>
    <vue-shapes-scale class="right" v-on:zoomIn="zoomIn()" v-on:zoomOut="zoomOut()" v-on:zoomFit="zoomFit()"></vue-shapes-scale>
  </div>
</template>
<script>
import Vue from 'vue'
import { View, Scale } from "../VueShapes";
import Example from "./Example";

export default {
  data: function() {
    return {
      nodes: [],
      edges: []
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      Vue.component("Example", Example);
      this.nodes = Vue.observable([
        { id: "1", group: "Example", x: 15, y: 10, width: 200, height: 150 },
        { id: "2", group: "Example", x: 250, y: 310, width: 300, height: 150 }
      ]);
      this.edges = Vue.observable([
        { from: "1", to: "2" }
      ]);
    });
  },
  methods: {
    zoomIn: function() {
      this.$refs.view.zoomIn();
    },
    zoomOut: function() {
      this.$refs.view.zoomOut();
    },
    zoomFit: function() {
      this.$refs.view.zoomFit();
    }
  },
  components: {
    "vue-shapes-view": View,
    "vue-shapes-scale": Scale
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
.right {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>