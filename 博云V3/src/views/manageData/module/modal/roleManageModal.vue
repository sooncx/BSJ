<template>
  <a-modal v-model:visible="show" :title="title" width="750px" @ok="handleOk" :maskClosable="false">
    <template #footer>
      <a-button key="back" @click="handleback">
        返回
      </a-button>
      <a-button key="submit" type="primary" :loading="modalLoading" @click="handleOk">
        提交
      </a-button>
    </template>
    <div class="modalBody">
      <!-- 表单 -->
      <div class="modalBody__left">
        <a-form :model=form :rules="rules" ref="ruleForm" class="modalForm" >
          <div class="row">
          <a-form-item ref="name" label="角色名称" name="roleName">
            <a-input v-model:value="form.roleName" />
          </a-form-item>
        </div>
          <div class="row remark">
            <a-form-item ref="name" label="备注信息" name="roleDesc">
              <a-textarea
                v-model:value="form.roleDesc"
                placeholder=""
              />
            </a-form-item>
          </div>
        </a-form>
      </div>
      <!-- 资源树 -->
      <div class="modalBody__right">
        <Tree
          checkable
          :tree-data="treeData"
          node-key="id"
          :replaceFields="{children:'children', title:'name', key:'id' }"
          @check="onCheck"
          v-model:checkedKeys="selecResource"
        ></Tree>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,reactive, toRefs,watch,PropType,computed} from "vue";
import API from "@/api/manageData";
import { Tree } from "ant-design-vue";
import { ElMessage } from 'element-plus';
export default defineComponent({
  components:{
    Tree,
  },
  name: "carSettleListModal",
  props: {
    // 角色数据
    roleInfo: {
      type: Object as PropType<any>,
      default: () => ({
        roleId: 0,
        roleName: '',
        roleDesc: '',
      }),
    },
    // 显示窗口状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      modalLoading: false,                        // 提交loading
      treeData: [],                               // 资源树 数据
      form: {                                     // 角色表单
        roleName: '',                             // 角色名字
        roleDesc: ''                              // 角色备足
      },
      rules: <any>{
        roleName: [{ required: true, message: '角色名称不能为空',  trigger: 'blur' }],
      },
      ruleForm: <any>null,                        // 表单REF
      selecResource: <any>[],                     // 选择资源树 数据
      title: '新增角色',                           // 窗口标题 
    });
    
    // 获取资源树 数据
    const getResourceTree = async () => {
      try {
        const { obj, msg, flag} = await API.resourceTree({});
        if(flag !== 1) throw msg;
        data.treeData = obj;
      } catch (error) {
        ElMessage.error(error);
      }
    }

    const show = computed({
      get: () => props.visible,
      set: (val) => {
        emit("update:visible", val);
      },
    });

    const getRoleInfo = async () => {
      try {
        const { obj,msg,flag } = await API.getRole({roleId: props.roleInfo.roleId});
        if(flag !== 1) throw msg;
        data.form.roleName = obj.roleName;
        data.form.roleDesc = obj.roleDesc;
        data.selecResource = obj.resourceIdList;
      } catch (error) {
        ElMessage.error(error);
      }
      
    }

    watch(
      () => props.visible,async (val) => {
        if (!val) return;
        data.form.roleName = '';
        data.form.roleDesc = '';
        data.selecResource = [];
        getResourceTree();
        if(props.roleInfo && props.roleInfo.roleId){
          data.title = '修改角色';
          // 获取数据
          getRoleInfo();
          return;
        }
        data.title = '新增角色';
      }
    );
    

    const handleOk = () =>{
      data.modalLoading = true;
      data.ruleForm.validate().then(async () => {
        try {
          //判断是否选择了资源
          if(data.selecResource.length === 0) throw '请选择资源';
          let info = {
            roleName: data.form.roleName,
            roleDesc: data.form.roleDesc,
            resourceIdList: data.selecResource
          }
          // 判断是否修改数据
          if(props.roleInfo && props.roleInfo.roleId){
            const { msg, flag } = await API.updateRole({...info,roleId:props.roleInfo.roleId});
            if(flag !== 1) throw msg;
            ElMessage.success('修改成功');
          }else{
            const { msg, flag } = await API.addRole(info);
            if(flag !== 1) throw msg;
            ElMessage.success('添加成功');
          }
          emit("update:visible", false);
          emit("roleManageHandleOk");
        } catch (error) {
          ElMessage.error(error);
        }
      });
      data.modalLoading = false;
    }
    // 返回
    const handleback = () => {
      emit("update:visible", false);
    }
    // 点击复选框返回数据
    const onCheck = (value:any) => {
      data.selecResource = value;
    }
    return {
      show,
      handleOk,
      handleback,
      onCheck,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.modalBody{
  display: flex;
  width: 100%;
  height: 400px;
  flex-wrap: wrap;
  justify-content: space-between;
  &__left{
    flex:1;
    .modalForm {
      .row{
        input,textarea{
          width: 248px;
        }
        .ant-form-item-label > label{
          color:#333333;
        }
      }
      .remark { 
        .ant-form-item{
          width: 100%;
        }
      }
    }
  }
  &__right{
    height: 100%;
    overflow: auto;
    flex:1;
    background-color: #F2F5F8;
  }
}
::v-deep(.ant-form-item-label > label){
  
  color:#333333;
}
</style>