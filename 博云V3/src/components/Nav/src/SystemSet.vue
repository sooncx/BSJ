<template>
  <ul class="systemSet">
    <li v-for="(item, index) in list" :key="index">
      <div class="systemSet__left">
        <p class="systemSet__title">{{ item.name }}</p>
        <p class="systemSet__desc">{{ item.remark }}</p>
      </div>
      <div class="systemSet__right">
        <el-switch
          v-model="item.checked"
          active-color="#13ce66"
          inactive-color="#bdbdbd"
        >
        </el-switch>
      </div>
    </li>
  </ul>
  <div class="btnBox">
    <a-button type="primary" @click="submit">保存</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import API from "@/api/httpApi";
import { useMessage } from "@/hooks/web/useMessage";
import router from "@/router";

interface listType {
  permissionId: number;
  name: string;
  remark: string;
  checked: boolean;
}

export default defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore();
    const messgage = useMessage();
    const list = ref<listType[]>([]);

    watchEffect(() => {
      let arr: listType[] = [];
      store.state.systemSetList.forEach((item: any) => {
        arr.push({
          permissionId: item.permissionId,
          name: item.name,
          remark: item.remark,
          checked: true,
        });
      });
      list.value = arr;
    });

    const getData = async () => {
      const { obj } = await API.userPermissionList();

      if (obj && obj.length !== 0) {
        list.value.forEach((item) => {
          obj.forEach((items: any) => {
            if (item.permissionId == items.permissionId) {
              item.checked = items.status === 0 ? true : false;
            }
          });
        });
      }
    };

    nextTick(() => {
      getData();
    });

    const submit = async () => {
      const info = list.value.map((item) => {
        return {
          permissionId: item.permissionId,
          status: item.checked ? 0 : 1,
        };
      });

      const { flag, msg } = await API.updatePermissionList(info);

      if (flag === 1) {
        messgage.success(msg);
        store.commit("COMMIT_SYSTEMSETLIST", list.value);
        workSheetFn();
        emit("update:visible", false);
      } else {
        messgage.error(msg);
      }
    };

    const { currentRoute, replace } = router;
    const workSheetFn = () => {
      const workSheet = list.value.filter(
        (item: any) => item.permissionId === 11
      );
      const flag = workSheet ? workSheet[0].checked : true;
      if (
        !flag &&
        (currentRoute.value.meta.id === 1606 ||
          currentRoute.value.meta.id === 1607)
      ) {
        replace('/manageData/pages/userManage');
      }
    };

    return {
      list,
      submit,
    };
  },
});
</script>
<style lang="less" scoped>
.systemSet {
  width: 100%;
  padding: 0 24px 20px;

  li {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 15px;
    margin-bottom: 6px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: left;
    color: #333333;
  }

  &__desc {
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
  }
}
.btnBox {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
