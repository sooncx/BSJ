<template>
  <div class="userInfoModal">
    <a-modal 
      destroyOnClose
      :maskClosable="false"
      v-model:visible="show"
      width="750px"
      :title="title"
      @ok="handleOk">
      <div class="addUser">
        <a-form :model="form" ref="ruleForm" :rules="rules">
          <div class="row">
            <div class="item">
              <a-form-item ref="name" label="登录账户" name="name">
                <a-input v-model:value="form.name" />
              </a-form-item>
            </div>
            <div class="item">
              <a-form-item label="登录密码" name="password">
                <a-input v-if="type !== 'edit'" v-model:value="form.password" />
                <a-button v-else @click="resPassword(userId)" v-permission="160106">重置</a-button>
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <a-form-item label="客户名称" name="corpName">
                <a-input v-model:value="form.corpName" />
              </a-form-item>
            </div>
            <div class="item">
              <a-form-item label="账户类型" name="accountType">
                <a-select
                  v-model:value="form.accountType"
                  style="width: 216px"
                  ref="select"
                >
                  <a-select-option v-for="(item,index) in accountTypeOption" :value="item.value" :key="index">
                    {{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <a-form-item label="上级账户" name="parentName">
                <a-input :disabled="true" v-model:value="parentInfo" />
              </a-form-item>
            </div>
            <div class="item">
              <a-form-item label="联系电话" name="phone">
                <a-input v-model:value="form.phone" />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <a-form-item :style="{width: '100%'}" label="备注信息" name="remark">
              <a-input v-model:value="form.remark" />
            </a-form-item>
          </div>
          <!-- 车组绑定 -->
          <div class="row rowRemark" v-if="type !== 'edit'">
            <a-form-item :style="{width: '100%'}" label="绑定车组" name="bind">
              <div class="bindCar" v-if="bindGroupNum === 0">
                新账户请选中已有
                <span @click="carGroupBind">车组绑定</span>
                或
                <span @click="addCarGroup">新建车组</span>
              </div>
              <div class="bindCar" v-else>
                已绑定“{{bindGroupNum}}”个车组
                <span @click="carGroupBind">重新车组绑定</span>
              </div>
            </a-form-item>
          </div>
          <!-- 权限管理 -->
          <div class="row rowRole">
            <a-form-item :style="{width: '100%'}" label="用户权限" name="role" v-if="checkBoxShowAll && form.accountType !== 4">
              <a-checkbox v-if="checkCheckBox('checkOffOil')"  v-model:checked="form.checkOffOil">
                断油电/恢复油电
              </a-checkbox>
              <a-checkbox v-if="checkCheckBox('checkUser')" v-model:checked="form.checkUser">
                删除用户权限
              </a-checkbox>
              <a-checkbox v-if="checkCheckBox('checkGroup')" v-model:checked="form.checkGroup">
                删除车组权限
              </a-checkbox>
              <a-checkbox v-if="checkCheckBox('checkVehicle')" v-model:checked="form.checkVehicle">
                删除车辆权限
              </a-checkbox>
              <p>TIPS:更改删除用户权限、删除车组权限、删除车辆权限都会改变子级账号对应的权限</p>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </a-modal>
    <!-- 新建车组 -->
    <carGroupModal 
    v-model:visible="carGroupModalVisible" 
    carGroupModelType="add"
    @groupModalHandleOk="groupModalHandleOk"
    ></carGroupModal>
    <!-- 绑定车组 -->
    <carGroupBindModal
    v-model:visible="carGroupBindModalVisible"
    @handleOk="carGroupBindHandleOk"
    :selectedCheckedValue="selectedCheckedValue"
    ></carGroupBindModal>
  </div>
</template>
<script lang="ts">  
import { defineComponent, reactive, toRefs, PropType, watch, nextTick, computed } from "vue";
import { carGroupModal,carGroupBindModal } from "@/views/manageData/module/index";
import { UserSearch } from '@/components/UserSearch';
import API from "@/api/manageData";
import { Modal  } from 'ant-design-vue';  
import { ElMessage } from 'element-plus';
import store from "@/store/index";
export default defineComponent({
  components:{
    UserSearch,
    carGroupModal,
    carGroupBindModal,
  },
  props: {
    // 窗口类型 添加或修改
    type: {
      type: String,
      default: ''
    },
    // 选择用户ID
    userId: {
      type: Number,
      default: 0
    },
    // 显示状态
    visible: {
      type: Boolean as PropType<boolean>
    }
  },
  setup(props, {emit}) {
    // 判断是否选择车组 验证方法
    const checkBind = async () => {
      if(data.groupIds === '') return Promise.reject('请选择绑定车组');
      return Promise.resolve();
    };

    //  FORM表单初始化
    const initForm = () => {
      data.form = {
        name: '',                               // 登录账户
        password: '',                           // 登录密码
        corpName: '',                           // 客户名称
        accountType: 3,                         // 账户类型
        phone: '',                              // 联系电话
        parentId: <any>0,                       // 父类ID
        remark: '',                             // 备注信息
        checkOffOil: false,                     // 断油电/恢复油电  0 启动 1 禁用
        checkUser: false,                       // 删除用户权限     0 启动 1 禁用
        checkGroup: false,                      // 删除车组权限     0 启动 1 禁用
        checkVehicle: false,                    // 删除车辆权限     0 启动 1 禁用
      }
    }

    const data = reactive({
      carGroupModalVisible: false,              // 新建车组显示状态
      carGroupBindModalVisible: false,          // 绑定车组显示状态
      userId: 0,                                // 修改用户ID
      bindGroupNum:0,                           // 绑定车组数量
      groupIds: '',                             // 车组ID
      parentInfo: <any>null,                    // 父类信息
      form: <any>null,
      rules: <any>{
        name: [{ required: true, message: '登录账户不能为空',  trigger: 'blur' }],       // 登录账户验证规则 
        corpName: [{ required: true, message: '客户名称不能为空',  trigger: 'blur' }],   // 客户名称验证规则
        bind: [{ required: true, validator: checkBind, trigger: 'blur' }],             // 绑定车组验证规则
      },
      accountTypeOption:[                       // 账户类型选项值
        { value: 3,label: '我的客户'},
        { value: 4,label: '监控客户'},
      ],
      checkRole: [                              // 权限开关
        { title:'断油电/恢复油电',value: false },
        { title: '删除用户权限',value: false },
        { itle: '删除车组权限',value: false },
        { itle: '删除车辆权限',value: false },
      ],
      title: '',                                // 窗口显示标题
      ruleForm: null as any,                    // 验证FORM ref
      selectedCheckedValue: <any>[],            // 绑定车组回调值
      statusUSER: store.state.USER,             // 当前登录用户信息
      checkBoxShowAll: true                     // 是否显示用户权限状态
    });
    initForm();

    // 处理 用户权限值
    const submitCheck = () =>{
      // 判断如果是监控用户 默认全部权限不给
      if(data.form.accountType === 4){
        return {
          checkOffOil: 1,checkUser: 1,checkGroup: 1,checkVehicle: 1,
        }
      }
      return {
        checkOffOil: data.form.checkOffOil ? 0 : 1,
        checkUser: data.form.checkUser ? 0 : 1,
        checkGroup: data.form.checkGroup ? 0 : 1,
        checkVehicle: data.form.checkVehicle ? 0 : 1,
      }
    }

    // 判断当前用户权限 如果没有任何权限 就不显示权限栏
    if(store.state.USER.checkOffOil === 1 &&
       store.state.USER.checkUser === 1  && 
       store.state.USER.checkGroup === 1 &&
       store.state.USER.checkVehicle === 1){
      data.checkBoxShowAll = false;
    }
        
    // 重置密码
    const resPassword = async (userId:any) => {
      //先获取重置密码
      const { obj  } = await API.resetUserPassword({userId,type:0});
      Modal.confirm({
        title: '重置密码',
        content: '将该用户的密码重置为随机密码 '+ obj,
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const {flag, msg} = await API.resetUserPassword({userId,type:1});
            if(flag !== 1) throw msg;
            ElMessage.success('重置成功');
            emit("update:visible", false);
          } catch (error) {
            ElMessage.error(error);
          }
        }
      });
    }

    // 本身弹窗确认按钮
    async function handleOk(){
      data.ruleForm.validate().then(async () => {
        let checkData = submitCheck();
        let info = {
          checkOffOil: checkData.checkOffOil,
          checkUser: checkData.checkUser,
          checkGroup: checkData.checkGroup,
          checkVehicle: checkData.checkVehicle,
          name: data.form.name,
          corpName: data.form.corpName,
          accountType: data.form.accountType,
          phone: data.form.phone,
          remark: data.form.remark,
        };
        try {
          // 判断 是否修改用户信息
          if(props.type === 'edit'){
            const { flag,msg } = await API.updateClientUser( { ...info, userId:data.userId});
            if(flag !== 1) throw msg;
            ElMessage.success('修改成功');
          }else{
            const saveClientUser = { 
              groupIds:data.groupIds,
              password:data.form.password,
              parentId:data.form.parentId,
              ...info,
            };
            const { flag,msg } = await API.saveClientUser(saveClientUser);
            if(flag !== 1) throw msg;
            ElMessage.success('添加成功');
          }
          emit("addUserModalHandleOk");
          emit("update:visible", false);
        } catch (error) {
          ElMessage.error(error);
        }
      });
    }
    // 添加车组
    const addCarGroup = () => {
      data.carGroupModalVisible = true;
    }
    // 绑定车组
    const carGroupBind = () => {
      data.carGroupBindModalVisible = true;
    }
    // 监听显示功能
    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    // 绑定车组成功回调
    const carGroupBindHandleOk = (item:any)=>{
      data.selectedCheckedValue = item;
      data.bindGroupNum = item.length;
      if(data.bindGroupNum !== 0){
        let gids = [] as any;
        data.groupIds = '';
        item.forEach((item:any)=>{
          // 过滤父类
          if(item.gi !== -3){
            gids.push(item.gi);
          }
        });
        data.groupIds = gids.join(',');
      }
    }
    // 添加车组成功回调
    const groupModalHandleOk = (item:any) => {
      data.bindGroupNum = 1;
      data.selectedCheckedValue.push({
        gi:item.groupId,
        pi:item.parentId,
        gn:item.groupName,
      });
      data.groupIds = item.groupId;
    }
    // 获取数据
    const getData = async () => {
      try {
        let dataMsg,dataFlag,dataObj = <any>null;
        // 判断是添加下级 还是 新增用户
        if(data.userId === 0){
          const { obj,flag,msg } = await API.getUser({});
          dataMsg = msg; dataFlag = flag; dataObj = obj;
        }else{
          const { obj,flag,msg } = await API.getUser({userId:data.userId});
          dataMsg = msg; dataFlag = flag; dataObj = obj;
        }
        
        if(dataFlag !== 1) throw dataMsg;

        // 判断 新增用户父类显示当前登录用户   新增下级父类显示当前选中为值父类
        if(props.type !== 'edit'){
          data.parentInfo = dataObj.name;
          data.form.parentId = dataObj.userId;
          return;
        }
        data.parentInfo = dataObj.parentName;
        data.form.name = dataObj.name;
        data.form.corpName = dataObj.corpName;
        data.form.accountType = dataObj.accountType;
        data.form.phone = dataObj.phone;
        data.form.remark = dataObj.remark;
        data.form.checkOffOil = dataObj.checkOffOil === 0 ? true : false;
        data.form.checkUser = dataObj.checkUser === 0 ? true : false;
        data.form.checkGroup = dataObj.checkGroup === 0 ? true : false;
        data.form.checkVehicle = dataObj.checkVehicle === 0 ? true : false;
      } catch (error) {
         ElMessage.error(error);
      }
    }
    // 监听显示初始化
    watch(()=>props.visible,(value)=>{
      nextTick(()=>{
        if(value === false) return;
        data.title = props.type === 'add' ? '新增用户' : props.type === 'addParent' ? '新增下级' : '修改用户';
        data.bindGroupNum = 0;
        data.groupIds = '';
        data.parentInfo = '';
        data.groupIds = '';
        data.selectedCheckedValue = [];
        data.userId = props.userId;
        initForm();
        data.rules.password = [];
        if(props.type === 'add'){
          data.rules.password = [{ required: true, message: '登录密码不能为空',  trigger: 'blur' }];
        }
        getData();
      });
    });

    // 判断 当前登录用户 是否有 权限
    const checkCheckBox = (type:string) => {
      switch(type){
        case 'checkGroup':
          return data.statusUSER.checkGroup === 0;
        case 'checkOffOil':
          return data.statusUSER.checkOffOil === 0;
        case 'checkUser':
          return data.statusUSER.checkUser === 0;
        case 'checkVehicle':
          return data.statusUSER.checkVehicle === 0;
      }
    }
    return {
      checkCheckBox,
      resPassword,
      groupModalHandleOk,
      handleOk,
      addCarGroup,
      carGroupBind,
      show,
      carGroupBindHandleOk,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.addUser{
  .row{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    input{
      width: 216px;
    }
    .item{
      width: 50%;
    }
  }
  .rowRemark { 
    .ant-form-item-control-wrapper{
      width: 85%;
    }
    input{
      width: 100%;
    }
  }
  .bindCar{
    color:#999999;
    font-size:12px;
    height: 30px;
    span{
      display: inline-block;
      width: 90px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      margin:0 10px;
      border: 1px solid #0E60DB;
      background-color: #DBE9FF;
      color:#0E60DB;
      font-weight: 400;
    }
    span:active{
      border: 1px solid red;
    }
  }
  .rowRole{
    p{
      color:#999999;
      font-size:12px;
    }
    .ant-form-item-label{
      margin-right:35px;
    }
  }
}
::v-deep(.ant-form-item .ant-form-item-label){
  width: 85px;
  > label{
    color:#333;
  }
}
</style>
