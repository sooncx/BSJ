import { reactive } from "vue";
import { message,Modal  } from 'ant-design-vue';
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
const data = reactive({
  activeTabIndex: 0,
  search:{ 
    name: '',
    pageSize: 40,
    pageNumber: 1,
    startTime: '',
    endTime: '',
  },
  rangeDate: [
    '',
    '',
  ],
  tableData : <any>[],      //表格数据
  pagination :{             // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,  // 是否允许选中 指定数量
    pageSize: 40,           // 分页数量
    total: 0,
    current:1,
    pageSizeOptions: ['40','60','80','100'], //指定数量
  },
  modalVisible: false,
  modalType: '',
  modalItem: null,
  form: {
    name: '',
    phone: '',
    username: '',
    password: '',
    remark: '',
  },
  selectItemKey: <any>[],
  tableLoading: false,
});

const getData = async () => {
  data.tableLoading = true;
  data.tableData = [];
  try {
    //判断是否有搜索条件
    data.search.pageSize = data.pagination.pageSize;
    data.search.pageNumber = data.pagination.current;
    data.search.startTime = data.rangeDate[0];
    data.search.endTime = data.rangeDate[1];
    const { obj,flag,msg } = await API.pageInstallWorkerListByCondition(data.search);
    if(flag !== 1){
      throw msg;
    }
    data.pagination.total = obj.total;
    data.tableData = obj.data;
  } catch (error) {
    ElMessage.error(error);
  }
  data.tableLoading = false;
}

const onSearch = () => {
  data.pagination.current = 1;
  getData();
}

const installWorkerHandOk = () => {
  ElMessage.success('添加/修改成功');
  getData();
}

const currentChange = (page: number, pageSize: number) => {
  data.pagination.current = page;
  data.pagination.pageSize = pageSize;
  getData();
};

const handleSelectionChange = (item:Array<Object>) => {
  data.selectItemKey = item;
}

const deleteData = (record:any) => {
  if(record === null){
    //判断是否选择表格
    if(data.selectItemKey.length === 0){
        message.warning('请在表格中选择需要删除的安装人员');
        return false;
    }
  }
  Modal.confirm({
    title: '删除人员',
    content: '是否删除该安装人员（该操作不可逆）？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      if(record === null){
        deleteInstallWorkers();
      }else{
        deleteInstallWorker(record);
      }
      setTimeout(()=>{
        getData()
      },500);
    }
  });
}
//批量删除功能
const deleteInstallWorkers = async () => {
  let userIds = '';
  data.selectItemKey.forEach((item:any)=>{
    userIds += item.userId + ','
  });
  try {
    const { flag,msg } = await API.deleteInstallWorkers({userIds:userIds.substring(0,userIds.length-1)});
    if(flag !== 1){
      throw msg;
    }
    ElMessage.success('删除成功');
    getData();
  } catch (error) {
    ElMessage.error(error);
  }
}
//单独删除功能
const deleteInstallWorker = async (item:any) => {
  try {
    const { flag,msg } = await API.deleteInstallWorker({userId:item.userId});
    if(flag !== 1){
      throw msg;
    }
    ElMessage.success('删除成功');
    getData();
  } catch (error) {
    ElMessage.error(error);
  }
}
const showData = (record:any, type:string) => {
  data.modalVisible = true,
  data.modalType = type;
  data.modalItem = record;
}

export {
  data,
  deleteData,
  showData,
  installWorkerHandOk,
  currentChange,
  onSearch,
  getData,
  handleSelectionChange
};