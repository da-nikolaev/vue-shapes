<template>
  <div class="vue-shapes-scale">
    <button class="vue-shapes-button fit-button" @click="$emit('zoomFit')"></button>
    &nbsp;
    <button class="vue-shapes-button plus-button right" @click="$emit('zoomIn')"></button>
    <button class="vue-shapes-button minus-button right" @click="$emit('zoomOut')"></button>
  </div>
</template>
<script>
export default {  
}
</script>
<style scoped>
.right {
  float: right;
}
</style>