<template>
  <div class="pabelBox">
    <el-form
      :inline="true"
      :model="formData"
      class="demo-form-inline"
    >
      <div class="item">
        <el-form-item label="证件号">
          <el-input
            v-model="formData.license"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="formData.phone"
            clearable
          ></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="地址">
          <el-input
            v-model="formData.address"
            clearable
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
    userInfoData: {
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
  setup(props, { emit, attrs }) {
    const editVehOk = inject("editVehOk") as Function;
    const showToggle = inject("showToggle") as any;
    const data = reactive({
      formData: {
        license: "",
        phone: "",
        address: "",
      },
      confirm() {
        emit("update:userInfoData", data.formData);
        editVehOk();
      },
      close() {
        data.formData = {
          license: "",
          phone: "",
          address: "",
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
              license: "",
              phone: "",
              address: "",
            };
          }
        },
        {
          immediate: true,
        }
      );
      watch(activeName, (val, old) => {
        if (val != "2" && old == "2") {
          emit("update:userInfoData", data.formData);
        }
      });
      watch(
        () => props.userInfoData,
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
  ::v-deep(.el-input__inner) {
    width: 655px;
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