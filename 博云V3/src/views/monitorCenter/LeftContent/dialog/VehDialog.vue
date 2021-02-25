<template>
  <Eldialog
    v-bind="$attrs"
    v-model:visible="show"
    :DialogType="DialogType"
    :title="title"
  >
    <template v-slot:form>
      <div class="tabPabel">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="基本信息"
            name="1"
          >
            <BasicInfo
              v-model:visible="show"
              v-bind="$attrs"
              :vehInfo="vehInfo"
              v-model:addGroupInfo="addGroupInfo"
              :activeName="activeName"
              :type="type"
              v-model:basicInfoData="basicInfoData"
              :permission="permission"
              @SettlementConfirm="searchVehs"
            />
          </el-tab-pane>
          <el-tab-pane
            label="车主信息"
            name="2"
          >
            <UserInfo
              v-model:visible="show"
              v-model:userInfoData="userInfoData"
              v-bind="$attrs"
              :type="type"
              :permission="permission"
              :activeName="activeName"
            />
          </el-tab-pane>
          <el-tab-pane
            label="安装信息"
            name="3"
          >
            <InstallInfo
              v-model:visible="show"
              v-model:installInfoData="installInfoData"
              v-bind="$attrs"
              :type="type"
              :permission="permission"
              :activeName="activeName"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="['modify', 'update'].includes(type)"
            label="风控信息"
            name="4"
          >
            <RiskInfo
              v-model:visible="show"
              v-bind="$attrs"
              :vehInfo="vehInfo"
              :activeName="activeName"
              :permission="permission"
              v-model:riskInfoData="riskInfoData"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="['modify', 'update'].includes(type)"
            label="保险信息"
            name="5"
          >
            <Insurance
              v-model:visible="show"
              v-bind="$attrs"
              :vehInfo="vehInfo"
              :activeName="activeName"
              v-model:insuranceData="insuranceData"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="['modify', 'update'].includes(type)"
            label="保养信息"
            name="6"
          >
            <Maintenance
              v-model:visible="show"
              v-bind="$attrs"
              :vehInfo="vehInfo"
              :activeName="activeName"
              v-model:maintenceData="maintenceData"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  toRefs,
  defineAsyncComponent,
  ref,
  watch,
  reactive,
  computed,
  provide,
  inject,
} from "vue";
import router from "@/router";
import lodash from "lodash";
import { useStore } from "vuex";
import dayJs from "dayjs";
import { useFunction } from "../../function";
import Eldialog from "@/components/Eldialog/index.vue";
import BasicInfo from "../dialog/contents/VehInfo/basicInfo.vue";
import RiskInfo from "../dialog/contents/VehInfo/riskInfo.vue";
import UserInfo from "../dialog/contents/VehInfo/userInfo.vue";
import InstallInfo from "../dialog/contents/VehInfo/installInfo.vue";
import Insurance from "../dialog/contents/VehInfo/insurance.vue";
import Maintenance from "../dialog/contents/VehInfo/maintenance.vue";
import { AmapGetOneAddress } from "../../map/mapFn";
export default defineComponent({
  components: {
    Eldialog,
    BasicInfo,
    RiskInfo,
    UserInfo,
    InstallInfo,
    Insurance,
    Maintenance,
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    DialogType: {
      type: String,
      default: "车辆资料",
    },
    title: {
      type: String,
      default: "车辆资料",
    },
    type: {
      type: String,
      default: "add",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    groupInfo: {
      type: Object,
      default: null,
    },
  },
  emits: ["editOk", "update:visible"],
  setup(props, { emit, attrs }) {
    const OptionMenuDialogFn = ["monitorCenter"].includes(
      router.currentRoute.value.name as string
    )
      ? (inject("OptionMenuDialogFn") as Function)
      : null;
    const store = useStore();
    const {
      GetVehicleStayPoint,
      getAddress,
      saveVehicle,
      updateVehicle,
      searchVehicleInfo,
      showAMsg,
      getMaintain,
      GetInsuranceDate,
    } = useFunction();
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    provide("showToggle", show);
    const updateShow = (val: boolean) => {
      show.value = val;
    };
    provide("updateShow", updateShow);
    const data = reactive({
      addGroupInfo: null,
      vehGroupId: null,
      activeName: "1",
      permission: 160209,
      // 风控数据
      riskInfoData: {
        homeAddress: "未设置",
        companyAddress: "未设置",
        stayPointOption: {
          company: { lng: null, lat: null, address: "" } as any,
          home: { lng: null, lat: null, address: "" } as any,
        },
        isTwoCharge: true,
        citys: [],
      },
      // 车辆基本信息数据
      basicInfoData: {
        plate: "",
        sim: "",
        mac: "",
        terminalType: null,
        terminalNo: "",
        groupId: null,
        groupName: "",
        frameNo: "",
        engineNo: "",
        vehicleType: "",
        iccid: "",
        serviceCode: "",
        activationTmeStr: "",
        installDate: "",
        owner: "",
        settle: 0,
        displayYear: "未选择",
        remark: "",
      } as any,
      // 车主信息
      userInfoData: {
        license: "",
        phone: "",
        address: "",
      } as any,
      // 安装信息
      installInfoData: {
        installPerson: "",
        installPlace: "",
        installRemark: "",
      } as any,
      // 保养信息
      maintenceData: {
        currentMileage: "",
        lastMileage: "",
        lastMaintainTime: "",
        leadTime: "",
        advanceKilometers: "",
        remark: "",
      } as any,
      // 保险信息
      insuranceData: {
        type: "2",
        loginTime: "",
        leadTime: "",
        insuranceType: [],
        insuranceCompany: "",
        amountMoney: "",
        remark: "",
      } as any,
      // 树状图转扁平数据
      treeConvertList(root: any) {
        const listMap = new Map();
        if (root) {
          const queue = lodash.cloneDeep(root);
          while (queue.length) {
            const node = queue.shift();
            if (node.list && node.list.length) {
              queue.push(...node.list);
            }
            delete node.list;
            listMap.set(node.name, node);
          }
        }
        return listMap;
      },
      // 设置风控数据
      riskDataFormat() {
        let homeData = null;
        homeData =
          data.riskInfoData.stayPointOption.home &&
          data.riskInfoData.stayPointOption.home.lat
            ? [
                1,
                data.riskInfoData.stayPointOption.home.lat,
                data.riskInfoData.stayPointOption.home.lng,
                1000,
              ].join(",")
            : null;
        let companyData = null;
        companyData =
          data.riskInfoData.stayPointOption.company &&
          data.riskInfoData.stayPointOption.company.lat
            ? [
                2,
                data.riskInfoData.stayPointOption.company.lat,
                data.riskInfoData.stayPointOption.company.lng,
                1000,
              ].join(",")
            : null;
        const stayPointStr =
          homeData && companyData
            ? [homeData, companyData].join(";")
            : homeData
            ? homeData
            : companyData
            ? companyData
            : "";
        let normalList = data.treeConvertList(store.state.citys);
        let arr = [] as any;
        data.riskInfoData.citys.map((cityName: string) => {
          arr.push([cityName, normalList.get(cityName).code].join("_"));
        });
        let cityStr = arr.join("|");
        const outputRiskInfoData = {
          twoCharge: data.riskInfoData.isTwoCharge,
          address: cityStr,
          staypoint: stayPointStr == ";" ? "" : stayPointStr,
        };
        return outputRiskInfoData;
      },
      handleClick: function () {},
    });
    // 添加/修改车辆数据
    const editVehOk = async () => {
      if (props.type == "add") {
        const params = {
          ...data.basicInfoData,
          ...data.userInfoData,
          ...data.installInfoData,
        };
        params.installDate = params.installDate
          ? dayJs(params.installDate).format("YYYY-MM-DD HH:mm:ss")
          : null;
        const res = await saveVehicle(params);
        if (res == 1) {
          show.value = false;
          showAMsg("添加车辆成功!");
          OptionMenuDialogFn && OptionMenuDialogFn("刷新车辆车组列表");
          emit("editOk");
        }
      } else {
        const params = {
          updateVehicleInfo: {
            ...data.basicInfoData,
            ...data.userInfoData,
            ...data.installInfoData,
            vehicleId: props.vehInfo.V,
          },
          alarmUtil: {
            ...data.riskDataFormat(),
            vehId: props.vehInfo.V,
            groupId: props.vehInfo.M || data.vehGroupId,
          },
        };
        params.updateVehicleInfo.installDate = params.updateVehicleInfo
          .installDate
          ? dayJs(params.updateVehicleInfo.installDate).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          : null;
        const res = await updateVehicle(params);
        if (res == 1) {
          show.value = false;
          showAMsg("修改车辆成功!");
          OptionMenuDialogFn && OptionMenuDialogFn("刷新车辆列表");
          emit("editOk");
        }
      }
    };
    provide("editVehOk", editVehOk);
    // 重置
    function clear() {
      data.activeName = "1";
      data.riskInfoData = {
        homeAddress: "未设置",
        companyAddress: "未设置",
        isTwoCharge: true,
        citys: [],
        stayPointOption: {
          company: { lng: null, lat: null, address: "" } as any,
          home: { lng: null, lat: null, address: "" } as any,
        },
      };
    }
    // 查询车辆信息并赋值
    async function searchVehs() {
      const res = await searchVehicleInfo(props.vehInfo.V);
      if (!res || !res.data) return;
      let basicInfoDataCopy = lodash.cloneDeep(data.basicInfoData);
      let userInfoDataCopy = lodash.cloneDeep(data.userInfoData);
      let installInfoDataCopy = lodash.cloneDeep(data.installInfoData);
      data.vehGroupId = res.groupId;
      for (let i in data.basicInfoData) {
        basicInfoDataCopy[i] = res.data[i];
      }
      data.basicInfoData = { ...basicInfoDataCopy };
      data.basicInfoData.settle = data.basicInfoData.settle;
      for (let i in data.userInfoData) {
        userInfoDataCopy[i] = res.data[i];
      }
      data.userInfoData = { ...userInfoDataCopy };
      for (let i in data.installInfoData) {
        installInfoDataCopy[i] = res.data[i];
      }
      data.installInfoData = { ...installInfoDataCopy };
      const { areaName, stayPaint, isTwoCharge } = res.data.extend;
      data.riskInfoData.isTwoCharge = isTwoCharge;
      areaName && (data.riskInfoData.citys = areaName.split("|"));
      getStayPointsData(stayPaint);
    }
    // 获取保养数据
    async function getMaintainData() {
      const res = await getMaintain(props.vehInfo.V);
      if (!res || !res.data) return;
      let maintenceDataCopy = lodash.cloneDeep(data.maintenceData);
      for (let i in data.maintenceData) {
        maintenceDataCopy[i] = res.data[i];
      }
      data.maintenceData = { ...maintenceDataCopy };
    }
    // 获取保险信息
    async function getInsuranceData() {
      const res = await GetInsuranceDate(props.vehInfo.V);
      if (!res || !res.data) return;
      let insuranceDataCopy = lodash.cloneDeep(data.insuranceData);
      for (let i in data.insuranceData) {
        insuranceDataCopy[i] = res.data[i];
      }
      data.insuranceData = { ...insuranceDataCopy };
    }
    // 获取风控数据
    async function getStayPointsData(stayPointRes: string) {
      if (!stayPointRes) return;
      const arr = stayPointRes.split(";");
      // 若该车没有设置经常停留点
      if (arr.length == 0) {
        data.riskInfoData.homeAddress = "";
        data.riskInfoData.companyAddress = "";
        return;
      }
      arr.map((item: any) => {
        if (item.split(",")[0] == "1") {
          data.riskInfoData.stayPointOption.home.lat = parseFloat(
            item.split(",")[1]
          );
          data.riskInfoData.stayPointOption.home.lng = parseFloat(
            item.split(",")[2]
          );
        } else if (item.split(",")[0] == "2") {
          data.riskInfoData.stayPointOption.company.lat = parseFloat(
            item.split(",")[1]
          );
          data.riskInfoData.stayPointOption.company.lng = parseFloat(
            item.split(",")[2]
          );
        }
      });
      // 从后台获取的停留点数据是wg84格式,需要纠偏后再显示在高德地图上
      AmapGetOneAddress(data.riskInfoData.stayPointOption.home).then(
        (res: any) => {
          data.riskInfoData.homeAddress = res.address;
        }
      );
      AmapGetOneAddress(data.riskInfoData.stayPointOption.company).then(
        (res: any) => {
          data.riskInfoData.companyAddress = res.address;
        }
      );
      // const res = await getAddress([
      //   data.riskInfoData.stayPointOption.home,
      //   data.riskInfoData.stayPointOption.company,
      // ]);
      // data.riskInfoData.homeAddress = res[0].address;
      // data.riskInfoData.companyAddress = res[1].address;
    }
    watch(
      () => props.visible,
      (val) => {
        if (val) {
          if (props.type != "add") {
            if (!props.vehInfo || !props.vehInfo.V) {
              showAMsg("车辆id不存在或格式不对!");
              return;
            }
            searchVehs();
            getMaintainData();
            getInsuranceData();
          } else {
            if (!props.groupInfo) return;
            data.addGroupInfo = { ...props.groupInfo } as any;
          }
        } else {
          setTimeout(() => {
            clear();
          }, 200);
        }
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(props),
      ...toRefs(data),
      searchVehs,
      confirm,
      show,
    };
  },
});
</script>
<style lang="less" scoped>
.tabPabel {
  padding: 0 16px;
  ::v-deep(.el-tabs__header) {
    margin-bottom: 0 !important;
  }
  ::v-deep(.el-tabs__nav-wrap::after) {
    // background: transparent !important;
    height: 1px;
  }
}
</style>