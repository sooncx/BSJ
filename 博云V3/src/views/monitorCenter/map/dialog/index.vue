<template>
  <Eldialog
    v-bind="$attrs"
    :width="width"
    :title="title"
    :top="dialogTop"
    @closed="closed"
  >
    <template
      v-slot:all
      v-if="['2-3', '2-4', '3-3'].includes(DialogType)"
    >
      <SetCircle
        v-if="['2-3'].includes(DialogType)"
        :vehInfo="vehInfo"
        v-bind="$attrs"
      />
      <DeleteConfirm
        v-if="['2-4', '3-3'].includes(DialogType)"
        :vehInfo="vehInfo"
        :DialogType="DialogType"
        v-bind="$attrs"
      />
    </template>
    <template
      v-slot:form
      v-if="['1-1'].includes(DialogType)"
    >
      <SearchFence
        :vehInfo="vehInfo"
        v-if="['1-1'].includes(DialogType)"
      />
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  defineAsyncComponent,
  ref,
  nextTick,
  computed,
  reactive,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
export default defineComponent({
  components: {
    Eldialog,
    SearchFence: defineAsyncComponent(
      () => import("./content/searchFence/index.vue")
    ),
    SetCircle: defineAsyncComponent(
      () => import("./content/SetCircle/index.vue")
    ),
    DeleteConfirm: defineAsyncComponent(
      () => import("./content/deleteConfirm/index.vue")
    ),
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    DialogType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const dialogTop = computed(() => {
      if (["2-4", "3-3"].includes(props.DialogType)) {
        return "40vh";
      } else {
        return "15vh";
      }
    });
    const data = reactive({
      closed() {
        emit("update:DialogType", "");
      },
    });
    const width = computed(() => {
      if (["2-3", "2-4", "3-3"].includes(props.DialogType)) {
        return "340px";
      } else {
        return "800px";
      }
    });
    return {
      width,
      dialogTop,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
</style>