import Vue from 'vue'
import { View } from './VueShapes'

let elements = Vue.observable([
  { id: "1", group: "ForeignObject", x: 15, y: 10, width: 100, height: 150 }
])

new Vue({
  render: h => h(View, {
    props: {
      children: elements
    }
  })
}).$mount('#app')

setTimeout(() => {
  elements.push({ id: "2", group: "Curve" })
}, 2000)