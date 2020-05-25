<template>
  <div class="scale">
    <button class="button" @click="$emit('zoomFit')">
      <FitScreenSvg />
    </button>
    &nbsp;
    <button class="button right" @click="$emit('zoomIn')">
      <PlusSvg />
    </button>
    <button class="button right" @click="$emit('zoomOut')">
      <MinusSvg />
    </button>
  </div>
</template>
<script>
import FitScreenSvg from "../images/fit-screen.svg";
import MinusSvg from "../images/minus.svg";
import PlusSvg from "../images/plus.svg";
export default {
  components: {
    FitScreenSvg,
    MinusSvg,
    PlusSvg
  }
};
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
  padding: 0;
}
.button svg {
  width: 26px;
  height: 26px;
}
.button:hover path {
  stroke: #3154f4;
}
.button:hover path.background {
  stroke: transparent;
  fill: #3154f4;
}
.button:active path {
  stroke: #3154f4;
}
.button:active {
  transform: translateY(1px);
  filter: saturate(150%);
}
.right {
  float: right;
}
</style>