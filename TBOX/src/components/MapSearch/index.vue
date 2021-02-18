<template>
  <div class="MapSearch">
    <i
      @click="visible = !visible; !visible && clearMap()"
      class="MapSearch__zoom iconfont"
      :class="visible ? 'icon-suoxiao' : 'icon-enlarge'"
    />
    <div
      class="MapSearch__content"
      :class="{MapSearch__content_show:visible}"
    >
      <!-- 位置搜索开始 -->
      <div
        class="MapSearch__search"
        v-show="visible"
        ref="search"
      >
        <PlaceSearch
          @onTipsChange="val => handleOnTipsChange('searchLocal', val)"
          placeholder="搜索位置、公交站、地铁站"
          :Autocomplete="Autocomplete"
          :local.sync="searchLocal"
          v-model="searchLocal"
        />
      </div>
      <!-- 位置搜索结束 -->

      <!-- 路线按钮开始 -->
      <div
        class="MapSearch__track-btn"
        title="路线"
        @click="changeActiveName('line')"
      >
        <i
          class="MapSearch__track-icon iconfont icon-guiji"
          :class="{'MapSearch__track-icon_show':visible}"
        />
      </div>
      <!-- 路线按钮结束 -->

      <!-- 路线开始 -->
      <transition name="el-zoom-in-top">
        <div
          class="line-form"
          v-show="activeName === 'line'"
          ref="line"
        >
          <i
            class="line-form__close el-icon-close"
            @click="changeActiveName('search')"
          />

          <div class="line-form__tabs">
            <div
              class="line-form__tabs-item"
              v-for="item in lineOptions"
              :key="item.value"
            >
              <i
                @click="lineType = item.value;drawLine()"
                class="line-form__line-icon iconfont"
                :class="[item.icon,item.value === lineType && 'line-form__line-icon_on']"
                :title="item.tips"
              />
            </div>
          </div>

          <div class="line-form__search">
            <i class="iconfont icon-exchange" />
            <div class="line-form__search-content">
              <div
                class="line-form__search-input"
                :class="{'line-form__search-input_on': fromLocal}"
              >
                <label>起</label>
                <PlaceSearch
                  ref="fromLocal"
                  @onTipsChange="val => handleOnTipsChange('fromLocal', val)"
                  placeholder="请输入起点"
                  :Autocomplete="Autocomplete"
                  :local.sync="fromLocal"
                />
              </div>
              <div
                class="line-form__search-input"
                :class="{'line-form__search-input_on': toLocal}"
              >
                <label>终</label>
                <PlaceSearch
                  ref="toLocal"
                  @onTipsChange="val => handleOnTipsChange('toLocal', val)"
                  placeholder="请输入终点"
                  :Autocomplete="Autocomplete"
                  :local.sync="toLocal"
                />
              </div>

              <div class="line-form__submit">
                <div class="line-form__submit-btn" @click="drawLine()">{{lineOptions.find(({value}) => value === lineType).label}}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- 路线结束 -->

      <!-- 下拉列表开始 -->
      <Dropdown
        v-show="DropdownVisible"
        :tips="tips"
        @onLocalChange="handleOnLocalChange"
        :style="{top: $refs[activeName] && ($refs[activeName].clientHeight + 'px')}"
      />
      <!-- 下拉列表结束 -->
    </div>
  </div>
</template>

<script>
import PlaceSearch from "./PlaceSearch.vue";
import Dropdown from "./Dropdown.vue";

export default {
  props: {
    map: [Object]
  },

  components: {
    PlaceSearch,
    Dropdown
  },

  data() {
    return {
      visible: true,
      activeName: "search", //search | line
      tips: [], //下拉列表选项
      /**
       * searchLocal | fromLocal | toLocal
       * @desc 当前搜索类型
       */
      type: "searchLocal",
      searchLocal: null, //搜索地址
      fromLocal: null, //开始地址
      toLocal: null, //结束地址
      Autocomplete: null, //高德自动完成实例
      Driving: null, //高德开车路线查询实例
      Transfer: null, //高德公交路线查询实例
      Walking: null, //高德步行路线查询实例
      //路线选项
      lineOptions: [
        {
          icon: "icon-jiache",
          value: "Driving",
          tips: "驾车",
          label: "开车去"
        },
        {
          icon: "icon-gongjiao",
          value: "Transfer",
          tips: "公交",
          label: "坐公交"
        },
        { icon: "icon-buxing", value: "Walking", tips: "步行", label: "走路去" }
      ],
      /**
       * Driving | Transfer | Walking
       * @desc 路线类型
       */
      lineType: "Driving",
      DropdownVisible: false,
      marker: null
    };
  },

  watch: {
    map(map) {
      if (this.Driving) return;
      console.log(map);
      this.Driving = new AMap.Driving({ map });
      this.Transfer = new AMap.Transfer({ map });
      this.Walking = new AMap.Walking({ map });

      // init Autocomplete
      this.Autocomplete = new AMap.Autocomplete({ datatype: "POI" });

      //设置用户当前城市
      new AMap.CitySearch().getLocalCity((status, result) => {
        if (status === "complete" && result.info === "OK") {
          this.Autocomplete.setCity(result.city);
        }
      });
    }
  },

  methods: {
    changeActiveName(type) {
      if (type === "search") this.clearMap();
      this.activeName = type;
      this.DropdownVisible = false;
    },
    handleOnTipsChange(type, tips) {
      this.type = type;
      this.tips = tips;
      this.DropdownVisible = !!tips.length;
    },
    handleOnLocalChange(val) {
      this[this.type] = val;
      this.DropdownVisible = false;

      if (this.type === "searchLocal") {
        this.clearMap();
        this.marker = new AMap.Marker({
          map: this.map,
          position: val.location,
          content: `<i class="iconfont icon-marker" style="font-size: 30px;color:#f44"></i>`,
          offset: new AMap.Pixel(-15, -15),
          label: {
          content: `<div class="bsj-infowindow" style="max-width:200px">${val.name}</div>`,
          offset: new AMap.Pixel(0, 10)
        }
        });
        this.map.setCenter(val.location);
        this.map.setZoom(18);
      } else {
        this.handleLineChange();
      }
    },
    //处理路线改变
    handleLineChange() {
      const next =
        this.type === "fromLocal"
          ? !this.toLocal && "toLocal"
          : !this.fromLocal && "fromLocal";

      //如果有下一个则聚焦到下一个
      if (next) {
        this.$refs[this.type].blur();
        this.$refs[next].focus();
      } else {
        this.drawLine();
      }
    },
    //绘制路线
    drawLine() {
      if (!this.fromLocal || !this.toLocal) return;
      this.clearMap();

      this.lineType === "Transfer" &&
        this[this.lineType].setCity(this.fromLocal.adcode);

      this[this.lineType].search(
        this.fromLocal.location,
        this.toLocal.location,
        status => {
          status !== "complete" && alert("获取路线数据失败");
        }
      );
    },
    clearMap() {
      this.marker && this.marker.setMap(null);

      this.lineOptions.map(({ value }) => {
        this[value].clear();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.slide_left-top-enter-active,
.slide_left-top-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: left center;
}
.slide_left-top-enter,
.slide_left-top-leave-active {
  opacity: 0;
  transform: scale(0);
}

.MapSearch {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2201;
  cursor: auto;

  &__content {
    width: 50px;
    height: 45px;
    background: #fff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      width 0.5s cubic-bezier(0.23, 1, 0.32, 1);

    &_show {
      width: 360px;
    }
  }

  &__zoom {
    position: absolute;
    top: 6px;
    left: 8px;
    width: 34px;
    height: 34px;
    z-index: 99999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #3385ff;
    user-select: none;
    z-index: 1;

    &:hover {
      opacity: 0.8;
    }
  }

  &__search {
    position: absolute;
    left: 50px;
    top: 0;
    width: 265px;
    height: 45px;
    box-sizing: border-box;
    z-index: 2202;
    border-radius: 2px;

    input {
      position: absolute;
      top: 12.5px;
      left: 0;
      box-sizing: border-box;
      text-indent: 2px;
      z-index: 2200;
      border: none;
      width: 219px;
      height: 20px;
      line-height: 20px;
      padding: 0;
      letter-spacing: 0.5px;
      font-size: 14px;
      outline: none;
      color: inherit;
      font: inherit;
    }
  }

  &__track-btn {
    pointer-events: auto;
    color: #3385ff;
    background: #fff;
    width: 50px;
    height: 100%;
    border: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 0 2px 2px 0;
    display: flex;
    align-items: center;
    user-select: none;
    position: absolute;
    right: 0;
    top: 0;
  }

  &__track-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 17px;
    border-left: 1px solid #eee;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1);

    &:hover {
      opacity: 0.8;
    }

    &_show {
      opacity: 1;
    }
  }
}

.line-form {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 14px;
  padding-bottom: 68px;
  background: #3d93fd;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  z-index: 6300;

  &__tabs {
    width: 200px;
    border: 0;
    border-radius: 0;
    background: none;
    height: 30px;
    margin: 0 auto;
    white-space: nowrap;
    display: flex;
  }

  &__tabs-item {
    height: 30px;
    flex: 1;
    line-height: 30px;
    position: relative;
    display: block;
    float: left;
    text-align: center;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  &__line-icon {
    font-size: 19px;
    color: #fff;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 0.72;
    }

    &_on {
      opacity: 1;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__close {
    position: absolute;
    right: 14px;
    top: 14px;
    color: #edf8ff;
    cursor: pointer;
    font-weight: bold;
    font-size: 24px;

    &:hover {
      opacity: 0.5;
    }
  }

  &__search {
    margin-top: 15px;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 0;
      width: 18px;
      height: 28px;
      margin-top: -14px;
      cursor: pointer;
      color: #fff;
      font-size: 18px;
    }
  }

  &__search-content {
    margin: 0 30px;
  }

  &__search-input {
    position: relative;
    height: 34px;
    line-height: 34px;
    width: 270px;
    font-size: 14px;
    color: #acd7ff;
    background-color: #3587eb;
    border-radius: 2px;
    margin-bottom: 10px;

    &_on {
      label {
        color: #e1f1ff;
      }
    }

    label {
      margin-left: 10px;
    }

    input {
      width: 78%;
      height: 34px;
      line-height: 34px;
      border: none;
      background: transparent;
      text-indent: 5px;
      color: #acd7ff;
      padding: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      outline: none;

      &::-webkit-input-placeholder {
        color: #acd7ff;
      }
    }
  }

  &__submit {
    margin-top: 17px;
    border-bottom: none;
    width: 270px;
    text-align: right;
    position: absolute;
  }

  &__submit-btn {
    display: inline-block;
    padding: 0 25px;
    height: 32px;
    line-height: 32px;
    background-color: #559ffb;
    border: none;
    border-radius: 2px;
    color: #fff;
    font-size: 14px;
    text-decoration: none;
    box-shadow: 0px 1px 1px 0 rgba(0, 0, 0, 0.21);
    cursor: pointer;

    &:hover {
      background: #65a9fc;
      opacity: 0.7;
    }
  }
}
</style>
