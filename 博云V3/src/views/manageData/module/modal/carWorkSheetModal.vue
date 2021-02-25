<template>
  <a-modal width="760px" v-model:visible="show" :maskClosable="false" :title="title" destroyOnClose @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleBack">
        返回
      </a-button>
      <a-button   v-if="type !== 'show'" key="submit" type="primary" :loading="carWorkSheetConfirmLoading" @click="handleOk">
        提交
      </a-button>
    </template>
    <a-form ref="ruleForm" :model=form :rules="rules" class="carWorkSheetModal" >
      <div class="row">
        <a-form-item ref="name" label="车主姓名" name="carOwner">
          <a-input :disabled="formDisabled" v-model:value="form.carOwner" />
        </a-form-item>
        <a-form-item ref="name" label="联系电话" name="phone">
          <a-input :disabled="formDisabled" v-model:value="form.phone"  />
        </a-form-item>
      </div>
      <div class="row">
        <a-form-item ref="name" label="安装人员" name="installWorker">
          <a-select
            :disabled="formDisabled"
            v-model:value="form.installWorker"
            style="width: 248px"
            placeholder="请选择"
            ref="select"
          >
            <a-select-option 
            v-for="item in installWorkerList"
            :value="item.userId"
            :key="item.userId"
            >
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item ref="name" label="预安装时间" name="installTime">
          <el-date-picker
            :disabled="formDisabled"
            v-model="form.installTime"
            type="datetime"
            @blur="installTimeBlur"
            class="installTimeStyle"
            placeholder="选择日期时间">
          </el-date-picker>
        </a-form-item>
      </div>
      <div class="row" v-if="deviceList.length !== 0">
        <a-form-item ref="name" :style="{justifyContent: 'flex-end'}" label="安装设备" name="vehicleFlag">
            <span class="deviceTag" v-for="(item,index) in deviceList" :key="index"  @click="closeDeviceList(index)">
              {{item.plate}} <label v-if="type !== 'show'">x</label>
            </span>
        </a-form-item>
      </div>
      <div class="row" v-if="type !== 'show'">
        <a-form-item ref="name" label="是否安装设备" name="vehicleFlag">
          <a-radio-group :disabled="formDisabled" buttonStyle="solid" name="radioGroup" v-model:value="form.vehicleFlag">
            <a-radio-button :value="0">
              是
            </a-radio-button>
            <a-radio-button :value="1">
              否
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="安装车辆" name="workSheetDeviceVo">
          <VehGroupSelect :disabled="getVehGroupSelectDisabled" :isDbclick="false" v-model:value="workSheetDeviceVo" />
        </a-form-item>
      </div>
      <div class="row remark">
        <a-form-item ref="name" label="安装地址" name="address" required>
          <a-textarea
            v-model:value="form.address"
            placeholder=""
            :disabled="formDisabled"
          />
        </a-form-item>
      </div>
      <div class="row remark">
        <a-form-item ref="name" label=" 备注信息" name="remark" required>
          <a-textarea
            v-model:value="form.remark"
            placeholder=""
            :disabled="formDisabled"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,reactive, toRefs,watch,computed,PropType} from "vue";
import { VehGroupSelect } from "@/components/VehGroup/index";
import { ElMessage } from "element-plus";
import API from "@/api/manageData";
import dayJs from "dayjs";
interface carWorkSheetItem {
  id: number,
  carOwner: string,
  phone: string,
  installWorker: any,
  installTime: string,
  vehicleFlag: number,
  workSheetDeviceVo: any,
  address: string,
  remark: string,
}
export default defineComponent({
  name: "carWorkSheetModal",
  components: {
    VehGroupSelect
  },
  props: {
    type: {
      type: String,
      default:''
    },
    dataItem: {
      type: [Object] as PropType<carWorkSheetItem>,
      default : {
        id: 0,
        carOwner: '',
        phone: '',
        installWorker: 0,
        installTime: '',
        vehicleFlag: 1,
        workSheetDeviceVo: null,
        address: '',
        remark: '',
      }
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      carWorkSheetConfirmLoading: false,                    // 提交loading
      title: '新建工单',                                     // 窗口loading
      form: <any>null,                                      // FORM表单
      rules: {                                              // 验证规则
        installWorker: [{ type:'number', required: true, message: '请选择安装人员', trigger: 'change' }],
        remark: [{ required: true, message: '请备注设备信息（设备名称，设备号）',  trigger: 'blur' }],
        address: [{ required: true, message: '请输入安装地址',  trigger: 'blur' }],
        phone: [{ type:'string', required: true, message: '请输入正确的手机号',  trigger: 'blur' }],
        installTime: [{ type:'date', required: true, message: '请选择安装时间', trigger: 'change' }]
      },
      workSheetDeviceVo: null,                              // 选择设备    
      deviceList: <any>[],                                  // 安装设备列表
      formDisabled:false,                                   // 是否禁用
      installWorkerList: <any>[],                           // 安装人员
      ruleForm: null as any                                 // 验证REF
    });

    // 初始化表单数据
    const initForm = () => {
      data.form = {
        carOwner: '',                                       // 车主姓名
        phone: '',                                          // 联系电话
        installWorker:  null,                               // 安装人员
        installTime: '',                                    // 预安装时间
        vehicleFlag: 1,                                     // 是否安装设备
        id: 0,                                              // 工单ID
        devices: '',                                        // 设备列表ID
        address: '',                                        // 安装地址
        remark: '',                                         // 备注信息
      };
    }
    initForm();

    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    watch(() => props.visible,(value)=>{
      if(!value) return;
      data.title = props.type === 'add' ? '新建工单' : props.type==='edit'? '修改工单' : '查看工单';
      data.deviceList = [];
      data.formDisabled = false;
      // 初始化表单数据
      initForm();
      if(props.type !== 'add'){
        data.form.id = props.dataItem.id;
        data.form.carOwner = props.dataItem.carOwner;
        data.form.address = props.dataItem.address;
        data.form.remark = props.dataItem.remark;
        data.form.phone = props.dataItem.phone;
        data.form.installWorker = props.dataItem.installWorker;
        data.form.installTime = props.dataItem.installTime;
        data.form.vehicleFlag = props.dataItem.vehicleFlag;
        // 判断是否有安装设备列表
        if(props.dataItem.workSheetDeviceVo !== undefined &&  props.dataItem.workSheetDeviceVo.length !== 0){
          props.dataItem.workSheetDeviceVo.forEach((item:any) => {
            data.deviceList.push({
              plate:item.plate,
              vehicleId: parseInt(item.deviceId)
            });
          });
        }
      }
      // 判断查看类型  不能编辑
      if(props.type === 'show') data.formDisabled = true;
      // 获取安装人员列表
      getInstallWorker();
    });

    //提交功能
    const handleOk =  () =>{
      data.carWorkSheetConfirmLoading = true;
      // 判断是查看 则关闭窗口
      if(props.type === 'show'){
        emit("update:visible", false); return;
      }
      data.ruleForm.validate().then(async () => {
        data.form.devices = '';
        //判断是否有选择安装设备
        if(data.form.vehicleFlag  === 0){
          if(data.deviceList.length === 0){
            ElMessage.error("请选择安装设备"); return;
          }
          data.deviceList.forEach((item:any)=>{
            data.form.devices += item.vehicleId + ','
          });
        }

        try{
          // 判断 是否添加类型
          if(props.type === 'add'){
            const { msg,flag } = await API.saveWorkSheet(data.form);
            if(flag !== 1) throw msg;
            ElMessage.success('添加成功');
          }else{
            const { msg,flag } = await API.updateWorkSheet(data.form);
            if(flag !== 1) throw msg;
            ElMessage.success('更新成功');
          }
          emit('workSheetHandOk',props.type);
          emit("update:visible", false);
        }catch(error){
          ElMessage.error(error);
        }
      });
      data.carWorkSheetConfirmLoading = false;
    }

    //返回功能
    const handleBack = () => {
      emit("update:visible", false);
    }

    //获取安装人员列表
    const getInstallWorker = async () => {
      try {
        data.installWorkerList = [];
        const { obj,flag,msg } = await API.pageInstallWorker();
        if(flag !== 1) throw msg;
        // 过滤离职人员
        data.installWorkerList = obj.filter((item)=>{ return item.flag === 1 });
      } catch (error) {
        ElMessage.error(error);
      }
    }

    //判断选择车组 组件是否可用
    const getVehGroupSelectDisabled = computed(() => {
      if(data.formDisabled === true) return true;
      // 判断  是否安装设备  否 清空安装设备 
      if(data.form.vehicleFlag === 1) data.deviceList = [];
      data.workSheetDeviceVo = null;
      return data.form.vehicleFlag == 0 ? false : true
    });

    //删除安装设备
    const closeDeviceList = (index:number) => {
      // 查看功能 无法删除
      if(props.type === 'show') return;
      data.deviceList.splice(index,1);
    }

    // 监听选择车辆
    watch(()=>data.workSheetDeviceVo,(value:any)=>{
      if(!value) return;
      // 判断车辆是否过期
      if(value.EP !== undefined){
        ElMessage.error("设备已过期");return;
      }
      // 判断当前选择车辆或设备是否已经存在
      const checkDev = data.deviceList.find((item:any)=>{
        if(item.vehicleId === value.vehicleId) return true;
      });
      if(checkDev === undefined){
        data.deviceList.push({
          plate:value.plate,
          vehicleId: value.vehicleId
        });
      }
    });
    
    // 日期格式化
    const installTimeBlur = () => {
      data.form.installTime = dayJs(data.form.installTime).format('YYYY-MM-DD HH:mm:ss');
    }
    return {
      installTimeBlur,
      handleOk,
      handleBack,
      closeDeviceList,
      show,
      getVehGroupSelectDisabled,
      ...toRefs(data),
      ...toRefs(props)
    };
  },
});
</script>
<style lang="less">
.carWorkSheetModal {
  .row{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    input{
      width: 248px;
    }
    .ant-form-item-children{
      display: flex;
      flex-wrap: wrap;
    }
    .ant-row{
      flex:1;
      .ant-form-item-label label{
        display: inline-block;
        width: 100px;
        color:#333333;
      }
      .ant-form-item-control-wrapper{
        flex:1;
      }
    }
  }
  .remark { 
    .ant-form-item{
      width: 100%;
    }
    textarea{
      width: 600px;
    }
  }
  .deviceTag{
    cursor: pointer;
    background-color: rgba(64,158,255,.1);
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    margin-right:5px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #409eff;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64,158,255,.2);
    white-space: nowrap;
  }
}
</style>