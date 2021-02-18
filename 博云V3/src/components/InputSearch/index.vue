<template>
  <div>

  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "vehicle",
    },
    value: {
      type: String || Number,
      default: "",
    },
  },
});
</script>