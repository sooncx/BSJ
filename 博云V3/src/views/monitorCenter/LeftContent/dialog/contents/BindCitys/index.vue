<template>
  <div class="BindCitys">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      class="demo-form-inline"
      label-width="100px"
    >
      <el-form-item label="选择省市">
        <!-- <BasicAreaSelect v-model:value="areaVal" /> -->
        <DistPicker
          v-model:inputValue="areaVal"
          :inpusStyle="{width:'320px'}"
        />
      </el-form-item>
      <el-form-item
        label="包含下级车辆"
        v-if="isGroup"
      >
        <el-select v-model="formData.isAll">
          <el-option
            label="是"
            :value="1"
          ></el-option>
          <el-option
            label="否"
            :value="0"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="已绑定车辆"
        v-if="isGroup"
      >
        <el-select v-model="formData.isCover">
          <el-option
            label="覆盖"
            :value="1"
          ></el-option>
          <el-option
            label="不覆盖"
            :value="0"
          ></el-option>
        </el-select>
      </el-form-item>
      <div
        class="tip"
        v-if="isGroup"
      >绑定时有效</div>
    </el-form>
  </div>
  <div class="footer">
    <span class="dialog-footer">
      <!-- 用于布局的无用dom -->
      <span></span>
      <span>
        <el-button
          @click="close"
          v-if="!showReleaseBtn"
        >取 消</el-button>
        <el-button
          @click="release"
          v-else
          type="warning"
        >解 绑</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >绑 定</el-button>
      </span>
    </span>
  </div>
  <Eldialog
    width="340px"
    v-model:visible="inheritShow"
  >
    <template v-slot:all>
      <Model
        @confirm="inheritGroup"
        @cancle="inheritClose"
      >
        <span>是否继承所属车组绑定的省市区？</span>
      </Model>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  watch,
  nextTick,
} from "vue";
import { useFunction } from "../../../../function";
import { BasicAreaSelect } from "@/components/AreaSelect";
import { useStore } from "vuex";
import DistPicker from "@/components/DistPicker/index.vue";
import lodash from "lodash";
export default defineComponent({
  components: {
    BasicAreaSelect,
    DistPicker,
    Eldialog: defineAsyncComponent(
      () => import("@/components/Eldialog/index.vue")
    ),
    Model: defineAsyncComponent(
      () =>
        import("../../../../LeftContent/dialog/contents/RemoveAlarm/model.vue")
    ),
  },
  props: {
    dialogData: {
      type: Object || Array,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupInfo: {
      type: Object,
      default: () => {},
    },
    vehInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const {
      getAdminRegion,
      getAdminRegionGroup,
      bindAdminRegion,
      deleteAdminRegion,
      listAdminRegionGroup,
      deleteAdminRegionGroup,
      showAMsg,
    } = useFunction();
    const data = reactive({
      inheritShow: false,
      groupBindCity: null as any,
      normalList: new Map(),
      showReleaseBtn: false,
      ruleForm: null as any,
      formData: {
        isAll: 1,
        isCover: 0,
      },
      areaVal: [],
      submitForm: function (formName: any) {
        data.ruleForm.validate((valid: any) => {
          if (valid) {
            data.bindGroup();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm: function (formName: any) {
        data.ruleForm.resetFields();
      },
      async bindGroup(groupId = null, city = null) {
        let arr = [] as any;
        data.areaVal.map((cityName: string) => {
          arr.push([cityName, data.normalList.get(cityName).code].join("_"));
        });
        let cityStr = arr.join("|");
        const res = await listAdminRegionGroup({
          groupId: groupId || props.groupInfo.gi,
          isAll: data.formData.isAll,
          isCover: data.formData.isCover,
          address: city || cityStr,
        });
        if (res == 1) {
          showAMsg("绑定省市区成功");
          data.inheritShow = false;
          setTimeout(() => {
            emit("update:visible", false);
          }, 100);
        }
      },
      async confirm() {
        if (props.isGroup) {
          data.submitForm("ruleForm");
        } else {
          let arr = [] as any;
          data.areaVal.map((cityName: string) => {
            arr.push([cityName, data.normalList.get(cityName).code].join("_"));
          });
          let cityStr = arr.join("|");
          const res = await bindAdminRegion({
            vehicleId: props.vehInfo.V,
            address: cityStr,
          });
          if (res == 1) {
            showAMsg("绑定省市区成功");
            emit("update:visible", false);
          }
        }
      },
      release() {
        if (props.isGroup) {
          data.releaseBindGroup();
        } else {
          data.releaseBind();
        }
      },
      async releaseBindGroup() {
        const res = await deleteAdminRegionGroup({
          groupId: props.groupInfo.gi,
          isAll: data.formData.isAll,
          isCover: data.formData.isCover,
        });
        if (res == 1) {
          showAMsg("解除绑定省市区成功");
          data.areaVal = [];
          emit("update:visible", false);
        }
      },
      async releaseBind() {
        const res = await deleteAdminRegion({
          vehicleId: props.vehInfo.V,
          isGroup: 0,
        });
        if (res) {
          showAMsg("解除绑定省市区成功");
          data.areaVal = [];
          data.groupBindCity = res;
          data.inheritShow = true;
        } else {
          showAMsg("解除绑定省市区成功");
          data.areaVal = [];
          emit("update:visible", false);
        }
      },
      inheritGroup() {
        data.bindGroup(props.vehInfo.M, data.groupBindCity);
      },
      inheritClose() {
        data.inheritShow = false;
        data.areaVal = [];
        setTimeout(() => {
          emit("update:visible", false);
        }, 100);
      },
      rules: {},
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
      close() {
        data.areaVal = [];
        setTimeout(() => {
          emit("update:visible", false);
        }, 100);
      },
    });
    nextTick(() => {
      watch(
        () => props.visible,
        async (val) => {
          data.normalList = data.treeConvertList(store.state.citys);
          data.showReleaseBtn = false;
          if (!val) {
            data.areaVal = [];
            return;
          }
          if (props.isGroup) {
            const res = await getAdminRegionGroup(props.groupInfo.gi);
            if (!res) {
              data.areaVal = [];
              return;
            }
            const { address, isAll, isCover } = res;
            if (address) {
              let citys = [];
              if (address.split("|")[0].split("_").length > 1) {
                address.split("|").map((item: string) => {
                  citys.push(item.split("_")[0]);
                });
              } else {
                citys = address.split("|");
              }
              data.areaVal = citys;
              data.showReleaseBtn = true;
            }
            data.formData.isAll = isAll;
            data.formData.isCover = isCover;
          } else {
            const res = await getAdminRegion(props.vehInfo.V);
            if (res) {
              data.showReleaseBtn = true;
              data.areaVal = res.split("|");
            } else {
              data.areaVal = [];
            }
          }
        },
        {
          immediate: true,
        }
      );
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.BindCitys {
  width: 100%;
  padding: 30px 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .codeBox {
    width: 300px;
    margin-left: -75px;
  }
}
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
}
.tip {
  position: relative;
  top: -10px;
  right: -100px;
  color: #999999;
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
}
::v-deep(.el-select .el-input__inner) {
  width: 320px;
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
</style>