<template>
  <el-popover
    v-model="visible"
    width="400"
    placement="bottom-start"
    trigger="click"
  >
    <div class="box">
      <div
        class="TreeSelect"
        ref="scroll"
      >
        <el-tree
          ref="tree"
          :data="data"
          :props="props"
          :node-key="nodeKey"
          @node-click="nodeClick"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :highlight-current="true"
        >
          <span slot-scope="{ node, data }">
            <i :class="['iconfont icon-TruckGroup','tree__icon',{'tree__icon__none':data.total === 0}]" />
            <span
              :title="data.organizationName +` `+'('+data.total+')'"
              class="tree__name"
            >{{ data.organizationName+`  `+'('+data.total+')'}}</span>
          </span>
        </el-tree>
      </div>
      <div
        class="nodeDetail"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="disabled"
      >
        <Empty
          v-show="list.length===0"
          style="left:48%"
        />
        <ul
          v-for="(item,index) in list"
          :key="index"
        >
          <i :class="['iconfont icon-truck',{'noactiveIcon':item.state === 2}]"></i>
          <li
            @click="liClick(item)"
            :class="[{'active': item.state != 2},{'noactive':item.state === 2}]"
          >{{item.plate}}</li>
        </ul>
        <p
          v-if="more"
          style="margin-top:20px"
          v-loading="more"
          element-loading-spinner="el-icon-loading"
        ></p>
        <p
          v-if="noMore"
          style="color:red"
        >没有更多了</p>
      </div>
    </div>
  </el-popover>
</template>

<script>
import Empty from "@/components/Empty/index.vue";

export default {
  props: {
    data: null,
    props: null,
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      more: false,
      nodeKey: null,
      list: [],
      loading: false,
      nodeList: []
    };
  },

  watch: {
    visible(val) {
      this.visible = val;
    }
  },
  computed: {
    noMore() {
      return this.nodeList.length === this.list.length && this.list.length > 20;
    },
    disabled() {
      return this.more || this.noMore;
    }
  },
  methods: {
    loadMore: function() {
      if (this.nodeList.length > 20) {
        this.more = true;
        setTimeout(() => {
          this.list = this.nodeList.slice(0, this.list.length + 20);
          this.more = false;
        }, 1000);
      }
    },
    liClick(data) {
      if (data.state != 2) {
        this.$emit("selectNode", data, false);
      }
    },
    async getVehicleMonitoringByOrganizationId(mydata) {
      this.loading = true;
      const { data } = await this.$API.getVehicleMonitoringByOrganizationId({
        organizationIds: mydata.organizationId
      });
      this.nodeList = data;
      this.list = data.slice(0, 20);
      this.loading = false;
      console.log(data);
    },
    nodeClick(data) {
      this.getVehicleMonitoringByOrganizationId(data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data[this.props.label]
          .toLocaleLowerCase()
          .indexOf(value.toLocaleLowerCase()) !== -1
      );
    }
  },
  components: {
    Empty
  }
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  .nodeDetail {
    flex: 1;
    position: relative;
    @include scrollBar;
    max-height: 300px;
    overflow: scroll;
    margin-left: 15px;
    margin-right: -10px;
    padding-left: 10px;
    border-left: 1px solid rgb(180, 180, 180);
    ul {
      display: flex;
      font-size: 12px;
      i {
        padding: 5px;
        flex: 1;
        color: rgb(92, 177, 141);
      }
      li {
        margin-top: 2px;
        padding: 5px;
        flex: 9;
      }
    }
    p {
      text-align: center;
    }
  }
}
.active {
  cursor: pointer;
  &:hover {
    background-color: rgb(167, 207, 233);
    color: #fff;
  }
}
.noactive {
  cursor: not-allowed;
  color: rgb(189, 189, 189);
}
.noactiveIcon {
  color: rgb(189, 189, 189) !important;
}
.TreeSelect {
  width: 400px;
  flex: 1;
  @include scrollBar;
  max-height: 300px;
  overflow: scroll;
  margin: 0 -10px;
  &__icon {
    font-size: 14px;
    margin-right: 5px;
  }
}
.tree {
  &__icon {
    color: rgb(65, 164, 173);
    &__none {
      color: rgb(151, 67, 67);
    }
  }
  &__name {
    display: inline-block;
    width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
    font-size: 12px;
    font-weight: bold;
    line-height: 12px;
  }
}
/deep/ .el-popover {
  margin-left: 5%;
  margin-top: 10px;
}
.tip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
