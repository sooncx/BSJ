<template>
  <el-select
    ref="selectRef"
    v-model="val"
    :placeholder="placeholder"
    size="small"
    filterable
    :style="inputStyle"
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    :clearable="true"
    @change="handlerChange"
  >
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="item.name"
      :value="item.userId"
    >
      <div class="userSearch__item">
        <p>
          <span>用户名:{{ item.name }},</span
          ><span>公司名:{{ item.corpName }}</span>
        </p>
        <el-tag
          size="small"
          type="danger"
          v-if="item.delFlag === 1"
          style="float: right"
          >已删除</el-tag
        >
      </div>
    </el-option>
  </el-select>
</template>
<script lang="ts">
import { defineComponent, reactive,PropType, toRefs, ref } from "vue";
import API from "@/api/manageData";

export default defineComponent({
  props: {
    value: Number,
    /**
     * 1 时查询操作记录删除的用户(带delFlag)
     * 0 时返回数据不带delFlag
     */
    type: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '请选择用户'
    },
    inputStyle: {
      type: Object as PropType<any>,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      selectRef: ref(''),
      loading: false,
      val: "",
      options: [],
      remoteMethod: async (query: string) => {
        if (query !== "") {
          data.loading = true;
          const { obj } = await API.searchUser({
            name: query,
            type: props.type,
          });
          data.options = obj;
          data.loading = false;
        } else {
          data.options = [];
        }
      },
      handlerChange: (value: number) => {
        emit("update:value", value);
      }
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.userSearch {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      margin-right: 20px;
    }
  }
}
</style>
