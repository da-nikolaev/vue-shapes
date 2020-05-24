<template>
  <g v-bind:transform="data.transform" v-bind:nodeId="data.id">
    <component v-bind:is="data.type" v-bind:data="data" />
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