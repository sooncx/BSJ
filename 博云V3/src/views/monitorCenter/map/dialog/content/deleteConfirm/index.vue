<template>
  <Model
    @confirm="confirm"
    @cancle="cancle"
  >
    <span>{{detail}}</span>
  </Model>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
  inject,
  computed,
} from "vue";
import Model from "../../../../LeftContent/dialog/contents/RemoveAlarm/model.vue";
export default defineComponent({
  components: { Model },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehInfo: {
      type: Object,
      default: null,
    },
    DialogType: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    let dialogFn = inject("dialogFn") as Function; // 弹窗按钮函数
    const data = reactive({
      confirm() {
        dialogFn(true);
        emit("update:visible", false);
      },
      cancle() {
        dialogFn(false);
        emit("update:visible", false);
      },
    });
    const detail = computed(() => {
      let res = "";
      switch (props.DialogType) {
        case "2-4":
          res = "是否删除围栏？";
          break;
        case "3-3":
          res = "是否删除停留点？";
          break;
        default:
          return;
          break;
      }
      return res;
    });
    return {
      detail,
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.icon-tixing {
  color: #d62223;
  padding-right: 5px;
}
</style>