<template>
  <div class="dataReport">
    <div class="dataReport__left">
      <Slide
        :list="permissionData"
        :defaultPage="list.default"
        :openOptions="list.openOptions"
        @change="jump"
        :histroyModel="list.histroyModel"
      />
    </div>
    <div class="dataReport__right">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import router from "@/router";
import Slide from "@/components/Slide/index.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "dateReport",
  components: { Slide },
  setup() {
    function jump(val: string) {
      router.push({ name: val });
    }
    const list = reactive({
      histroyModel: true,
      data: [
        {
          id: 1501,
          value: "alarmInfo",
          label: "报警记录",
          icon: "icon-baojing",
          children: [],
        },
        {
          id: 1502,
          value: "offline",
          label: "离线统计",
          icon: "icon-lixian",
          children: [],
        },
        {
          id: 1503,
          value: "drivingStatistics",
          label: "行车统计",
          icon: "icon-luxian",
          children: [],
        },
        {
          id: 1504,
          value: "parkingReport",
          label: "停车报表",
          icon: "icon-tingche",
          children: [],
        },
        {
          id: 1505,
          value: "frequentStops",
          label: "经常停留点",
          icon: "icon-didian",
          children: [],
        },
        {
          id: 1506,
          value: "remainderElectric",
          label: "剩余电量",
          icon: "icon-tubiaokuozhan-",
          children: [],
        },
        {
          id: 1507,
          value: "mileageReport",
          label: "里程报表",
          icon: "icon-licheng1",
          children: [],
        },
        {
          id: 1508,
          value: "totalMileage",
          label: "总里程查询",
          icon: "icon-licheng",
          children: [],
        },
        {
          id: 1509,
          value: "instruction",
          label: "指令查询",
          icon: "icon-zhiling",
          children: [],
        },
        {
          id: 1510,
          value: "operationRecord",
          label: "操作记录",
          icon: "icon-caozuo",
          children: [],
        },
        {
          id: 1511,
          value: "maintainReport",
          label: "保养报表",
          icon: "icon-baoyang",
          children: [],
        },
        {
          id: 1512,
          value: "insuranceReport",
          label: "保险报表",
          icon: "icon-baoxian",
          children: [],
        },
        {
          id: 1513,
          value: "obdReport",
          label: "OBD报表",
          icon: "icon-paifangbiaozhun",
          children: [],
        },
        {
          id: 1514,
          value: "lockAlarmRecord",
          label: "物流锁报警记录",
          icon: "icon-jilu1",
          children: [],
        },
        {
          id: 1515,
          value: "lockOperationRecord",
          label: "物流锁操作记录",
          icon: "icon-jilu",
          children: [],
        },
      ],
    });
    const store = useStore();
    const permissionData = computed(() => {
      let arr: any[] = [];

      list.data.forEach((option: any) => {
        let flag = true;
        if (flag) {
          store.state.dataReportMenu.forEach((item: any) => {
            if (item.id === option.id) {
              arr.push(option);
              flag = false;
            }
          });
        }
      });
      return arr;
    });

    return {
      permissionData,
      list,
      jump,
    };
  },
});
</script>
<style lang="less" scoped>
.dataReport {
  height: 100%;
  width: 100%;
  display: flex;
  &__left {
    width: 200px;
    height: 100%;
    background: #001529;
    overflow-y: auto;
  }
  &__right {
    height: 100%;
    width: calc(100% - 200px);
    flex: 1;
    background: #f1f3f6;
    padding-left: 16px;
  }
}
@media screen and (max-width: 980px) {
  .dataReport__left {
    width: 60px;
  }
   .dataReport__right {
    width: calc(100% - 60px);
  }
}
</style>