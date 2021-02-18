<template>
  <div class="manageData">
    <div class="manageData__left">
      <Slide
        :list="permissionData"
        :defaultPage="list.default"
        :openOptions="list.openOptions"
        @change="jump"
        :histroyModel="list.histroyModel"
      />
    </div>
    <div class="manageData__right">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, defineComponent, computed,ref,provide } from "vue";
import router from "@/router";
import Slide from "../../components/Slide/index.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "manageData",
  components: {
    Slide,
  },
  setup() {
    function jump(val: string) {
      router.push({ name: val });
    }
    const list = reactive({
      histroyModel: true,
      data: [
        {
          id: 1601,
          value: "userManage",
          label: "用户管理",
          icon: "icon-yonghu",
          children: [],
        },
        {
          id: 1602,
          value: "carManage",
          label: "车辆管理",
          icon: "icon-cheliang",
          children: [],
        },
        {
          id: 1603,
          value: "stepsImport",
          label: "批量导入",
          icon: "icon-daoru",
          children: [],
        },
        {
          id: 1604,
          value: "carRecharge",
          label: "车辆续费",
          icon: "icon-xufei1",
          children: [],
        },
        {
          id: 1605,
          value: "settleList",
          label: "结清列表",
          icon: "icon-wanjie",
          children: [],
        },
        {
          id: 1606,
          value: "workSheet",
          label: "工单管理",
          icon: "icon-gongdan",
          children: [],
        },
        {
          id: 1607,
          value: "installWorker",
          label: "安装人员管理",
          icon: "icon-weixiushifu",
          children: [],
        },
      ],
    });

    if (process.env.NODE_ENV === "development") {
      list.data.push(
        {
          id: 1608,
          value: "roleManage",
          label: "角色管理",
          icon: "icon-jiaose",
          children: [
          ],
        }
      );
    }

    const store = useStore();
    const permissionData = computed(() => {
      let arr: any[] = [];
      list.data.forEach((option: any) => {
        let flag = true;
        if (flag) {
          store.state.manageDataMenu.forEach((item: any) => {
            if (item.id === option.id) {
              arr.push(option);
              flag = false;
            }
          });
        }
      });

      // 系统设置工单菜单显示
      const sysPermissions = store.state.systemSetList;
      const workSheet = sysPermissions.filter(
        (item: any) => item.permissionId === 11
      );
      const sysflag = workSheet ? workSheet[0].checked : true;
      let myMap = new Map();
      arr.map((item: any) => {
        myMap.set(item.id, item);
      });
      if (!sysflag) {
        myMap.delete(1606);
        myMap.delete(1607);
      }

      return [...myMap.values()];
    });

    
    let seleceUserId = ref() as any;
    provide("seleceUserId", seleceUserId);
    provide("updateSelectUserId", (val: any) => {
      seleceUserId.value = val;
    });
    

    return {
      list,
      jump,
      permissionData,
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>