<template>
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
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        label="车主信息"
        name="2"
      >
        <UserInfo
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        label="安装信息"
        name="3"
      >
        <InstallInfo
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        label="风控信息"
        name="4"
      >
        <RiskInfo
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        label="保险信息"
        name="5"
      >
        <Insurance
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
      <el-tab-pane
        label="保养信息"
        name="6"
      >
        <Maintenance
          v-bind="$attrs"
          :activeName="activeName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import BasicInfo from "./basicInfo.vue";
import RiskInfo from "./riskInfo.vue";
import UserInfo from "./userInfo.vue";
import InstallInfo from "./installInfo.vue";
import Insurance from "./insurance.vue";
import Maintenance from "./maintenance.vue";
export default defineComponent({
  components: {
    BasicInfo,
    RiskInfo,
    UserInfo,
    InstallInfo,
    Insurance,
    Maintenance,
  },
  props: {
    dialogData: {
      type: Object || Array,
    },
    DialogType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    vehInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const data = reactive({
      activeName: "1",
      handleClick: function () {},
    });
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.tabPabel {
  padding: 0 16px;
}
</style>