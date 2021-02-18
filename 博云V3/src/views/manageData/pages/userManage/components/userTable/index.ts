import { reactive } from "vue";
import API from "@/api/manageData";
import { Modal  } from 'ant-design-vue';
import { useInit } from '@/hooks/web/useInit';
import { ElMessage } from 'element-plus';
const data = reactive({
  tableData : <any>[],      //表格数据
  addUserVisible: false,    // 显示添加用户弹层
  addUserType: '',
  addUserItem: null,
  pagination :{             // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,  // 是否允许选中 指定数量
    pageSize: 30,           // 分页数量
    total: 0,
    current: 1,
    pageSizeOptions: ['10','20','30','40'], //指定数量
  },
  totalNum: 0,
  onlineNum: 0,
  carGroupBindModalVisible: false,
  selectUserId: <null | number>null,
  tableLoading: false,
  offNum: 0,
  userId: 0,  //树选择用户id
  stateUserId: 0, //当前登录用户id
});

const getData = async () => {
  if(data.userId === 0){
    return false;
  }
  data.tableLoading = true;
  try {
    const { obj,flag,msg } = await API.pageUser({
      userId:data.userId,
      type:0,
      pageNumber: data.pagination.current,
      pageSize: data.pagination.pageSize
    });
    if(flag !== 1){
      throw msg;
    }
    data.tableData = obj.data;
    data.pagination.total = obj.total;
  } catch (error) {
    ElMessage.error(error);
  }
  data.tableLoading = false;
}

const getUserVehicleCount = async () => {
  const { obj } = await API.getUserVehicleCount({});
  data.totalNum = obj.data.totalNum;
  data.onlineNum = obj.data.onlineNum;
  data.offNum = obj.data.offlineNum;
}
//绑车
const bindCar = async (item:any) => {
  data.selectUserId = item.userId
  data.carGroupBindModalVisible = true;
}
//新增用户
const addUser = (type:string,item:any=null) => {
  data.addUserVisible = true;
  data.addUserType = type;
  if(type === 'add'){
    data.selectUserId = 0;
  }else{
    data.selectUserId = item.userId
  }
}

const InitUse = useInit();
//延迟获取数据
const TimeGetData = () => {
  setTimeout(()=>{
    getData() // 获取用户表格列表数据
    InitUse.getUserAllData(); // 重新获取用户树列表数据 放入缓存
  },500);
}
    
//重置密码
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
        if(flag !== 1){
          throw msg;
        }
        ElMessage.success('重置成功');
        TimeGetData();
      } catch (error) {
        ElMessage.error(error);
      }
    }
  });
}

//提示有子用户删除
const resDeleteUser = (userId:any) => {
  Modal.confirm({
    title: '删除人员',
    content: '重要提示：该用户下还有子用户,是否继续删除该用户？',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const {flag,msg} = await API.deleteClientUser({userId,type:1});
        if(flag !== 1){
          throw msg;
        }
        ElMessage.success('删除成功');
        TimeGetData();
      } catch (error) {
        ElMessage.error(error);
      }
    }
  });
}
//删除用户
const deleteUser = (item:any) => {
  Modal.confirm({
    title: '删除人员',
    content: '重要提示：帐号被删时，该帐号下的加车币，钻石将返回上一级账号！',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const { flag,msg } = await API.deleteClientUser({userId:item.userId,type:0});
        if(flag == -1){
          throw msg;
        }
        if(flag === 16005){
          resDeleteUser(item.userId);
        }else{
          ElMessage.success('删除成功');
          TimeGetData();
        }
      } catch (error) {
        ElMessage.error(error);
      }
    }
  });
}

//用户绑定车组
const carGroupBindHandleOk = async (item:any) => {
  let gvids = [] as any;
  item.forEach((item:any)=>{
    gvids.push(item.gi);
  });
  try {
    const {flag,msg} = await API.bindUserGroup({userId:data.selectUserId,groupIds:gvids.join(",")});
    if(flag !== 1){
      throw msg;
    }
    ElMessage.success('绑定成功');
  } catch (error) {
    ElMessage.error(error);
  }
}
//添加子用户成功
const addUserModalHandleOk = () => {
  TimeGetData();
}

//分页
const currentChange = (page: number, pageSize: number) => {
  data.pagination.current = page;
  data.pagination.pageSize = pageSize;
  getData();
};


// 导出数据
const onExport = () =>{
  if(data.userId){
    API.exportUser({userId:data.userId});
  }else{
    ElMessage.error('请选择用户组');
  }
}


export { 
  data,
  getUserVehicleCount,
  onExport,
  bindCar, 
  addUserModalHandleOk,
  currentChange,
  carGroupBindHandleOk,
  TimeGetData,
  deleteUser,
  resPassword,
  resDeleteUser,
  getData,
  addUser,
};