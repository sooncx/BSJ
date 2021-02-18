<template>
  <div class="ContentTable">
    <div class="header">
      <div
        v-for="(item, index) in dataList.label"
        :key="index"
      >
        {{item.name}}
      </div>
    </div>
    <div class="content" v-if="dataList.data.length !== 0">
      <div
        v-for="(item, index) in dataList.label"
        :key="index"
      >
        <div
          v-for="(items, i) in dataList.data"
          :key="i"
          :title="items[item.prop]"
        >
          {{items[item.prop]}}
        </div>
      </div>
    </div>
    <div class="nothing" v-else>
      暂无数据
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    dataList: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const L = [
      Math.floor(60 / (props.dataList.label.length - 1)),
      "%",
    ].join("");
    return {
      L,
    };
  },
});
</script>
<style lang="less" vars={L}>
.ContentTable {
  display: flex;
  flex-direction: column;
  color: #fefefe;
  height: 100%;
  width: 100%;
  font-size: 12px;
  .header {
    padding: 0 10px;
    height: 28px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #002c54;
    div {
      width: var(--L);
      text-align: left;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      &:nth-last-of-type(1) {
        width: 30%;
      }
    }
  }
  .content {
    padding: 5px 10px;
    height: calc(100% - 28px);
    width: 100%;
    display: flex;
    justify-content: space-between;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      width: 0px;
      background-color: rgba(144, 147, 153, 0.3);
      transition: background-color 0.3s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: rgba(144, 147, 153, 0.5);
    }
    & > div {
      width: var(--L);
      text-align: left;
      &:nth-last-of-type(1) {
        width: 30%;
      }
      & > div {
        padding: 5px 0;
        max-width: 99%;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
    }
  }
}
.nothing {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
