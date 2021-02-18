<template>
  <div class="InfoWindow bsj-infowindow">
    <div class="InfoWindow__header">
      <div class="InfoWindow__title">
        <div
          class="InfoWindow__tag"
          :class="{InfoWindow__tag_online: vehInfo.state === 0,
          InfoWindow__tag_stop: vehInfo.state === 3 || vehInfo.state === 4,
          InfoWindow__tag_offline: vehInfo.state === 1 || vehInfo.state === 2}"
        >{{ ['行驶','离线','从未上线','静止','休眠'][vehInfo.state] }}</div>
        <div class="InfoWindow__veh">{{vehInfo.plate}}</div>
        <div class="InfoWindow__group">{{"/ " + vehInfo.organizationName}}</div>
      </div>
      <el-button
        @click="$router.push({path: 'playback', query: {vehInfo: JSON.stringify(vehInfo)}})"
        type="text"
        size="medium"
        icon="iconfont icon-trajectory"
        class="InfoWindow__playback-btn"
      >轨迹</el-button>
      <el-button
        @click="$emit('onClose')"
        type="text"
        size="medium"
        icon="el-icon-close"
      />
    </div>
    <el-form
      label-position="left"
      size="mini"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备SIM号:">
            {{ vehInfo.sim }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆颜色:">
            {{ vehInfo.plateColor }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆类型:">
            <TypeSelect
              type="vehicleType"
              :value="vehInfo.vehicleType"
              :text="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排放标准:">
            <TypeSelect
              type="emissionStandard"
              :value="vehInfo.emissionStandard"
              :text="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发动机型号:">
            {{ vehInfo.engineType }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备号:"
            style="color:rgba(18,129,224,1);"
          >
            {{ vehInfo.equipmentNumber }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车架号:">
            {{ vehInfo.frameNo }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="VIN号:">
            {{ vehInfo.vin }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="imei:">
            {{ vehInfo.imei }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="iccId:">
            {{ vehInfo.iccId }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="燃油问题:">
            {{ vehInfo.fuelType }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="InfoWindow__split-line">
        车主信息
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车主名称:">
            {{ vehInfo.ownerName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系号码:">
            {{ vehInfo.ownerPhone }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="车主地址:">
            {{ vehInfo.ownerAddress }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TypeSelect from "@/components/TypeSelect/index.vue";

export default {
  components: {
    TypeSelect
  },

  props: {
    vehInfo: [Object]
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 0px !important;

  &__content,
  &__label {
    font-size: 12px !important;
  }

  &__label {
    color: #888 !important;
  }
}

.el-row {
  padding: 0 16px;
}

/deep/ .el-tabs__item {
  padding-left: 20px !important;
}
.bsj-infowindow::before {
  background-color: #f8f8f8;
}
.InfoWindow {
  padding: 0;
  width: 450px;

  &__header {
    padding: 5px 16px;
    display: flex;
    align-items: center;
  }

  &__title {
    @include ellipsis;
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__split-line {
    background: rgba(229, 229, 229, 1);
    height: 30px;
    line-height: 30px;
    padding: 0 16px;
    margin: 10px 0;
  }

  &__tag {
    padding: 3px 6px;
    color: #fff;
    font-size: 10px;
    margin-right: 5px;
    user-select: none;

    &_online {
      background: rgba(30, 198, 144, 1);
    }

    &_stop {
      background: #2a83de;
    }

    &_offline {
      background: #7d7e80;
    }
  }

  &__veh {
    font-size: 14px;
    font-weight: bold;
    margin-right: 5px;
  }

  &__group {
    font-size: 12px;
  }

  /deep/ &__playback-btn {
    i {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>
