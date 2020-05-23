<template>
  <foreignObject :x="data.x" :y="data.y" :width="data.width" :height="data.height">
    <div xmlns="http://www.w3.org/1999/xhtml" class="vue-shapes-w100 vue-shapes-h100">
      <slot />
    </div>
  </foreignObject>
</template>
<script>
export default {
  props: ["data"]
};
</script>
<style scoped>
</style>