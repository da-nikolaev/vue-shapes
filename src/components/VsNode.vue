<template>
  <g onmousedown="console.log(arguments[0].target.tagName)">
    <component v-bind:is="data.type" v-bind:key="data.id" v-bind:data="data" :ref="data.id" />
  </g>
</template>
<script>
export default {
  props: ["data"]
};
</script>
<style scoped>
g {
  cursor: move;
}
</style>