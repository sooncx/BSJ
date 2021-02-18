<template>
  <div
    class="user-dropdown"
    :style="{ top: visible ? '-200px' : '50px' }"
    ref="dropdownRef"
  >
    <div class="user-dropdown__header">账号： {{ USER && USER.name }}</div>
    <ul class="user-dropdown__content">
      <li
        v-for="(item, index) in list"
        :key="index"
        :style="{ color: item.color || '' }"
        @click="listChange(item)"
      >
        <i :class="item.icon" class="iconfont"></i>
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, Ref, inject, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useGo } from "@/hooks/web/usePage";
import { useStore } from "vuex";
import API from "@/api/httpApi";

export default defineComponent({
  name: "userDropdown",
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const list = ref([
      {
        icon: "icon-xiugai",
        text: "修改密码",
        type: "password",
      },
      {
        icon: "icon-xitong",
        text: "系统设置",
        type: "system",
      },
      {
        icon: "icon-ziliao",
        text: "导出资料",
        type: "exportData",
      },
      {
        icon: "icon-tuichu",
        text: "退出登录",
        color: "#0E60DB",
        type: "loginOut",
      },
    ]);

    const USER = computed(() => store.state.USER);

    const dropdownRef = ref(null);

    document.addEventListener("click", (e) => {
      const user = document.getElementsByClassName("Nav__user")[0];
      if (!dropdownRef.value || !user) return;
      if (
        !(dropdownRef.value as any).contains(e.target) &&
        !(user as any).contains(e.target)
      ) {
        emit("update:visible", true);
      }
    });

    const go = useGo();
    const navModal = <Ref<(val: string) => void>>inject("navModal");

    const listChange = async (row: { type: string }) => {
      if (row.type === "loginOut") {
        ElMessageBox.confirm("此操作将退出当前账号, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { flag, msg } = await API.logout();
            if (flag === 1) {
              ElMessage.success("退出成功");
              store.commit("COMMIT_CLEAR");
              go("/login", true);
            } else {
              ElMessage.error(msg);
            }
          })
          .catch(() => {
            ElMessage.info("已取消退出");
          });
      }

      if (row.type === "exportData") {
        await API.GetInformation();
        navModal.value("download");
      }

      if (row.type === "password" || row.type === "system") {
        emit("menuClick", row.type);
      }
      emit("update:visible", true);
    };

    return {
      list,
      dropdownRef,
      listChange,
      USER,
    };
  },
});
</script>
<style lang="less" scoped>
.user-dropdown {
  position: absolute;
  z-index: 101;
  right: 0;
  width: 220px;
  min-height: 140px;
  background: #fff;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  transition: top 0.5s;

  &__header {
    height: 44px;
    line-height: 44px;
    width: 220px;
    background: #f6f6f6;
    padding: 0 16px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: left;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 16px;

    li {
      width: 50%;
      height: 45px;
      line-height: 45px;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #636363;
      cursor: pointer;
      transition: all 0.2s;
      &:nth-child(2n) {
        text-align: center;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>