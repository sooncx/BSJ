<template>
  <Eldialog
    v-bind="$attrs"
    v-model:visible="show"
    title="填写关注备注"
    width="600px"
  >
    <template v-slot:form>
      <div class="Attention">
        <div class="inputBox">
          <el-input
            style="width:400px"
            v-model="value"
            clearable
            @clear="clear"
          ></el-input>
        </div>
        <div class="btnBox">
          <div
            @click="add(item)"
            class="btn"
            v-for="item in btnList"
            :key="item"
          >{{item.label}}</div>
        </div>
      </div>
      <div class="footer">
        <span class="dialog-footer">
          <!-- 用于布局的无用dom -->
          <span></span>
          <span>
            <el-button @click="$emit('update:visible', false)">取 消</el-button>
            <el-button
              type="primary"
              @click="submit"
            >确定</el-button>
          </span>
        </span>
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
  reactive,
  computed,
  watch,
  inject,
} from "vue";
import Eldialog from "@/components/Eldialog/index.vue";
import { useFunction } from "../../function";
export default defineComponent({
  components: {
    Eldialog,
  },
  props: {
    vehInfo: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    Attentionlevel: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const OptionMenuDialogFn = inject("OptionMenuDialogFn") as Function;
    const { saveVehicleConcern, getRemarkList, showMsg } = useFunction();
    const data = reactive({
      value: "",
      list: new Set(),
      btnList: [
        {
          label: "停车超长",
          value: "停车超长",
        },
        {
          label: "拆除报警",
          value: "拆除报警",
        },
        {
          label: "风险监控",
          value: "风险监控",
        },
        {
          label: "故障状况",
          value: "故障状况",
        },
        {
          label: "误报",
          value: "误报",
        },
        {
          label: "其他",
          value: "其他",
        },
      ],
      clear() {
        data.list = new Set();
        data.value = "";
      },
      AttentionlevelFormat() {
        switch (props.Attentionlevel) {
          case "高":
            return 1;
            break;
          case "中":
            return 2;
            break;
          case "低":
            return 3;
            break;
          case "修改备注":
            return props.vehInfo.CL;
            break;
          default:
            return props.vehInfo.CL;
            break;
        }
      },
      // 获取备注列表
      async getRemarkListData() {
        const res = await getRemarkList();
        if (!res) return;
        data.btnList = [];
        let arr = JSON.parse(res);
        arr.map((item: any) => {
          data.btnList.push({
            label: item,
            value: item,
          });
        });
      },
      async submit() {
        const params = {
          vehicleId: props.vehInfo.V,
          concernLevel: data.AttentionlevelFormat(),
          remark: data.value,
        };
        const res = await saveVehicleConcern(params);
        if (res == 1) {
          showMsg("设置成功");
          OptionMenuDialogFn("刷新车辆车组列表");
          emit("update:visible", false);
        }
      },
      add(item: any) {
        data.list.add(item.value);
        data.value = [...data.list].join("/");
      },
    });
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });
    watch(
      () => props.visible,
      (val) => {
        if (!val) {
          data.clear();
        } else {
          data.getRemarkListData();
        }
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(props),
      ...toRefs(data),
      show,
    };
  },
});
</script>
<style lang="less" scoped>
.Attention {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
  .inputBox {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btnBox {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .btn {
      cursor: pointer;
      padding: 8px 10px;
      background: rgb(250, 250, 250);
      margin: 0 10px;
      color: #666;
      border-radius: 2px;
      border: 1px solid rgb(230, 230, 230);
      &:hover {
        border-color: rgb(87, 193, 255);
        color: rgb(87, 193, 255);
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
</style>