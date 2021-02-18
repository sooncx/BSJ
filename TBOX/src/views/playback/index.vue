<template>
  <div
    ref="map"
    class="playback"
  >
    <div class="playback__time-check">
      <el-form
        class="playback__form"
        :class="{'playback__form_expanded': expanded, 'playback__form_expanded-slider': expanded && playData.length}"
        ref="form"
        label-width="100px"
        :model="model"
        :rules="rules"
        size="mini"
      >
        <el-form-item
          label="搜索车辆:"
          prop="vehInfo"
          style="margin-bottom: 22px;"
        >
          <SelectInput
            v-model="model.vehInfo"
            :showGroup="false"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="选择时间:">
          <div class="playback__time-btn">
            <el-button
              size="small"
              v-for="(item, index) in timeList"
              :key="index"
              @click="Object.assign(model, formatTime(item.date))"
            >{{item.label}}</el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="开始时间:"
          prop="startTime"
        >
          <el-date-picker
            v-model="model.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择开始日期"
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="结束时间:"
          prop="endTime"
        >
          <el-date-picker
            v-model="model.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束日期"
            size="small"
          />
        </el-form-item>

        <div class="playback__query-btn">
          <el-button
            style="width: 100%"
            type="primary"
            size="small"
            @click="getVehicleTrackInfo()"
          >查询</el-button>
        </div>

        <!-- 轨迹控制开始 -->
        <transition name="el-fade-in">
          <div
            class="playback__control"
            v-show="playData.length"
          >
            <div class="playback__play-icon">
              <el-button
                @click="isPlay ? playbackControl.pause() : playbackControl.play()"
                :icon="isPlay ? 'iconfont icon-zanting' : 'iconfont icon-bofang'"
                type="text"
              ></el-button>
            </div>
            <div class="playback__slider">
              <el-slider v-model="percent" />
            </div>
            <div class="playback__speed">
              <el-select
                :value="speed"
                @input="val => playbackControl.setSpeed(val)"
                size="mini"
              >
                <el-option
                  v-for="item in speedOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </transition>
        <!-- 轨迹控制结束 -->
      </el-form>
      <div
        class="playback__arrow"
        @click="expanded = !expanded"
      >
        <i
          class="playback__arrow-icon iconfont icon-dropdown"
          :class="{'playback__arrow-icon_expanded': expanded}"
        />
      </div>
    </div>

    <Table
      :playData="playData"
      :passedIndex="passedIndex"
      @onPassedIndexChange="handleOnPassedIndexChange"
      @onTableDataChange="handleOnTableDataChange"
    />
  </div>
</template>

<script>
import day from "dayjs";
import GPS from "@/assets/js/GPS";
import { getCarIcon } from "@/assets/js/base";
import Table from "./Table/index.vue";
import Trajectory from "./Trajectory";
import SelectInput from "@/components/SelectInput/index.vue";

export default {
  name: "playback",

  components: {
    Table,
    SelectInput
  },

  data() {
    return {
      model: {
        ...this.formatTime(new Date()),
        //当前车辆信息
        vehInfo: null
      },
      rules: {
        vehInfo: [
          {
            required: true,
            message: "搜索车辆不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,
            message: "开始时间不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (day(value).valueOf() > day(this.model.endTime).valueOf()) {
                callback(new Error("不能大于结束时间"));
              } else {
                callback();
              }
            }
          }
        ],
        endTime: [
          {
            required: true,
            message: "结束时间不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const now = day(new Date()).format(`YYYY-MM-DD 23:59:59`);
              if (day(value).valueOf() > day(now).valueOf()) {
                callback(new Error("不能大于当前日期"));
                return;
              }

              if (day(value).valueOf() < day(this.model.startTime).valueOf()) {
                callback(new Error("不能小于开始时间"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      timeList: [
        { label: "今天", date: new Date() },
        {
          label: "昨天",
          date: new Date().setDate(new Date().getDate() - 1)
        },
        {
          label: "前天",
          date: new Date().setDate(new Date().getDate() - 2)
        }
      ],
      playbackControl: null, //回放控制器
      playData: [], //回放数据
      isPlay: false, //是否在播放
      passedIndex: 0, //经过的路径index
      speed: 500, //播放速度
      speedOptions: [
        { label: "慢", value: 500 },
        { label: "中", value: 1000 },
        { label: "快", value: 1500 }
      ],
      car: null, //车辆marker
      expanded: true, //时间选择是否展开
      map: null,
      infowindow: null
    };
  },

  computed: {
    //当前轨迹播放百分数
    percent: {
      get() {
        return Math.floor(
          (this.passedIndex / (this.playData.length - 1)) * 100
        );
      },

      set(val) {
        if (val === this.percent) return;
        const passedIndex = Math.floor(
          (val / 100) * (this.playData.length - 1)
        );

        this.playbackControl.jumpTo(passedIndex);
      }
    }
  },

  watch: {
    "model.vehInfo"(val) {
      if (!val) return;
      this.car.setContent(this.getCarContent());
    },
    "$route.query.vehInfo": {
      handler(val) {
        if (!val) return;
        this.model.vehInfo = JSON.parse(val);
        this.getVehicleTrackInfo();
      },
      immediate: true
    }
  },

  mounted() {
    this.initPlayback();
  },

  activated() {
    this.infowindow &&
      this.infowindow.setPositon &&
      this.infowindow.setPositon(this.car.getPosition());
  },

  methods: {
    //处理passedIndex 改变
    handleOnPassedIndexChange({ type, passedIndex }) {
      if (!this.playData.length) return;
      this.playbackControl.jumpTo(passedIndex);
      if (type === "pause") {
        const vehInfo = this.playData[passedIndex];
        const { lon, lat } = GPS.gcj_encrypt(vehInfo.lat, vehInfo.lon);
        this.map.setCenter([lon, lat]);
        this.handleStopInfowindow();
      }
    },

    //处理表格数据变化
    //变化则获取表格数据的地址
    async handleOnTableDataChange(tableData) {
      //过滤掉已经获取地址的数据
      const tableDataFilter = tableData.filter(item => !item.address);
      if (!tableDataFilter.length) return; //如果全部都已获取地址则不往下执行

      const localList = tableDataFilter.map(({ lon, lat, passedIndex }) => ({
        lon,
        lat,
        tag: passedIndex
      }));
      const addressList = await this.$API.GetGeo(localList);

      const playData = [...this.playData]; //复制playData
      addressList.map(({ tag, address }) => (playData[tag].address = address));

      this.playData = Object.freeze(playData);
    },
    //格式化时间
    formatTime(date) {
      //day(date).format("YYYY-MM-DD 00:00:00")
      //2019-10-01 00:00:00
      return {
        startTime: day(date).format("YYYY-MM-DD 00:00:00"),
        endTime: day(date).format("YYYY-MM-DD 23:59:59")
      };
    },

    //获取轨迹信息
    async getVehicleTrackInfo() {
      try {
        !this.$refs.form && (await this.$nextTick());
        await this.$refs.form.validate();

        const params = {
          startTime: this.model.startTime,
          endTime: this.model.endTime,
          vehicleId: this.model.vehInfo.vehicleId
        };
        const { data, msg } = await this.$API.getVehicleTrackInfo(params);

        if (data.length) {
          this.$msg({
            showClose: true,
            message: msg,
            type: "success"
          });
        } else {
          this.$msg({
            showClose: true,
            message: "该时间无数据",
            type: "warning"
          });
        }
        // const data = require("./mock").default.obj;
        let playData = [];
        let path = [];
        data.map((item, index) => {
          playData.push({
            ...item,
            passedIndex: index
          });

          const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lon);
          path.push(new AMap.LngLat(lon, lat));
        });
        this.playData = playData;
        this.playbackControl.setPath(path);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确字段",
          type: "error"
        });
      }
    },

    //获取车辆图标
    getCarContent() {
      return this.model.vehInfo
        ? `<img style="width: 32px;height:35px;" src="${getCarIcon({
            state: 0,
            vehicleType: this.model.vehicleType
          })}" />`
        : "<div></div>";
    },

    //初始化轨迹实例
    initPlayback() {
      this.map = new AMap.Map(this.$refs.map, {
        center: [117.000923, 36.675807],
        zoom: 11
      });

      //车辆marker
      this.car = new AMap.Marker({
        map: this.map,
        offset: new AMap.Pixel(-16, -17.5),
        content: this.getCarContent(),
        visible: false,
        zIndex: 199
      });

      this.car.on("click", () => this.handleStopInfowindow());

      this.car.on("moving", () => this.infowindow && this.infowindow.close());

      //开始图标
      const startMarker = new AMap.Marker({
        map: this.map,
        icon: new AMap.Icon({
          size: new AMap.Size(36, 36),
          image: require("@/assets/img/playback/start.png"),
          imageSize: new AMap.Size(36, 36)
        }),
        offset: new AMap.Pixel(-18, -18),
        visible: false
      });

      //结束图标
      const endMarker = new AMap.Marker({
        map: this.map,
        icon: new AMap.Icon({
          size: new AMap.Size(36, 36),
          image: require("@/assets/img/playback/end.png"),
          imageSize: new AMap.Size(36, 36)
        }),
        offset: new AMap.Pixel(-18, -18),
        visible: false
      });

      //轨迹样式
      const trackLine = new AMap.Polyline({
        map: this.map,
        strokeColor: "#3d79f8", // 线颜色
        strokeStyle: "solid", // 线样式
        strokeWeight: 3, // 线宽
        visible: false
      });

      //经过样式
      const passedLine = new AMap.Polyline({
        map: this.map,
        strokeColor: "#00e93c", // 线颜色
        strokeStyle: "solid", // 线样式
        strokeWeight: 3, // 线宽
        visible: false
      });

      //初始化回放控制器
      this.playbackControl = new Trajectory({
        map: this.map,
        car: this.car,
        startMarker,
        endMarker,
        trackLine,
        passedLine,
        speed: this.speed
      });
      //监听播放状态
      this.playbackControl.watch("isPlay", val => (this.isPlay = val));
      //监听经过索引回调
      this.playbackControl.watch(
        "passedIndex",
        val => (this.passedIndex = val)
      );
      //监听速度回调
      this.playbackControl.watch("speed", val => (this.speed = val));
    },

    //处理打开当前车辆infowindow
    handleStopInfowindow() {
      this.isPlay && this.playbackControl.pause();
      const vehInfo = this.playData[this.passedIndex];

      const content = `<div class="bsj-infowindow">
            <div>时间：${vehInfo.devTime}</div>
            <div>速度：${vehInfo.speed}km/h</div>
            <div>里程：${vehInfo.mileage}km</div>
            </div>`;

      this.infowindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        isCustom: true,
        autoMove: false,
        content
      });
      this.infowindow.open(this.map, this.car.getPosition());
    }
  }
};
</script>

<style lang="scss" scoped>
.playback {
  position: relative;
  height: 100%;
  background: rgb(252, 249, 242);

  &__time-check {
    position: absolute;
    top: 16px;
    left: 16px;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    z-index: 199;
  }

  &__form {
    width: 350px;
    padding: 16px 0px;
    background: #fff;
    height: 70px;
    box-sizing: border-box;
    transition: height 0.5s;
    overflow: hidden;

    &_expanded {
      height: 286px;
    }

    &_expanded-slider {
      height: 350px;
    }
  }

  &__arrow {
    position: absolute;
    left: 50%;
    bottom: -22px;
    transform: translate(-50%, 0);
    width: 50px;
    height: 44px;
    padding: 8px 0;
    box-sizing: border-box;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  &__arrow-icon {
    font-size: 18px;
    transition: transform 0.3s;
    color: #999;

    &:hover {
      color: $primary;
    }

    &_expanded {
      transform: rotate(180deg);
    }
  }

  &__time-btn {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 220px;
  }

  &__query-btn {
    padding: 0 30px 0 30px;
  }

  &__control {
    display: flex;
    align-items: center;
    margin-top: 32px;
    border-top: 1px solid #dcdfe6;
    padding: 10px 30px 0 20px;
  }

  &__play-icon {
    box-sizing: border-box;
    flex: 3;
    overflow: hidden;
    display: flex;
    align-items: center;

    /deep/ .el-button {
      padding: 0;

      i {
        font-size: 20px;
      }
    }
  }

  &__slider {
    flex: 15;
  }

  &__speed {
    flex: 6;
    box-sizing: border-box;
    padding-left: 16px;
  }
}
</style>
