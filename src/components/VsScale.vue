<template>
  <div class="scale">
    <button class="button fit" @click="$emit('zoomFit')"></button>
    &nbsp;
    <button class="button plus right" @click="$emit('zoomIn')"></button>
    <button class="button minus right" @click="$emit('zoomOut')"></button>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.scale {
  position: relative;
  float: right;
  right: 20px;
  bottom: 47px;
}
.button {
  width: 26px;
  height: 26px;
  border: 0px solid transparent;
  background-color: transparent;
}
.right {
  float: right;
}
.fit {
  background-image: url("../images/fit-screen.svg");
  background-size: cover;
}
.plus {
  background-image: url("../images/plus.svg");
  background-size: cover;
}
.minus {
  background-image: url("../images/minus.svg");
  background-size: cover;
}
</style>