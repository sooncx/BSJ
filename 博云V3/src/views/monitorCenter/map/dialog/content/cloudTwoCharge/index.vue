<template>
  <Eldialog
    v-bind="$attrs"
    v-model:visible="show"
    width="800px"
    title="云端二押点"
  >
    <template v-slot:form>
      <div class="cloudBox">
        <div class="item">
          <div class="header">
            <p>选择省份</p>
            <div>当绑定的车辆在云端二押点(半径50米)范围，并且满足停留时间60分钟，系统会自动报警</div>
          </div>
          <div class="content">
            <div
              v-for="item in list"
              :key="item"
            >
              <div
                @click="selectProvince(item)"
                :style="{color:province && province.code == item.code?'rgb(0, 132, 255)':''}"
              >
                {{item.name}}
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="header">
            <p>选择地级市</p>
          </div>
          <div class="content">
            <div
              v-for="item in province && province.list"
              :key="item"
            >
              <div
                v-if="item.provinceCode && isProvince(item.provinceCode)"
                @click="selectCity(item)"
                :style="{color:city && city.code == item.code?'rgb(0, 132, 255)':''}"
              >
                {{item.name}}
              </div>
            </div>
          </div>
        </div>
        <div class="mapBox">
          <div
            style="height:100%;width:100%"
            ref="CloudMapRef"
          ></div>
        </div>
      </div>
    </template>
  </Eldialog>
</template>
<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  toRefs,
  nextTick,
  computed,
  watch,
  ref,
  Ref,
} from "vue";
import API from "@/api/httpApi";
import Eldialog from "@/components/Eldialog/index.vue";
import { useAmap } from "../../../Amap";
import { useFunction } from "../../../../function";
export default defineComponent({
  components: {
    Eldialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const CloudMapRef = ref<HTMLDivElement | null>(null);
    let AmapObj = null as any;
    const { QueryMortgagePoint } = useFunction();
    const data = reactive({
      list: [],
      province: null,
      city: null,
      clear() {
        data.list = [];
        data.province = null;
        data.city = null;
      },
      isProvince(code: string) {
        return ![
          "110000",
          "120000",
          "310000",
          "500000",
          "810000",
          "820000",
          "710000",
        ].includes(code);
      },
      async selectProvince(item: any) {
        data.province = item;
        data.city = null;
        if (!data.isProvince(item.code)) {
          const res = await QueryMortgagePoint(item.name);
          AmapObj.drawTwoChargePoints(res);
          AmapObj.drawCitys(item.code);
        } else {
          AmapObj.clearMap();
        }
      },
      async selectCity(item: any) {
        data.city = item;
        const res = await QueryMortgagePoint(item.name);
        AmapObj.drawTwoChargePoints(res);
        AmapObj.drawCitys(item.code);
      },
    });
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          nextTick(async () => {
            const { obj, flag } = await API.getAreaBaseInfo();
            if (flag == 1) {
              const { list } = obj;
              data.list = list as any;
            }
            AmapObj = useAmap(CloudMapRef as Ref<HTMLDivElement>);
            // 初始化地图
            AmapObj.initMap();
          });
        } else {
          data.clear();
        }
      }
    );
    return {
      show,
      CloudMapRef,
      ...toRefs(data),
      ...toRefs(props),
    };
  },
});
</script>
<style lang="less" scoped>
.cloudBox {
  padding: 0px 16px 10px 16px;
  height: 550px;
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgb(0, 132, 255);
      padding: 5px 0;
      p {
        color: rgb(0, 132, 255);
        font-weight: bold;
      }
      div {
        padding: 3px;
        border: 1px solid skyblue;
        color: red;
        background: rgba(135, 207, 235, 0.171);
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      padding: 3px 0;
      & > div {
        & > div {
          padding: 5px 7px 5px 0px;
          cursor: pointer;
          &:hover {
            color: rgb(0, 132, 255);
          }
        }
      }
    }
  }
  .mapBox {
    width: 100%;
    flex: 1;
  }
}
</style>