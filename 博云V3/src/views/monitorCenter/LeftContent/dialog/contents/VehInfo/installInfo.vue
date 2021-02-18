<template>
  <div class="pabelBox">
    <el-form
      :inline="true"
      :model="formData"
      class="demo-form-inline"
    >
      <div class="item">
        <el-form-item label="安装人员">
          <el-input
            v-model="formData.installPerson"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="安装地点">
          <el-input
            v-model="formData.installPlace"
            clearable
          ></el-input>
        </el-form-item>
      </div>
      <div class="item remark">
        <el-form-item label="安装备注">
          <el-input
            v-model="formData.installRemark"
            type="textarea"
            resize="none"
            :rows="5"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="footer">
      <span class="dialog-footer">
        <!-- 用于布局的无用dom -->
        <span></span>
        <span>
          <el-button @click="close">取 消</el-button>
          <el-button
            type="primary"
            @click="confirm"
            v-permission="type == 'add'?1:permission"
          >确 定</el-button>
        </span>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  inject,
  nextTick,
} from "vue";
import lodash from "lodash";
export default defineComponent({
  props: {
    activeName: {
      type: String,
      default: "",
    },
    installInfoData: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "add",
    },
    permission: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const editVehOk = inject("editVehOk") as Function;
    const showToggle = inject("showToggle") as any;
    const data = reactive({
      formData: {
        installPerson: "",
        installPlace: "",
        installRemark: "",
      },
      confirm() {
        emit("update:installInfoData", data.formData);
        editVehOk();
      },
      close() {
        data.formData = {
          installPerson: "",
          installPlace: "",
          installRemark: "",
        };
        emit("update:visible", false);
      },
    });
    const { activeName } = toRefs(props);
    nextTick(() => {
      watch(
        showToggle,
        (val) => {
          if (!val) {
            data.formData = {
              installPerson: "",
              installPlace: "",
              installRemark: "",
            };
          }
        },
        {
          immediate: true,
        }
      );
      watch(activeName, (val, old) => {
        if (val != "3" && old == "3") {
          emit("update:installInfoData", data.formData);
        }
      });
      watch(
        () => props.installInfoData,
        (val) => {
          const copyData = lodash.cloneDeep(val);
          data.formData = copyData as any;
        },
        {
          deep: true,
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
.pabelBox {
  margin-top: 15px;
}
::v-deep(.el-input__inner) {
  width: 250px;
  height: 34px;
  border-radius: 0;
}
::v-deep(.el-form-item__label) {
  width: 100px;
  text-align: right;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.radio {
  width: 50%;
  float: left;
  padding-left: 25px;
}
::v-deep(.el-form-item) {
  margin-bottom: 15px;
}
.remark {
  width: 100%;
  ::v-deep(.el-textarea) {
    width: 658px;
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