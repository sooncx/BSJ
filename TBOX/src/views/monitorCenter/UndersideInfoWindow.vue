<template>
  <div class="UndersideInfoWindow">
    <div class="UndersideInfoWindow__header">
      <div class="UndersideInfoWindow__title">排放信息</div>
      <div class="UndersideInfoWindow__subtitle">数据时间:{{ vehInfo.localTime }}</div>
      <div class="UndersideInfoWindow__expand">
        <el-button
          :icon="visible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          type="text"
          @click="visible = !visible"
        />
      </div>
    </div>

    <div
      class="UndersideInfoWindow__content"
      v-show="visible"
    >
      <el-form
        size="mini"
        label-position="left"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="瞬时速度(km/h):">
              {{vehInfo.speed}}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="燃油液位(%):">
              {{vehInfo.tankLevel}}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="DPF排气温度(℃):">
              {{ vehInfo.dpfEgt }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="尿素罐液位(%):">
              {{vehInfo.reactor}}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="发动机转速(rpm):">
              {{ vehInfo.rpm }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="SCR入口温度(℃):">
              {{ vehInfo.scrInletTemp }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="瞬时NOx浓度(ppm):">
              {{ vehInfo.scrDown }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="燃油温度(℃):">
              <!-- {{ vehInfo.vin }} -->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="DPF压差(kpa):">
              {{ vehInfo.dpf }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="尿素罐温度(℃):">
              {{ vehInfo.ureaTemp }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="发动机净输出扭矩(%):">
              {{ vehInfo.output }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="SCR出口温度(℃):">
              {{ vehInfo.scrExitTemp }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="进气量(kg/h):">
              {{ vehInfo.onflow }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="油门踏板(%):">
              {{ vehInfo.gasPedal }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="故障码个数:"
              style="color:rgba(18,49,224,1);"
            >
              {{ vehInfo.faultNum }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="实际尿素喷射量(ml/h):">
              {{ vehInfo.ureaInjection }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="发动机燃料流量(ml/h):">
              {{ vehInfo.fuelFlow }}
            </el-form-item>
          </el-col>

          <el-col
            :span="4"
            :title='"SCR上游NOx传感器输出值(ppm):"+`    `+vehInfo.scrUp'
          >
            <div>
              {{ "SCR上游NOx传感器输出值(ppm):&nbsp;&nbsp;&nbsp;&nbsp;"+vehInfo.scrUp }}
            </div>
            <!-- <el-form-item label="SCR上游NOx传感器输出值(ppm):">
              {{ vehInfo.scrUp }}
            </el-form-item> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="大气压力(kpa):">
              {{ vehInfo.atmos }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="总油耗(L):">
              {{ vehInfo.tFC }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="总里程(km):">
              {{ vehInfo.mileage }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="总尿素消耗(g):">
              {{ vehInfo.ureaTotal }}
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="发动机冷却液温度(℃):">
              {{ vehInfo.coolantTemp }}
            </el-form-item>
          </el-col>

          <el-col
            :span="4"
            :title='"SCR下游NOx传感器输出值(ppm):"+`    `+vehInfo.scrDown'
          >
            <div>
              {{ "SCR下游NOx传感器输出值(ppm):&nbsp;&nbsp;&nbsp;&nbsp;"+vehInfo.scrDown }}
            </div>
            <!-- <el-form-item label="SCR下游NOx传感器输出值(ppm):">
              {{ vehInfo.scrDown }}
            </el-form-item> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="摩擦扭矩(%):">
              {{ vehInfo.friction }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="报警信息:">
              <!-- {{ vehInfo.friction }} -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vehInfo: [Object]
  },

  data() {
    return {
      visible: true
    };
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item,
div {
  // overflow: hidden;
  // white-space: nowrap;
  // display: block;
  // text-overflow: ellipsis;
  font-size: 12px;
  line-height: 28px;
  color: #888;
}
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
  padding: 0 14px;
}

/deep/ .el-tabs__item {
  padding-left: 20px !important;
}

.UndersideInfoWindow {
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  z-index: 1;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.09);

  &__header {
    display: flex;
    align-items: baseline;
    padding: 0 14px;
    background: #fff;
  }

  &__title {
    font-weight: 400;
    color: $primary;
    font-size: 14px;
  }

  &__subtitle {
    font-size: 10px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    margin-left: 32px;
  }

  /deep/ &__expand {
    margin-left: auto;

    i {
      font-weight: bold;
      font-size: 14px;
    }
  }

  &__content {
    background: rgba(247, 247, 247, 1);
    padding: 16px 0;
  }
}
</style>
