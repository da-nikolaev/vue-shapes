<template></template>
<script>
export default {
  props: ["data"],
  data: function() {
    return {
      slots: []
    };
  },
  methods: {
    getId: function() {
      return this.data.id;
    },
    addSlot: function(slot) {
      if (!this.data.slots) {
        this.data.slots = []
      }
      this.data.slots.push(slot);
    },
    getSlots: function() {
      return this.data.slots;
    }
  }
};
</script>
<style scoped>
</style>