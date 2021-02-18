<template>
  <Modal
    v-bind="$attrs"
    :width="1150"
    :bodyStyle="{ padding: '0' }"
    :footer="null"
    :title="curData && curData.name"
    :maskClosable="false"
    :draggable="false"
  >
    <template
      v-slot:description
      v-if="
        (curData && curData.key === 'riskTotalNum') ||
        (curData && curData.key === 'carVehOfflineNum') ||
        (curData && curData.key === 'separateNum')
      "
    >
      <i
        class="iconfont icon-yiwen layer"
        @click.stop="showTips(curData.key)"
      ></i>
    </template>
    <div class="riskModal">
      <!-- riskTotalNum 风险车辆Tab -->
      <risk-tab
        v-if="curData && curData.key === 'riskTotalNum'"
        v-model:active="tabActive"
        @changeTab="changeTab"
      />
      <el-table
        :data="tableData"
        v-if="column.length !== 0"
        border
        max-height="400"
        height="400"
        size="small"
        v-loading="loading"
        ref="tableRef"
      >
        <el-table-column
          v-for="(item, index) in column"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.width"
          :align="item.align"
          :header-align="item.align"
          :fixed="item.fixed ? item.fixed : false"
          :formatter="formatter"
        >
          <template
            #default="{ row }"
            v-if="
              item.prop === 'concernLevel' ||
              item.prop === 'address' ||
              item.prop === 'carType' ||
              item.prop === 'vehicleState'
            "
          >
            <!-- 关注度等级 -->
            <template
              v-if="item.prop === 'concernLevel' && 'concernLevel' in row"
            >
              <el-tooltip :content="row.remark || '--'" placement="top">
                <div :class="`riskModal__dataType lvBg-${row.concernLevel}`">
                  {{
                    Number(row.concernLevel) === 1
                      ? "高"
                      : Number(row.concernLevel) === 2
                      ? "中"
                      : "低"
                  }}
                </div>
              </el-tooltip>
            </template>
            <template
              v-if="item.prop === 'concernLevel' && !('concernLevel' in row)"
              >--</template
            >

            <!-- 地址 -->
            <template v-if="item.prop === 'address' && 'address' in row">
              <span
                style="color: #3381e8; cursor: pointer"
                @click="goDetail(row)"
                >{{ row.address || "--" }}</span
              >
            </template>

            <!-- 关联根据 -->
            <template v-if="item.prop === 'carType' && 'carType' in row">
              <el-tooltip
                :content="`此车辆关联设备列表根据${
                  row.carType === 0 ? '车牌号' : '车架号'
                }匹配`"
                placement="top"
              >
                <div>
                  {{ row.carType === 0 ? "车牌号" : "车架号" }}
                </div>
              </el-tooltip>
            </template>

            <!-- 关联设备状态 -->
            <template v-if="item.prop === 'vehicleState' && 'list' in row">
              <div class="riskModal__relationState">
                <div
                  class="riskModal__relationState__item"
                  v-for="(rela, i) in row.list"
                  :key="'rela' + i"
                  :class="{ online: rela.vehicleFlag === 0 }"
                >
                  <span class="circle"></span>
                  {{ rela.plate }}({{ rela.isOnline }})
                  <el-tooltip content="查流量" placement="top">
                    <i class="iconfont icon-sim" @click="showModal('sim')"></i>
                  </el-tooltip>
                  <el-tooltip
                    :content="rela.schemaValue"
                    placement="top"
                    v-if="'schemaValue' in rela"
                  >
                    <i class="iconfont icon-yiwen"></i>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          :width="
            curData &&
            (curData.key === 'carVehOfflineNum' || curData.key === 'longStopNum'
              ? 70
              : 90)
          "
          align="center"
          header-align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <div class="riskModal__operation">
              <el-popover
                placement="left"
                width="50"
                trigger="hover"
                popper-class="riskModal__operation__popper"
                :close-delay="100"
                v-if="
                  curData &&
                  curData.key !== 'carVehOfflineNum' &&
                  curData.key !== 'longStopNum'
                "
              >
                <template #reference>
                  <i class="iconfont icon-bsj-gzd"></i>
                </template>
                <ul class="riskModal__operation__follow">
                  <li @click="showModal('remark', row, 1)">高</li>
                  <li @click="showModal('remark', row, 2)">中</li>
                  <li @click="showModal('remark', row, 3)">低</li>
                  <li @click="showModal('remark', row)">修改备注</li>
                  <li @click="removeConcern(row)">清除关注</li>
                </ul>
              </el-popover>
              <el-tooltip content="结清" placement="top" v-permission="160501">
                <i
                  class="iconfont icon-bsj-jq"
                  @click="showModal('jieqing', row)"
                ></i>
              </el-tooltip>
              <el-tooltip content="查看详情" placement="top">
                <i class="iconfont icon-bsj-xq" @click="goDetail(row)"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 导出 -->
      <div class="riskModal__footer">
        <div>
          <a-button
            type="primary"
            v-if="
              curData &&
              curData.key !== 'carVehOfflineNum' &&
              curData.key !== 'separateNum'
            "
            @click="exportData"
          >
            <i class="iconfont icon-daochu"></i>导出
          </a-button>

          <template v-if="curData && curData.key === 'longStopNum'">
            <el-popover placement="top" width="230" trigger="click">
              <template #reference>
                <span class="riskModal__longStopSet">设置查看停留时长</span>
              </template>
              <div>
                <p>设置</p>
                <div class="riskModal__longStopSet__input">
                  停留超长范围:
                  <input
                    type="text"
                    v-model.number="start"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                  />
                  天 ~
                  <input
                    type="text"
                    v-model.number="end"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                  />
                  天
                </div>
                <div style="display: flex; justify-content: center">
                  <a-button type="primary" @click="longStopChange"
                    >保存</a-button
                  >
                </div>
              </div>
            </el-popover>
            <span style="color: red; margin-left: 30px"
              >超长停车：显示停留时间在所设置范围的所有车辆</span
            >
          </template>
        </div>

        <a-pagination
          :page-size-options="['100', '200', '300', '400']"
          :total="total"
          :show-total="(total) => `共 ${total} 条`"
          size="small"
          v-model:pageSize="pageSize"
          v-model:current="current"
          @change="currentChange"
        />
      </div>
    </div>

    <!-- 第二层MODAL 提示 -->
    <TipsModal
      v-model:visible="visible"
      :typeLayer="typeLayer"
      @nextStep="nextStep"
    />

    <!-- 第二层MODAL 内容 -->
    <Modal
      :title="
        typeLayer === 'jieqing'
          ? '结清'
          : typeLayer === 'sim'
          ? '查流量'
          : '填写关注备注'
      "
      v-model:visible="show"
      :width="typeLayer === 'remark' ? 380 : 630"
      :zIndex="1001"
      :footer="null"
      :bodyStyle="{ padding: '0' }"
      :destroyOnClose="true"
      :maskClosable="false"
      :draggable="false"
    >
      <template
        v-slot:description
        v-if="typeLayer === 'jieqing' || typeLayer === 'sim'"
      >
        <i
          v-if="typeLayer === 'jieqing'"
          class="iconfont icon-yiwen layer"
          @click.stop="showTips('jieqing')"
        ></i>

        <span v-if="typeLayer === 'sim'" style="color: #999; font-size: 12px"
          >由于运营商的原因，查询结果可能有1-24小时延迟</span
        >
      </template>
      <!-- 结清 -->
      <SettleTable
        :vehicleId="tableRow.vehicleId"
        @SettlementConfirm="SettlementConfirm"
        v-model:visible="show"
        v-if="typeLayer === 'jieqing'"
      />
      <!-- 查流量 -->
      <SearchTraffic v-model:visible="show" v-if="typeLayer === 'sim'" />
      <!-- 填写关注备注 -->
      <FollowRemark
        :rowData="tableRow"
        v-if="typeLayer === 'remark'"
        @confirm="remarkChange"
        @cancel="show = false"
      />
    </Modal>
  </Modal>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  toRefs,
  watch,
  defineAsyncComponent,
  nextTick,
  inject,
  Ref,
} from "vue";
import { Modal } from "@/components/Modal";
import {
  concernList,
  carVehOfflineNum,
  longStopNum,
  defalutColumn,
  riskTotalNum,
} from "./riskColumn";
import { GetGeo } from "@/api/apiFn";
import { isArray } from "@/utils/is";
import { useGo } from "@/hooks/web/usePage";
import API from "@/api/riskControlCenter";
import APIType from "@/api/riskControlCenter/type";
import { useMessage } from '@/hooks/web/useMessage';

interface riskType {
  key: string;
  name: string;
  value: number | string;
  param?: string;
  exportKey: number | string;
}

export default defineComponent({
  props: {
    curData: Object as PropType<riskType>,
  },
  components: {
    Modal,
    RiskTab: defineAsyncComponent(() => import("./RiskTab.vue")),
    TipsModal: defineAsyncComponent(() => import("./TipsModal.vue")),
    SettleTable: defineAsyncComponent(
      () =>
        import(
          "@/views/monitorCenter/LeftContent/dialog/contents/Settlement/SettleTable.vue"
        )
    ),
    SearchTraffic: defineAsyncComponent(
      () =>
        import(
          "@/views/monitorCenter/LeftContent/dialog/contents/TrafficSearch/searchTraffic.vue"
        )
    ),
    FollowRemark: defineAsyncComponent(() => import("./FollowRemark.vue")),
  },
  setup(props) {
    const message = useMessage();
    const loading = ref(false);
    const tableData = ref(<any>[]);
    const column = ref(<any>[]);
    const tableRef = ref(<any | null>null);
    const tabActive = ref(1); // 风险报警Tab
    const getriskdata = <Ref<() => void>>inject("updateRiskData"); // 更新所有报警数量

    const flag = ref(false);
    // 相同报警不重新渲染  只显示隐藏
    // watch(
    //   () => props.curData,
    //   () => {
    //     pagination && (pagination.current = 1);
    //     pagination && (pagination.total = 0);

    //     column.value = [];
    //     tableData.value = [];
    //     nextTick(() => {
    //       getData();
    //     });
    //   }
    // );

    // 每次进来都重新渲染
    const modalVisible = inject("visible");
    watch(
      () => modalVisible,
      (val: any) => {
        if (val.value) {
          pagination && (pagination.current = 1);
          pagination && (pagination.total = 0);
          column.value = [];
          tableData.value = [];
          nextTick(() => {
            getData();
          });
        }
      },
      {
        deep: true,
      }
    );

    async function getData() {
      if (props.curData?.key === "concernList") {
        column.value = concernList;
        loading.value = true;
        await getConcernList();
      }
      if (props.curData?.key === "riskTotalNum") {
        column.value = riskTotalNum;
        loading.value = true;
        await getRiskTotalNum();
      }
      if (props.curData?.key === "carVehOfflineNum") {
        column.value = carVehOfflineNum;
        loading.value = true;
        await getCarVehOfflineNum();
      }
      if (props.curData?.key === "longStopNum") {
        column.value = longStopNum;
        loading.value = true;
        await getStopTimeSetting();
        await getLongStopNum();
      }
      if (
        props.curData?.key !== "concernList" &&
        props.curData?.key !== "riskTotalNum" &&
        props.curData?.key !== "carVehOfflineNum" &&
        props.curData?.key !== "longStopNum"
      ) {
        column.value = defalutColumn;
        loading.value = true;
        await getAlarmInfo();
      }

      tableRef.value.doLayout();
    }

    // 格式化表格内容
    const formatter = (row: any, column: any, cellValue: any) => {
      let str = "--";
      if (column.property === "speed") {
        return cellValue ? cellValue + "km/h" : "静止";
      }
      if (column.property === "pos") {
        switch (cellValue) {
          case -1:
            str = "--";
            break;
          case 0:
            str = "GPS信号弱"; // 不定位
            break;
          case 1:
            str = "卫星定位";
            break;
          case 2:
            str = "WIFI定位";
            break;
          case 3:
            str = "基站定位"; // 多基站
            break;
          case 4:
            str = "基站定位"; // 单基站
            break;
        }
        return str;
      }

      if (column.property === "stateTime") {
        let statusTxt = "";
        switch (row.state) {
          case 0:
            statusTxt = "离 线:";
            return statusTxt + cellValue;
            break;
          case 1:
            statusTxt = "行 驶:";
            return statusTxt + cellValue;
            break;
          case 2:
            statusTxt = "停 车:";
            return statusTxt + cellValue;
            break;
          case 3:
            statusTxt = "从未上线";
            return statusTxt;
            break;
        }
      }
      return cellValue || str;
    };

    // 获取重点关注
    const getConcernList = async () => {
      const info = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { obj } = await API.pageHomeUserConcern(info);

      let posList: { lat: number; lon: number; tag: number }[] = [];
      obj.data.forEach((item: any, index: number) => {
        posList.push({
          lat: item.lat,
          lon: item.lon,
          tag: index,
        });
      });
      const addressList = await GetGeo(posList);

      tableData.value = obj.data.map((item: any, index: number) => ({
        ...item,
        vehicleId: item.vehId,
        index: index + (pagination.current - 1) * pagination.pageSize + 1,
        address: addressList[index].address,
      }));

      pagination.total = obj.total;

      loading.value = false;
    };

    // 获取风险车辆
    const getRiskTotalNum = async () => {
      const info = {
        type: tabActive.value,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { obj } = await API.pageRiskAnalysis(info);

      let posList: { lat: number; lon: number; tag: number }[] = [];
      obj.data.forEach((item: any, index: number) => {
        posList.push({
          lat: item.alarmLat,
          lon: item.alarmLon,
          tag: index,
        });
      });
      const addressList = await GetGeo(posList);

      tableData.value = obj.data.map((item: any, index: number) => ({
        ...item,
        index: index + (pagination.current - 1) * pagination.pageSize + 1,
        address: addressList[index].address,
      }));

      pagination.total = obj.total;

      loading.value = false;
    };

    // 风险车辆切换tab
    const changeTab = async (type: number) => {
      getData();
    };

    // 获取多设备离线
    const getCarVehOfflineNum = async () => {
      const info = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { obj } = await API.pageRelatedOffline(info);

      tableData.value = obj.data.map((item: any, index: number) => ({
        keyworks: item[item.length - 1].carPlate,
        carType: item[item.length - 1].carType,
        groupName: item[item.length - 1].groupName,
        vehicleId: item[item.length - 1].vehicleId,
        list: item,
        index: index + (pagination.current - 1) * pagination.pageSize + 1,
      }));

      pagination.total = obj.total;

      loading.value = false;
    };

    // 获取超长停车
    const day = reactive({
      start: 0,
      end: 0,
      /**
       * 库存统计过滤有车架号的车：0：过滤，1不过滤
       */
      stockFrameNoFlag: null,
    });
    const getLongStopNum = async () => {
      const info = {
        startDay: day.start,
        endDay: day.end,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { obj, flag, msg } = await API.pageLongStop(info);

      if (flag === 1) {
        let posList: { lat: number; lon: number; tag: number }[] = [];
        obj.data.forEach((item: any, index: number) => {
          posList.push({
            lat: item.lat,
            lon: item.lon,
            tag: index,
          });
        });
        const addressList = await GetGeo(posList);

        tableData.value = obj.data.map((item: any, index: number) => ({
          ...item,
          index: index + (pagination.current - 1) * pagination.pageSize + 1,
          address: addressList[index].address,
        }));

        pagination.total = obj.total;
      } else {
        message.error(msg);
        tableData.value = [];
      }

      loading.value = false;
    };

    const longStopChange = async () => {
      if (['', undefined, null, NaN].includes(day.start) || ['', undefined, null, NaN].includes(day.end)) {
        message.error('设置停留超长范围只能为数字');
        return;
      }
      await API.addStopTimeSetting({
        startDay: day.start,
        endDay: day.end,
      });

      pagination.current = 1;
      loading.value = true;
      getriskdata.value();
      getLongStopNum();
    };

    // 获得用户查询停留点设置
    const getStopTimeSetting = async () => {
      const { obj } = await API.getStopTimeSetting();
      const { startDay, endDay, stockFrameNoFlag } = obj;
      day.start = startDay;
      day.end = endDay;
      day.stockFrameNoFlag = stockFrameNoFlag;
    };

    // 获取报警
    const getAlarmInfo = async () => {
      if (!props.curData?.param) return;
      const info = {
        type: props.curData?.param,
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };

      const { obj } = await API.pageHomePageAlarmInfo(info);

      let posList: { lat: number; lon: number; tag: number }[] = [];
      obj.data.forEach((item: any, index: number) => {
        posList.push({
          lat: item.lat,
          lon: item.lon,
          tag: index,
        });
      });
      const addressList = await GetGeo(posList);

      tableData.value = obj.data.map((item: any, index: number) => ({
        ...item,
        index: index + (pagination.current - 1) * pagination.pageSize + 1,
        pathName: addressList[index].address,
        address: addressList[index].address,
      }));

      pagination.total = obj.total;

      loading.value = false;
    };

    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 50,
    });

    const currentChange = (current: number, pageSize: number) => {
      console.log(current, pageSize);
      getData();
    };

    // 展示内层modal
    const InnerLayer = reactive({
      visible: false,
      show: false,
      typeLayer: "",
    });
    let concernLevel: number | undefined = undefined; // 关注度等级
    const showModal = (type: string, row?: any, level?: number) => {
      InnerLayer.typeLayer = type;
      const flagJQ = localStorage.getItem("isSettleFirst");
      const flagSim = localStorage.getItem("isSettleFirst");

      concernLevel = level;
      tableRow.value = isArray(row) ? row[0] : row;
      if (!flagJQ || !flagSim) {
        InnerLayer.visible = true;
        return;
      }
      InnerLayer.show = true;
    };

    const showTips = (type: string) => {
      InnerLayer.typeLayer = type;
      InnerLayer.visible = true;
    };

    const nextStep = () => {
      InnerLayer.visible = false;
      if (
        InnerLayer.typeLayer === "sim" ||
        InnerLayer.typeLayer === "jieqing"
      ) {
        InnerLayer.show = true;
      }
    };

    // 关注备注修改
    const tableRow = ref();
    const remarkChange = (val: string) => {
      InnerLayer.show = false;
      tableData.value.forEach((item: any) => {
        if (item.index === tableRow.value.index) {
          item.remark = val;
          if (concernLevel || "concernLevel" in item) {
            AddUserConcern(item, val);
          } else {
            message.error("请添加关注度后再修改关注备注信息");
          }
        }
      });
    };

    // 添加/修改 关注度
    const AddUserConcern = async (row: any, remark?: string) => {
      const info = {
        concernLevel: concernLevel || row.concernLevel,
        vehicleId: tableRow.value.vehicleId,
        remark: remark,
      };

      const { flag } = await API.AddUserConcern(info);

      if (flag === 1) {
        row.concernLevel = concernLevel;
        concernLevel = undefined;
        getriskdata.value();
      }
    };

    // 清除关注度
    const removeConcern = async (row: any) => {
      const { flag } = await API.DelUserConcern({ vehicleId: row.vehicleId });

      if (flag === 1) {
        tableData.value.forEach((item: any, index: number) => {
          if (
            props.curData?.key === "concernList" &&
            item.index === row.index
          ) {
            message.success("删除成功");
            getConcernList();
          } else if (item.index === row.index) {
            item.remark = "--";
            delete item.concernLevel;
          }
          getriskdata.value();
        });
      }
    };

    const go = useGo();
    // 查看详情
    const goDetail = (row: any) => {
      go({
        name: "monitorCenter",
        // query: { vehicleId: row.vehicleId, groupId: row.groupId, plate: row.plate },
        params: {
          vehicleId: row.vehicleId,
          groupId: row.groupId,
          plate: row.plate,
        },
      });
    };

    // 导出数据
    const updateexportmsg = <
      (val: boolean, keys: number, type: string) => void
    >inject("UPDATE_EXPORTMSG");
    const exportData = () => {
      updateexportmsg(true, props.curData?.exportKey as number, "single");
    };

    // 结清成功回调
    const SettlementConfirm = () => {
      getData();
      getriskdata.value();
    };

    return {
      tableRef,
      loading,
      tableData,
      column,
      formatter,
      ...toRefs(pagination),
      ...toRefs(day),
      currentChange,
      tabActive,
      changeTab,
      longStopChange,
      ...toRefs(InnerLayer),
      showModal,
      showTips,
      nextStep,
      tableRow,
      remarkChange,
      removeConcern,
      goDetail,
      exportData,
      SettlementConfirm,
    };
  },
});
</script>
<style lang="less" scoped>
@import "../css/RiskModal.less";
</style>
<style>
/* 弹出框边框 */
.riskModal__operation__popper.el-popover.el-popper {
  padding: 0;
}
</style>