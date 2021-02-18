<template>
  <a-select
    show-search
    :value="value"
    style="width: 200px"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :dropdownMatchSelectWidth="false"
    :not-found-content="null"
    optionLabelProp="text"
    @search="handleSearch"
    @change="handleChange"
    placeholder="请输入关键词"
  >
    <a-select-option
      v-for="item in options"
      :key="item.userId"
      :text="item.name"
    >
      <!-- item.delFlag 0未删除 1已删除 -->
      <div class="userItemsBox">
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
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useDebounce } from "@/hooks/core/useDebounce";
import { useStore } from "vuex";
import API from "@/api/manageData";

export default defineComponent({
  name: "UserSearch",
  props: {
    value: {
      type: Number as PropType<number>,
    },
    /**
     * 1 时查询操作记录删除的用户(带delFlag)
     * 0 时返回数据不带delFlag
     */
    type: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const options = ref();
    const store = useStore();

    const [debounceChange] = useDebounce(fuzzyData, 200);

    async function fuzzyData(value: string) {
      try {
        if (value.length > 0) {
          const { obj } = await API.searchUser({
            name: value,
            type: props.type,
          });
          options.value = obj;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const handleSearch = (value: string) => {
      debounceChange(value);
    };

    const handleChange = (id: number) => {
      emit("update:value", id);
    };

    return {
      options,
      handleSearch,
      handleChange,
    };
  },
});
</script>
<style lang="less" scoped>
.userItemsBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin-right: 20px;
  }
}
</style>
