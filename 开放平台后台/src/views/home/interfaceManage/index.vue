<template>
  <div class="interfaceManage">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        <tabPanel
          :activeName.sync="activeName"
          :tableData.sync="tabPanelData"
          @changeInterface="changeInterface"
          @delSuccess="getInterfaces"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          :total.sync="total"
        />
      </el-tab-pane>
    </el-tabs>
    <div class="btns">
      <el-button
        type="primary"
        size="mini"
        @click="EditInterface('add')"
      >新增</el-button>
      <!-- <el-button
        type="primary"
        size="mini"
      >删除</el-button> -->
    </div>
    <editDialog
      :visible.sync="visible"
      :formData.sync="formData"
      :editType.sync="editType"
      @save="save"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import tabPanel from "./tabPanel/index.vue";
import editDialog from "./editDialog/index.vue";

export default {
  name: "interfaceManage",
  components: {
    tabPanel,
    editDialog
  },
  data() {
    return {
      visible: false,
      selectTabData: null,
      formData: {},
      editType: "add",
      tabPanelData: [],
      activeName: "1",
      current: 1,
      pageSize: 100,
      total: 0
    };
  },
  computed: {
    ...mapState(["APPLIST", "USERLIST"]),
    tabs() {
      const arr = [];
      if (this.APPLIST) {
        this.APPLIST.map(item => {
          arr.push({
            label: item.name,
            name: item.appId.toString()
          });
        });
      }
      return arr;
    }
  },
  watch: {
    APPLIST: {
      handler(val) {
        if (val) {
          this.activeName = val[0].appId.toString();
          // TODO this.getInterfaces();
        }
      }
    },
    $route: {
      handler(val) {
        if (val.name === "interfaceManage") {
          this.getInterfaces();
        }
      }
    }
  },
  mounted() {
    this.getInterfaces();
  },
  methods: {
    ...mapMutations(["COMMIT_APPLIST"]),
    handleClick() {
      this.pageSize = 100;
      this.current = 1;
      this.getInterfaces();
    },
    async getInterfaces() {
      try {
        const params = {
          appId: this.activeName,
          pageNumber: this.current,
          pageSize: this.pageSize
        };
        const { obj } = await this.$API.getInterfaceByApp(params);
        this.tabPanelData = obj.data;
        this.total = obj.total;
      } catch (error) {
        console.log(error);
      }
    },
    async save(data) {
      try {
        const params = {
          appId: this.activeName,
          appInterfaceId: data.appInterfaceId,
          name: data.name,
          url: data.url,
          interfaceQps: data.interfaceQps,
          interfaceDayLimit: data.interfaceDayLimit
        };
        if (this.editType === "add") {
          const { flag, msg } = await this.$API.addInterface(params);
          if (flag === 1) {
            this.$msg.success(msg);
            this.visible = false;
            this.getInterfaces();
          } else {
            this.$msg.error(msg);
          }
        } else if (this.editType === "change") {
          const { flag, msg } = await this.$API.updateInterface(params);
          if (flag === 1) {
            this.$msg.success(msg);
            this.visible = false;
            this.getInterfaces();
          } else {
            this.$msg.error(msg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async EditInterface(type) {
      if (type === "add") {
        this.formData = {};
        this.editType = "add";
      }
      this.visible = true;
    },
    sizeChange(val) {
      console.log(val, "pagesize");
      this.pageSize = val;
      this.getInterfaces();
    },
    currentChange(val) {
      console.log(val, "current");
      this.current = val;
      this.getInterfaces();
    },
    changeInterface(data) {
      this.formData = { ...data };
      this.editType = "change";
      this.EditInterface("change");
    }
  }
};
</script>
<style lang="scss" scoped>
.interfaceManage {
  flex: 1;
  overflow: auto;
  padding: 20px 20px 0 20px;
  background: #fff;
  position: relative;
  .btns {
    position: absolute;
    display: flex;
    top: 20px;
    right: 20px;
  }
}
</style>
