<template>
  <div>
    <!-- 车组树状图开始 -->
    <div class="tree">
      <div class="tree__header">
        <div class="tree__title">
          车组列表
        </div>
        <el-button
          type="text"
          size="small"
          @click="clearAllData()"
          v-if="vehGroup.gids.size > 0"
        >取消选择</el-button>
      </div>

      <div class="tree__content">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          node-key="organizationId"
          :expand-on-click-node="false"
          @check="handleCheck"
          @node-click="hanldeNodeClick"
          check-strictly
          :auto-expand-parent="false"
          show-checkbox
          highlight-current
        >
          <span
            class="tree__node"
            :class="{'tree__node_on': vehGroup.gids.has(data.organizationId)}"
            slot-scope="{ node, data }"
          >
            <i class="tree__icon iconfont icon-TruckGroup" />
            <span>{{ data.organizationName }}</span>
            <span class="tree__total">({{ data.total }})</span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 车组树状图结束 -->

    <!-- 搜索框开始 -->
    <QueryVehOrGroup
      v-model="searchValue"
      style="margin: 5px"
    />
    <!-- 搜索框结束 -->

    <!-- 车辆选择开始 -->
    <div
      class="VehSelect"
      ref="VehSelect"
    >
      <div class="VehSelect__nav">
        <div
          class="VehSelect__tab-item"
          v-for="item in tabItems"
          :key="item.value"
          :class="{'VehSelect__tab-item_on': item.value === activeTab}"
          @click="activeTab = item.value"
        >
          <div>{{item.label}}</div>
          <div>({{item.data.length}})</div>
        </div>
      </div>
      <div class="VehSelect__cancel">
        <el-button
          type="text"
          size="small"
          @click="allSelect(!isAllSelect)"
        >{{isAllSelect ? '取消全选' : '全选'}}</el-button>
      </div>
      <div
        class="VehSelect__tab-pane"
        v-for="item in tabItems"
        :key="item.value"
        v-show="item.value === activeTab"
      >
        <div class="VehSelect__tab-pane-content">
          <div
            class="VehItem"
            :class="{
              VehItem_on: vehIndices.value.has(veh.vehicleId),
              VehItem_online: veh.state === 0,
              VehItem_stop: veh.state === 3 || veh.state === 4,
              VehItem_valid: veh.state !== 2,
              VehItem_disabled: veh.state === 2,
              VehItem_active: vehInfo && vehInfo.vehicleId === veh.vehicleId
            }"
            v-for="veh in item.data.slice((item.currentPage-1)*pageSize,item.currentPage*pageSize)"
            :key="veh.vehicleId"
            @click="handleOnVehItemClick(veh, true);"
          >
            <i class="VehItem__veh-icon iconfont icon-truck" />
            <div class="VehItem__plate">{{veh.plate}}</div>
            <div
              class="VehItem__status"
              :title="computedVehState(veh)"
            >[{{ computedVehState(veh) }}]</div>
            <el-button
              v-if="vehIndices.value.has(veh.vehicleId)"
              type="text"
              size="small"
              style="padding: 0;margin-left: 5px"
              @click.stop="handleOnVehItemClick(veh, false)"
            >取消</el-button>
          </div>
        </div>

        <!-- 分页开始 -->
        <el-pagination
          v-if="item.data.length>0"
          :current-page.sync="item.currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="item.data.length"
          size="small"
          style="background: #fff;text-align: center"
        />
        <!-- 分页结束 -->
      </div>
    </div>
    <!-- 车辆选择结束 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { toTreeData } from "@/assets/js/base";
import QueryVehOrGroup from "@/components/QueryVehOrGroup/index.vue";

export default {
  components: {
    QueryVehOrGroup
  },

  props: {
    //当前车辆信息
    vehInfo: {
      type: [Object, null]
    },
    //当前车组车辆
    vehGroup: {
      type: Object,
      required: true
    },
    //已选车辆索引
    vehIndices: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      defaultProps: {
        children: "children",
        label: "organizationName"
      },
      organizationId: null,
      pageSize: 100,
      tabItems: [
        { label: "全部", value: "all", data: [], currentPage: 1 },
        { label: "在线", value: "oline", data: [], currentPage: 1 },
        { label: "离线", value: "offline", data: [], currentPage: 1 },
        { label: "排放超标", value: "eType", data: [], currentPage: 1 }
      ],
      activeTab: "all",
      isAllSelect: false, //是否全选按钮
      searchValue: null
    };
  },

  computed: {
    ...mapState(["GROUPLIST"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  watch: {
    async vehGroup(nowVal, curVal) {
      const [all, online, offline, eType] = this.tabItems;
      const { data } = nowVal;

      all.data = data;
      online.data = data.filter(({state}) => state === 0);
      offline.data = data.filter(({state}) => state !== 0);
      eType.data = data.filter(({eType}) => eType === 1);

      //如果两个数组成员不一致则刷新页数
      const nowGids = [...nowVal.gids];
      const curGids = [...curVal.gids];
      if (JSON.stringify(nowGids) !== JSON.stringify(curGids)) {
        all.currentPage = 1;
        online.currentPage = 1;
        offline.currentPage = 1;
      }
    },
    //处理搜索值变化
    searchValue: {
      async handler({ organizationId, vehicleId }) {
        const { scrollToTreeHighLight, scrollToVehHighLight } = this;
        await scrollToTreeHighLight(organizationId);
        vehicleId !== undefined && scrollToVehHighLight(vehicleId);
      },
      deep: true
    }
  },

  methods: {
    computedVehState({ state, time }) {
      return (
        ["行驶", "离线", "从未上线", "静止", "休眠"][state] + (time ? time : "")
      );
    },
    //清除所有数据
    clearAllData() {
      this.$refs.tree.setCurrentKey(null); //取消当前节点高亮
      this.$refs.tree.setCheckedKeys([]); //取消已选择节点
      this.isAllSelect = false; //取消车辆全选
      this.$emit("update:vehGroup", {
        data: Object.freeze([]),
        gids: new Set()
      });
      ///更新已选车辆索引
      this.$emit("update:vehIndices", {
        value: new Map(),
        timestamp: Date.now()
      });
      //更新当前车辆数据
      this.$emit("update:vehInfo", null);
    },
    //处理veh item点击
    //flag 为true时表示选中
    handleOnVehItemClick(veh, flag) {
      if (veh.state === 2) {
        this.$msg({
          showClose: true,
          message: "无效车辆",
          type: "warning"
        });
        return;
      }

      let vehIndices, vehInfo;
      //选中
      if (flag) {
        if (this.vehInfo && veh.vehicleId === this.vehInfo.vehicleId) {
          this.$emit("onZoomMarker");
          return;
        }
        vehIndices = new Map([[veh.vehicleId, veh], ...this.vehIndices.value]);
        vehInfo = veh;
      } else {
        //取消车辆
        vehIndices = new Map(this.vehIndices.value);
        //取消当前车辆则默认选择下一辆或上一辆
        const values = [...vehIndices.values()];
        const i = values.findIndex(
          ({ vehicleId }) => vehicleId === veh.vehicleId
        );
        vehInfo = values[i + 1] || values[i - 1];
        vehIndices.delete(veh.vehicleId);
      }

      ///更新已选车辆索引
      this.$emit("update:vehIndices", {
        value: vehIndices,
        timestamp: Date.now()
      });
      //选择下一辆或上一辆
      this.$emit("update:vehInfo", Object.freeze(vehInfo));
    },
    //滚动到树状图当前高亮节点
    async scrollToTreeHighLight(organizationId) {
      //logic 选中
      let gids = new Set(this.vehGroup.gids);
      gids.add(organizationId);
      this.isAllSelect = false;
      await this.updateVehGroup([...gids]);
      //css 选中
      console.log(this.$refs.tree.setCurrentKey, organizationId);
      this.$refs.tree.setCurrentKey(organizationId);
      await this.$nextTick();
      await this.$sleep(100);
      const activeDom = this.$refs.tree.$el.getElementsByClassName(
        "is-current"
      )[0];
      activeDom && activeDom.scrollIntoView();
    },
    //滚动到当前高亮节点
    async scrollToVehHighLight(vehicleId) {
      await this.$nextTick();
      this.activeTab = "all";
      const allData = this.tabItems[0];
      const i = allData.data.findIndex(item => item.vehicleId === vehicleId);
      allData.currentPage = Math.ceil(i / this.pageSize) || 1;
      this.handleOnVehItemClick(allData.data[i], true);
      await this.$nextTick();
      await this.$sleep();
      const activeDom = this.$refs.VehSelect.getElementsByClassName(
        "VehItem_active"
      )[0];
      activeDom && activeDom.scrollIntoView();
    },
    //获取新的车组数据, 并与老的组合
    async updateVehGroup(gids) {
      if (gids.length === 0) {
        this.$emit("update:vehGroup", {
          data: Object.freeze([]),
          gids: new Set()
        });
        return;
      }

      try {
        const curGidsSet = this.vehGroup.gids;
        const curGids = [...curGidsSet];
        //获取旧车辆
        const gidsSet = new Set(gids);
        const extra = curGids.filter(gid => !gidsSet.has(gid)); //有用的旧车组
        const extraSet = new Set(extra);
        const curData = this.vehGroup.data.filter(
          item => !extraSet.has(item.organizationId)
        ); //有用的旧车组车辆

        //获取新车辆
        const ids = gids.filter(gid => !curGidsSet.has(gid));
        const nowData = ids.length
          ? (await this.$API.getVehicleMonitoringByOrganizationId({
              organizationIds: ids.join(",")
            }))["data"]
          : [];

        //合并新旧车辆
        const data = [...curData, ...nowData];

        this.$emit("updateGroup", gids, data);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "warning"
        });
      }
    },
    //处理树状图点击选择框
    async handleCheck(data) {
      const waitChecks = getWaitChecks(data); //待选择节点
      const waitChecksSet = new Set(waitChecks);
      const checkedKeys = this.$refs.tree.getCheckedKeys(); //已选节点
      const checkedKeysSet = new Set(checkedKeys);
      const allChecks = [...new Set([...waitChecks, ...checkedKeys])];
      if (allChecks.length > 1000 && checkedKeysSet.has(data.organizationId)) {
        const i = checkedKeys.indexOf(data.organizationId);
        checkedKeys.splice(i, 1);
        this.$refs.tree.setCheckedKeys(checkedKeys); //取消当前选择车组
        this.$toast.fail({
          duration: 1000,
          message: "不可选择大于1000个车组"
        });
        return;
      }

      //如已被选择则取消选择，反之选择
      let nowCheckedKeys = [];
      if (checkedKeysSet.has(data.organizationId)) {
        nowCheckedKeys = allChecks;
      } else {
        nowCheckedKeys = checkedKeys.filter(gid => !waitChecksSet.has(gid));
      }
      this.$refs.tree.setCheckedKeys(nowCheckedKeys);

      //加载车组
      if (checkedKeysSet.has(data.organizationId)) {
        //选中
        const ids = [...new Set([...this.vehGroup.gids, ...nowCheckedKeys])];
        await this.updateVehGroup(ids);
        await this.allSelect(true, waitChecksSet); //全选
      } else {
        let ids = [];
        //取消选择
        //如果有通过下划线选取的车组时
        if (this.vehGroup) {
          const gids = [...this.vehGroup.gids];
          ids = gids.filter(gid => !waitChecksSet.has(gid)); //返回所有未在待选车组的下划线车组
          await this.updateVehGroup(ids);
        }
        await this.allSelect(false, waitChecksSet); //全选
      }

      //获取待选择节点
      function getWaitChecks(data) {
        let waitChecks = [data.organizationId]; //待选择节点
        runChildren(data);
        return waitChecks;

        function runChildren(data) {
          if (data.children) {
            data.children.map(item => {
              waitChecks.push(item.organizationId);
              runChildren(item);
            });
          }
        }
      }
    },
    //flag是否全选
    //如果waitChecksSet存在则执行点击树状图选择框时的逻辑
    async allSelect(flag, waitChecksSet) {
      let vehIndices = null;
      let isAllErrMsg = true; //判断是否全部有errMsg
      const { data } = this.vehGroup;
      if (flag) {
        let new_indices = [];
        data.map(item => {
          if (item.state === 2) return; //state 为 2 时则代表从未在线
          isAllErrMsg = false;
          if (waitChecksSet) {
            //选择具有树状图选择框下车组id的车辆
            waitChecksSet.has(item.organizationId) &&
              new_indices.push([item.vehicleId, item]);
          } else {
            new_indices.push([item.vehicleId, item]);
          }
        });
        vehIndices = waitChecksSet
          ? new Map([...new_indices, ...this.vehIndices.value])
          : new Map(new_indices);
      } else {
        isAllErrMsg = false;

        if (waitChecksSet) {
          //取消选择具有树状图选择框下车组id的车辆
          let indices = new Map();
          [...this.vehIndices.value.values()].map(item => {
            if (waitChecksSet.has(item.organizationId)) return;
            indices.set(item.vehicleId, item);
          });
          vehIndices = indices;
        } else {
          vehIndices = new Map();
        }
      }
      if (isAllErrMsg) {
        this.$msg({
          showClose: true,
          message: "无可选车辆",
          type: "warning"
        });
        return;
      }

      this.isAllSelect = flag;
      //更新已选车辆索引
      this.$emit("update:vehIndices", {
        value: vehIndices,
        timestamp: Date.now()
      });
      //全选时默认地图车辆为第一辆
      this.$emit("update:vehInfo", Object.freeze([...vehIndices.values()][0]));
    },
    //处理树节点点击
    async hanldeNodeClick({ organizationId }, node) {
      //加载当前车组内车辆信息
      let gids = new Set(this.vehGroup.gids); //复制gids
      if (gids.has(organizationId)) {
        gids.delete(organizationId);
        //取消车辆
        let vehIndices = new Map();
        [...this.vehIndices.value.values()].map(item => {
          if (item.organizationId === organizationId) return;
          vehIndices.set(item.vehicleId, item);
        });

        const vehs = [...vehIndices.values()];
        if (vehs.length === 0) {
          this.$emit("update:vehInfo", null);
          this.$emit("update:vehIndices", {
            value: new Map(),
            timestamp: Date.now()
          });
        } else {
          //如果地图上的车辆属于取消的车组则选取vehIndices内第一辆车辆
          this.vehInfo.organizationId === organizationId &&
            this.$emit("update:vehInfo", Object.freeze(vehs[0]));
          this.$emit("update:vehIndices", {
            value: vehIndices,
            timestamp: Date.now()
          });
        }
      } else {
        gids.add(organizationId);
      }
      //取消选中当前车组
      node.checked && this.$refs.tree.setChecked(organizationId, false);
      this.isAllSelect = false;
      await this.updateVehGroup([...gids]);
    }
  }
};
</script>

<style lang="scss" scoped>
.tree {
  height: 36%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(#999, 0.3);
  border-radius: 5px;

  &__icon {
    margin: 0 5px 0 10px;
    font-size: 14px;
    color: $primary;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 33px;
    padding: 0 10px;
    border-bottom: 1px solid rgba(#999, 0.3);
    overflow: hidden;
  }

  &__title {
    font-size: 14px;
    font-weight: bold;
  }

  &__content {
    @include scrollBar;
    flex: 1;
    overflow-y: auto;
    background: #fff;
  }

  &__total {
    color: currentColor;
    margin-left: 5px;
  }

  &__node {
    &_on {
      color: $primary;
    }
  }
}

.VehSelect {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__nav {
    display: flex;
    height: 40px;
    overflow: hidden;
    margin: 5px;
  }

  &__tab-item {
    background: #ececec;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #999;
    padding: 5px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: $primary;
      color: #fff;
    }

    & + & {
      margin-left: 5px;
    }

    &_on {
      background: $primary;
      color: #fff;
    }
  }

  &__cancel {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    border: 1px solid rgba(#999, 0.3);
  }

  &__cancel-btn {
    color: $primary;
    user-select: none;
    cursor: pointer;
    font-size: 12px;
  }

  &__tab-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__tab-pane-content {
    @include scrollBar;
    flex: 1;
    overflow-y: auto;
    background: #fff;
  }
}

.VehItem {
  display: flex;
  font-size: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  & + & {
    margin-top: 2px;
  }

  &_on {
    background: rgba($primary, 0.1);
  }

  &_disabled {
    background: rgba(150, 151, 153, 0.2);
  }

  &_valid:not(.VehItem_on) {
    &:hover {
      background: #f5f7fa;
    }
  }

  &__veh-icon {
    color: #bdbdbd;
    margin-right: 5px;
  }

  &_online {
    .VehItem__veh-icon {
      color: $primary;
    }
  }

  &_stop {
    .VehItem__veh-icon {
      color: #2a83de;
    }
  }

  &__plate {
    @include ellipsis;
    width: 100px;
    color: #666;
  }

  &__status {
    @include ellipsis;
    padding: 1px 0;
    flex: 1;
    color: #666;
  }

  &__setting-icon {
    color: $primary;
    margin-left: 5px;
  }
}
</style>
