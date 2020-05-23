<template>
  <VsForeignObject v-bind:data="data">
    <div class="example">
      <br />
      <div class="row">
        <label>Ответ:</label>
      </div>
      <div class="row">
        <input type="text" />
      </div>
      <div class="row">
        <button v-on:click="add">+</button>
      </div>
      <div class="row">
        <ol>
          <li v-for="todo in todos" v-bind:key="todo.text">{{ todo.text }}</li>
        </ol>
      </div>
    </div>
  </VsForeignObject>
</template>
<script>
import { VsForeignObject } from "../VueShapes";

export default {
  props: ["data"],
  data: function() {
    return {
      todos: []
    };
  },
  methods: {
    add: function() {
      this.todos.push({ text: this.todos.length + 1 });
    }
  },
  components: {
    VsForeignObject
  }
};
</script>
<style scoped>
.example {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-color: #fff;
  border: 1px solid rgb(192, 197, 207);
  border-radius: 8px;
  font-family: "Courier New", Courier, monospace;
}
.row {
  margin-left: 15px;
  margin-right: 15px;
}
.example input {
  pointer-events: all;
  width: 100%;
}
.example button {
  cursor: auto;
  pointer-events: all;
}
</style>