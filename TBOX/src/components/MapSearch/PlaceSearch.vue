<template>
  <input
    :placeholder="placeholder"
    v-model="searchVal"
    ref="input"
  />
</template>

<script>
import { throttle } from "@/assets/js/base";

export default {
  props: {
    local: [Object],
    Autocomplete: [Object],
    placeholder: String
  },

  data() {
    return {
      options: [],
      searchVal: ""
    };
  },

  watch: {
    searchVal(val) {
      if (this.local && this.local.name === val) return;
      this.$emit('update:local', null); //清空
      throttle(async () => {
        this.Autocomplete.search(val, (status, result) => {
          let tips = [];
          if (status === "complete" && result.info === "OK") {
            tips = result.tips;
          }

          this.$emit("onTipsChange", tips);
        });
      }, 100);
    },
    local(val) {
      if (!val) return;
      this.searchVal = val.name;
    }
  },

  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    }
  }
};
</script>
