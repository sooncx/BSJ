<template>
  <a-button @click="shooModal" :style="btnStyle" class="active">自定义列</a-button>
  <Modal
    :checkboxFlag="true"
    v-model:checkboxChecked="checkAllVal"
    :checkboxFn="changeAll"
    :onOk="submit"
    title="自定义表格展示列"
    v-model:visible="visible"
    width="680px"
  >
    <a-checkbox-group
      v-model:value="checkedlist"
      :options="options"
      @change="listChange"
    />
  </Modal>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
import { Modal } from "@/components/Modal/index";

export default defineComponent({
  components: { Modal },
  props: {
    value: {
      type: Array as PropType<any[]>,
      default: [],
    },
    btnStyle: {
      type: Object as PropType<object>,
      default: { 'margin-right': '16px' }
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      visible: false,
      checkAllVal: true,
      checkedlist: <string[]>[],
      options: computed(() => {
        data.checkedlist = props.value.map(item => item.visible && item.key);
        return props.value.map(item => ({
          label: item.title,
          value: item.key
        }));
      }),
      changeAll(e: any) {
        data.checkAllVal = e.target.checked;
        if (e.target.checked) {
          data.checkedlist = data.options.map((i) => i.value);
        } else {
          data.checkedlist = [];
        }
      },
      listChange() {
        data.checkAllVal = data.checkedlist.length === data.options.length;
      },
      submit() {
        const arr = JSON.parse(JSON.stringify(props.value)) as any[];
        arr.forEach(item => {
          item.visible = false;
        });
        arr.forEach(item => {
          data.checkedlist.forEach(key => {
            if (key === item.key) {
              item.visible = true;
            }
          });
        });
        emit('update:value', arr);
        data.visible = false;
      },
      shooModal() {
        data.visible = true;
      }
    });

    return {
      ...toRefs(data)
    }
  }
});
</script>
<style lang="less" scoped>
.active {
  color: #3381e8;
  background-color: #fff;
  border-color: #3381e8;
}
.ant-checkbox-group {
  ::v-deep(.ant-checkbox-wrapper) {
    width: 33.3%;
    min-width: 150px;
    line-height: 30px;
    margin: 0;
  }
}
</style>
