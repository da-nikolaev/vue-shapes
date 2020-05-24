<template>
  <foreignObject :x="data.x" :y="data.y" :width="data.width" :height="data.height">
    <div>
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