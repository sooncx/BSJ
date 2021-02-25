<template>
  <a-modal 
    v-model:visible="show"
    width="400px" 
    title="车辆续费" 
    :maskClosable="false"
    @cancel="handleBack" 
    :confirm-loading="modalLoading" 
    @ok="handleOk" 
    class="carRechargeModal">
    <template #footer class="foot">
      <div class="footer__left">
        <label><i class="iconfont icon icon-jinbi"></i>{{expirePrice}}</label>
      </div>
      <div class="footer__right">
        <a-button key="back" @click="handleBack">
          返回
        </a-button>
        <a-button key="submit" type="primary" :loading="modalLoading" @click="handleOk">
          确认
        </a-button>
      </div>
    </template>
    <div class="row" v-if="carRechargeNumber == 0">
      <label>车牌号码：</label>
      <div class="item input">{{plate}}</div>
    </div>
    <div class="row" v-if="carRechargeNumber == 0">
      <label>到期时间：</label>
      <div class="item input">{{expireTime}}</div>
    </div>
    <div class="row" v-if="carRechargeNumber !== 0">
      <label>车辆数：</label>
      <div class="item input">{{carRechargeNumber}}</div>
    </div>
    <div class="row">
      <label>续费时长：</label>
      <div class="item marks">
        <a-slider :marks="marks" :step="null" :tooltipVisible="false" @change="changeSlider" v-model:value="expireValue" />
        <p v-if="carRechargeNumber == 0">续费后到期时间：{{getExpire}}</p>
      </div>
    </div>
    
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs,PropType,watch, h,computed} from "vue";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
interface DayAndPrice {
  month:number,
  price:number,
}
interface carRechargeItem {
  expireTime:string,
  plate: string,
  groupId: number,
  vehicleId: number,
  NOW:string,
}
export default defineComponent({
  name: "carRechargeModal",
  props: {
    // 续费车辆数据
    dataItem: {
      type: [Object] as PropType<carRechargeItem[]>,
      default:[{
        expireTime: '',               // 过期时间 
        plate: '',                    // 车牌号
        groupId: 0,                   // 车组ID
        vehicleId: 0,                 // 车辆ID
        NOW: '',                      // 服务器时间
      }]
    },
    // 续费数量
    carRechargeNumber: {
      type: Number as PropType<any>,
      default: 0
    },
    // 续费类型  normal正常续费  import批量导入续费
    rechargeType: {
      type: String,
      default: 'normal'
    },
    // 窗口显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      modalLoading: false,
      expireValue: 0,                     // 续费日期
      plate: '',                          // 车牌号
      NOW: '',                            // 当前时间 服务器时间
      expireTime: '',                     // 过期时间
      expirePrice: 1,                     // 续费费用
      marks: {                            // 续费时长 选项
        0: '1月',14: '2月',28: '3月',42: '4月',56: '1年',70: '2年',85: '3年',
        100: { 
          style: { color: '#f50' },
          label: h('strong', '4年'),
        },
      },
    });

    // 获取续费天数 对应的费用和天数
    function getDayAndPrice(value:number):DayAndPrice{
      let item:DayAndPrice = {
        month: 0,
        price: 0,
      };
      switch(value){
        case 0:                           // 一个月
          item.month = item.price = 1;
          break;
        case 14:                          // 二个月
          item.month = item.price = 2;
          break;
        case 28:                          // 三个月
          item.month = item.price = 3;
          break;
        case 42:                          // 四个月
          item.month = item.price = 4;
          break;
        case 56:                          // 十二个月 一年
          item.month = 12
          item.price = 5;
          break;
        case 70:                          // 二十四个月 二年
          item.month = 24
          item.price = 10;
          break;
        case 85:                          // 三十六个月 三年
          item.month = 36
          item.price = 15;
          break;
        case 100:                         // 四十八个月 四年
          item.month = 48
          item.price = 20;
          break;
      }
      return item;
    }

    
    // 月份加减 返回 年份和月份
    function addMonths(yearMonthDay:any,monthNum:any){
        let arr = yearMonthDay.split('-');          // 2020-08-19或2020-08
        let year = parseInt(arr[0]);
        let month:any = parseInt(arr[1]);
        month = month + monthNum;
        // 是否大于12月
        if(month > 12){                             // 月份加
            let yearNum = (month - 1) / 12;
            month = month % 12==0 ? 12 : month % 12;
            year += parseInt(yearNum as any);
        }else if(month <= 0){                       // 月份减
            month = Math.abs(month);
            let yearNum = (month + 12) / 12;
            year -= parseInt(yearNum as any);
        }
        // 小于10个月 补零
        month = month < 10 ? "0" + month : month;
        return year + "-" + month;
    }

    // 计算 费用和天数
    const getExpire = computed(() => {
      if(data.NOW){
        let expireDayAndPrice:DayAndPrice = getDayAndPrice(data.expireValue);
        data.expirePrice = expireDayAndPrice.price;
        let timeNow = new Date(data.NOW);
        let getTime = addMonths(timeNow.getFullYear() + '-' + (timeNow.getMonth() + 1),expireDayAndPrice.month);
        return getTime + '-' + timeNow.getDate();
      }
    });

    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    const recharge = async (addMonth:any) => {
      try {
        // 判断是否批量续费
        if(props.carRechargeNumber !== 0){
          let terminalNo = <any>[];
          props.dataItem.forEach((item:any)=>{
            terminalNo.push(item.terminalNo)
          });
          const { flag, msg } = await API.batchRecharge({terminalNo:terminalNo.join(','),addMonth});
          if(flag !== 1) throw msg;
        }else{
          const info = {
            addMonth,
            gvids: props.dataItem[0].groupId + ',' + props.dataItem[0].vehicleId
          }
          const { flag, msg } = await API.vehicleStateRecharge(info);
          if(flag !== 1) throw msg;
        }
      } catch (error) {
        ElMessage.error(error);
      }
    }

    // 提交数据方法
    const handleOk = () => {
      data.modalLoading = true;
      let expireDayAndPrice:DayAndPrice = getDayAndPrice(data.expireValue);
      let addMonth = expireDayAndPrice.month;
      // 判断续费类型 批量导入数据 提交月份就可以了 
      if(props.rechargeType === 'import'){
        emit("importGetmonth", addMonth);
      }else{
        // 提交续费
        recharge(addMonth);
        emit("submitData");
        ElMessage.success('续费成功');
      }
      emit("update:visible", false);
      data.modalLoading = false;
    }
    // 返回方法
    const handleBack = () => {
      emit("update:visible", false);
    }

    // 监听续费费用的加减
    const changeSlider = (changeValue:number) => {
      let expireDayAndPrice:DayAndPrice = getDayAndPrice(changeValue);
      data.expirePrice = expireDayAndPrice.price * props.carRechargeNumber;
    }
    
    watch(()=>props.visible,(value)=>{
      if (value) {
        data.expireValue = 0;
        data.expirePrice = 1 * props.carRechargeNumber;
        if(data.expirePrice === 0) data.expirePrice = 1;
        if(props.dataItem.length !== 0){
          data.plate = props.dataItem[0].plate;
          data.expireTime = props.dataItem[0].expireTime;
          data.NOW = props.dataItem[0].NOW;
        }
      }
    });

    return {
      show,
      changeSlider,
      handleOk,
      getExpire,
      handleBack,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less">
.carRechargeModal{
  .ant-modal-body{
    .row{
      margin: 10px 0px;
      display: flex;
      label{
        display: inline-block;
        width: 75px;
        line-height: 32px;
      }
      .item{
        width: 250px;
        padding-left:8px;
        line-height: 32px;
        color:#999999;
      }
      .marks{
        background-color: white;
        border:0;
      }
      .input{
        border:1px solid #D9E0E9;
        background-color: #f2f2f2;
      }
    }
  }
  .ant-modal-footer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    line-height: 32px;
    .footer__left{
      font-size:20px;
      i{
        display: inline-block;
        font-size:20px;
        width: 20px;
        height: 20px;
        margin-right:5px;
      }
      color:#F5BB1A;
    }
  }
}
</style>