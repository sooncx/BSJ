<template>
  <div class="playback_map">
    <Bmap ref="Bmap" v-if="mapType == 'Bmap'" v-bind="$attrs" />
    <Amap ref="Amap" v-else v-bind="$attrs" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType } from "vue";
import Bmap from "../../map/Bmap.vue";
import Amap from "../../map/Amap.vue";

export default defineComponent({
  name: "",
  components: {
    Amap,
    Bmap,
  },
  props: {
    mapType: {
      type: String as PropType<string>,
      default: "Bmap",
    },
  },
  setup() {
    const data = reactive({
      Bmap: ref<HTMLDivElement | null>(null),
      Amap: ref<HTMLDivElement | null>(null),
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.playback_map {
  width: 100%;
  height: 100%;
}
</style>
