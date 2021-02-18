<template>
  <div class="Upside">
    <div class="Upside__item">
      <i class="Upside__icon iconfont icon-member" />
      登录账户:
      <span class="Upside__text">{{USER && USER.userName}}</span>
    </div>
    <div class="Upside__item">
      <i class="Upside__icon iconfont icon-shebei" />
      设备数量:
      <span class="Upside__text">{{homeVehicleDto.totalNum}}</span>
      (在线:<span class="Upside__text">{{homeVehicleDto.onlineNum}}</span>/
      离线:<span class="Upside__text">{{homeVehicleDto.offlineNum}}</span>/
      休眠:<span class="Upside__text">{{homeVehicleDto.dormantNum}}</span>/
      从未上线:<span class="Upside__text">{{homeVehicleDto.neverNum}}</span>)
    </div>
    <div class="Upside__item">
      <i class="Upside__icon iconfont icon-phone" />
      电话:
      <span class="Upside__text">{{USER && USER.phone}}</span>
    </div>
     <el-button
        type="primary"
        size="mini"
        style="margin-left: auto"
        @click="$emit('onHandleUser', 'add', {parentId: USER.userId, userRights: 123, stateType: 0})"
      >新建</el-button>
      <el-button
        size="mini"
        @click="$emit('onExportFile')"
      >导出</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      homeVehicleDto: {}
    };
  },

  computed: {
    ...mapState(["USER"])
  },

  mounted() {
    this.getHomeData();
  },

  methods: {
    //获取首页数据
    async getHomeData() {
      try {
        const { data } = await this.$API.all();
        const { homeVehicleDto } = data;

        //处理车辆信息
        this.homeVehicleDto = Object.freeze(homeVehicleDto);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Upside {
  width: 100%;
  display: flex;
  align-items: center;

  &__item {
    color: #666;
    display: inline-flex;
    align-items: center;
    margin-left: 16px;

    & + & {
      margin-left: 50px;
    }
  }

  &__text {
    color: #333;
  }

  &__icon {
    color: #d7d7d7;
    margin-right: 5px;
  }
}
</style>
