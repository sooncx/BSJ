<template>
  <a-cascader
    :fieldNames="{ label: 'name', value: 'name', children: 'list' }"
    :style="inpusStyle"
    v-model:value="cityValue"
    :options="options"
    change-on-select
    placeholder="请选择"
    @change="handleChange"
  />
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  toRefs,
  watch,
} from "vue";
import lodash from "lodash";
import json from "../../assets/js/city.json";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    inpusStyle: {
      type: Object,
      default: () => {
        return { width: "250px" };
      },
    },
    inputValue: {
      type: Array,
      default: null,
    },
  },
  emits: ["handleChange", "update:inputValue"],
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      options: [],
      citys: [],
      pickerData: [] as any,
      handleChange: function (val: string[]) {
        emit("handleChange", val);
      },
    });
    const cityValue = computed({
      get: () => props.inputValue,
      set: (val) => {
        emit("update:inputValue", val);
      },
    });
    nextTick(() => {
      data.options = store.state.citys;
      // data.options = json;
      watch(
        () => props.inputValue,
        (val) => {
          if (props.inputValue == []) {
            cityValue.value = [];
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );
    });
    return {
      cityValue,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scopde>
.ant-cascader-menus {
  z-index: 999999 !important;
}
.ant-cascader-input.ant-input {
  height: 40px;
}
</style>