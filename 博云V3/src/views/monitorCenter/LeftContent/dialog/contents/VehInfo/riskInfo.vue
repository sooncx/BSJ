<template>
  <div class="main">
    <div class="box">
      <div class="left">
        <div class="label">出省报警设置</div>
      </div>
      <div class="right">
        <DistPicker v-model:inputValue="citys" />
      </div>
    </div>
    <div class="box">
      <div class="left">
        <div class="label">经常停留点设置</div>
      </div>
      <div class="right">
        <div class="content">
          <div class="item">
            <div>家庭住址</div>
            <span @click="showAddress('home')">{{homeAddress}}</span>
            <i
              v-if="homeAddress != '未设置'"
              @click="clearAddress('home')"
              class="iconfont icon-shanchu1"
            ></i>
          </div>
          <div class="item">
            <div>公司住址</div>
            <span @click="showAddress('company')">{{companyAddress}}</span>
            <i
              v-if="companyAddress != '未设置'"
              @click="clearAddress('company')"
              class="iconfont icon-shanchu1"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="left">
        <div class="label">
          二押点报警启用
        </div>
      </div>
      <div class="right">
        <el-radio
          v-model="isTwoCharge"
          :label="true"
        >启用</el-radio>
        <el-radio
          v-model="isTwoCharge"
          :label="false"
        >关闭</el-radio>
      </div>
    </div>
    <div class="tip">
      <div>
        <p>二押点：</p>
        <span>防止车辆在二手抵押点停留，增加风险预防。</span>
      </div>
      <div>
        <p>绑定省市：</p>
        <span>绑定省市区域后，该车辆驶出所绑定的区域，触发超出区域报警。</span>
      </div>
      <div>
        <p>设置经常停留：</p>
        <span>当车辆连续三天不经过您设置的两点(范围：1000米)，系统会自动推送车辆异常停留报警。</span>
      </div>
      <div>
        <p>注意事项：</p>
        <span>风控设置只对指定本设备有效。</span>
      </div>
    </div>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
          v-permission="permission"
        >确 定</el-button>
      </span>
    </span>
  </div>
  <FenceDialog
    mapType="Amap"
    v-model:visible="fenceDialogVisible"
    :vehInfo="vehInfo"
    fenceType="addStayPoint"
    @enable="enable"
    @setAddress="setAddress"
    :stayPointOption="stayPointOption"
    :getStayPointDataBySelf="false"
  />
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  inject,
  nextTick,
} from "vue";
import { useFunction } from "../../../../function";
import DistPicker from "@/components/DistPicker/index.vue";
import lodash from "lodash";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    DistPicker,
    FenceDialog: defineAsyncComponent(
      () => import("@/components/Fence/index.vue")
    ),
  },
  props: {
    activeName: {
      type: String,
      default: "",
    },
    vehInfo: {
      type: Object,
      default: null,
    },
    riskInfoData: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    permission: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit, attrs }) {
    const { GetVehicleStayPoint } = useFunction();
    const editVehOk = inject("editVehOk") as Function;
    const store = useStore();
    const data = reactive({
      cityStr: "",
      citys: [],
      fenceDialogVisible: false,
      isTwoCharge: true,
      homeAddress: "未设置",
      companyAddress: "未设置",
      stayPointOption: {
        company: { lng: null, lat: null, address: "" } as any,
        home: { lng: null, lat: null, address: "" } as any,
      },
      async clearAddress(type: string) {
        let home = { lng: null, lat: null, address: "" };
        let company = { lng: null, lat: null, address: "" };
        if (type == "home") {
          data.homeAddress = "未设置";
          data.stayPointOption.home = { ...home };
        } else {
          data.companyAddress = "未设置";
          data.stayPointOption.company = { ...company };
        }
      },
      showAddress(type: String) {
        data.fenceDialogVisible = true;
      },
      setAddress(val: any) {
        data.homeAddress = val.home.address || "未设置";
        data.companyAddress = val.company.address || "未设置";
        data.stayPointOption = val;
      },
      enable: function (val: any) {
        console.log(val, "path");
      },
      confirm() {
        data.setOutputData();
        editVehOk();
      },
      close() {
        emit("update:visible", false);
      },
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
      // 将修改后的数据emit出去
      setOutputData() {
        const riskInfoDataCopy = {
          homeAddress: data.homeAddress,
          companyAddress: data.companyAddress,
          stayPointOption: data.stayPointOption,
          isTwoCharge: data.isTwoCharge,
          citys: data.citys,
        };
        emit("update:riskInfoData", riskInfoDataCopy);
      },
    });

    nextTick(() => {
      watch(
        () => props.riskInfoData,
        (val) => {
          setRiskInfoData(val);
        },
        {
          deep: true,
        }
      );
      watch(
        () => data.citys,
        (val) => {
          console.log(val, "citys");
        },
        {
          immediate: true,
        }
      );
      // 切换前4个tab页后将数据emit出去
      watch(
        () => props.activeName,
        (val, old) => {
          if (val != "4" && old == "4") {
            data.setOutputData();
          }
        }
      );
    });
    function setRiskInfoData(stayPointRes: any) {
      const copyData = lodash.cloneDeep(stayPointRes);
      data.homeAddress =
        copyData.homeAddress == "" ? "未设置" : copyData.homeAddress;
      data.companyAddress =
        copyData.companyAddress == "" ? "未设置" : copyData.companyAddress;
      data.stayPointOption = copyData.stayPointOption;
      data.isTwoCharge = copyData.isTwoCharge;
      data.citys = copyData.citys;
    }

    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-top: 5px;
  .box {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .left {
      width: 120px;
      white-space: nowrap;
      div {
        text-align: right;
        padding-right: 20px;
      }
    }
    .right {
      flex: 1;
      ::v-deep(.el-input__inner) {
        width: 250px;
        height: 34px;
        margin: 0;
      }
      .content {
        height: 60px;
        border: 1px solid #d9e0e9;
        display: inline-block;
        padding: 5px 20px;
        min-width: 250px;
        text-align: center;
        .item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px 0;
          div {
            margin-right: 10px;
            white-space: nowrap;
          }
          span {
            color: blue;
            cursor: pointer;
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
            max-width: 500px;
            &:hover {
              color: skyblue;
            }
          }
          i {
            margin-left: auto;
            padding-left: 10px;
            color: #999;
            cursor: pointer;
            &:hover {
              color: blue;
            }
          }
        }
      }
    }
  }
  .tip {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff6ef;
    padding: 20px 10px;
    height: 150px;
    margin-bottom: 20px;
    & > div {
      display: flex;
      align-items: center;
      font-size: 13px;
      p {
        margin-right: 10px;
        white-space: nowrap;
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 700;
        color: #ef7210;
      }
      span {
        font-family: PingFang SC Bold, PingFang SC Bold-Bold;
        font-weight: 400;
        color: #ef7210;
      }
    }
  }
}
.footer {
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  border-top: 1px solid #d9e0e9;
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  ::v-deep(.el-button) {
    border-radius: 0 !important;
  }
  ::v-deep(.el-button--primary) {
    background: #0e60db !important;
    border-color: #0e60db !important;
    &:hover {
      opacity: 0.8;
    }
  }
}
::v-deep(.el-input__inner) {
  border-radius: 0;
}
</style>