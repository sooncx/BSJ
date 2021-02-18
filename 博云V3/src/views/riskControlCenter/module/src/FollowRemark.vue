<template>
  <div class="followRemark">
    <el-input v-model="remark" placeholder="请输入备注"></el-input>

    <div class="followRemark__btngroup">
      <el-button type="info" size="mini" plain v-for="(item, index) in btnList" :key="index" @click="changeVal(item)">{{ item }}</el-button>
    </div>

    <div class="followRemark__btn">
      <a-button type="primary" @click="submit">确定</a-button>
      <a-button @click="cancel">取消</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    rowData: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const remark = ref();
    const btnList = ref([
      "停车超长",
      "拆除报警",
      "风险监控",
      "故障状况",
      "误报",
      "其他",
    ]);

    const changeVal = (val: string) => {
      if (remark.value) {
        remark.value += `/${val}`;
        return;
      }
      remark.value = val;
    }

    const submit = () => {
      emit("confirm", remark.value);
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      remark,
      btnList,
      changeVal,
      submit,
      cancel,
    };
  },
});
</script>
<style lang="less" scoped>
.followRemark {
  width: 100%;
  padding: 10px 20px;

  &__btngroup {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    button {
      margin-top: 10px;
      margin-left: 5px;
      &:nth-child(5),
      &:first-child {
        margin-left: 0;
      }
    }
  }

  &__btn {
    display: flex;
    justify-content: center;
    button:first-child {
      margin-right: 10px;
    }
  }
}
</style>
