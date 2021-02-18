import { reactive,ref } from "vue";
import { message,Modal  } from 'ant-design-vue';  
import { ElMessage } from "element-plus";
import API from "@/api/manageData";
const tableHead = [
  { align: 'center', title: '创建时间',dataIndex: 'createTime',width: 165 },
  { align: 'center', title: '预安装时间',dataIndex: 'installTime',width: 165 },
  { align: 'center', title: '确认时间',dataIndex: 'confirmTime',width: 165 },
  { align: 'center', title: '工单状态',dataIndex: 'status',width: 90},
  { align: 'center', title: '安装人员',dataIndex: 'installWorkerName',width: 150 },
  { align: 'center', title: '车主',dataIndex: 'carOwner',width: 90 },
  { align: 'center', title: '车辆列表',dataIndex: 'carList',width: 210},
  { align: 'center', title: '安装位置',dataIndex: 'installPosition',width: 90},
  { align: 'center', title: '安装地点',dataIndex: 'address',width: 100 },
  { align: 'center', title: '设备号',dataIndex: 'terminalNo',width: 200},
  { align: 'center', title: '上传安装信息时间',dataIndex: 'installedTime',width: 165 },
  { align: 'center', title: '取消时间',dataIndex: 'cancelTime',width: 165 },
  { align: 'center', title: '完成时间',dataIndex: 'finishTime',width: 165 },
  { align: 'center', title: '备注',dataIndex: 'remark',width: 160 },
];

// 不同的标签页对应不同的表格头
const headerArray:any = {
  0: [0,1,2,10,11,12,3,4,5,6,7,8,9,13],
  1: [0,1,3,4,5,6,8,9,13],
  2: [0,1,2,3,4,5,6,8,9,13],
  3: [0,1,2,10,3,4,5,6,8,9,13],
  4: [0,1,2,10,12,3,4,5,6,7,8,9,13],
  5: [0,1,11,3,4,5,6,9,13],
};

const parament = reactive({
  tabsItem: [
    { title: '全部',value: 0 },
    { title: '待确认',value: 1 },
    { title: '待安装',value: 2 },
    { title: '已安装',value: 3 },
    { title: '已完成',value: 4 },
    { title: '已取消',value: 5 },
  ],
  searchTypeOption: [
    { label: '全部',value: 0 },
    { label: '车主名称',value: 1 },
    { label: '安装人员',value: 2 },
    { label: '车牌号',value: 3 },
    { label: '设备号',value: 4 },
  ],
  tableHead,
  headerArray
});

// 获取状态对应的文案和class
const getStatusStr = (status:number, type:string) => {
  let typeStr = '';
  let titleStr = '';
  switch (status) {
    case 1:
      typeStr = 'warning';
      titleStr = '待确认';
      break;
    case 2:
      typeStr = 'error';
      titleStr = '待安装';
      break;
    case 3:
      typeStr =  'processing';
      titleStr = '已安装';
      break;
    case 4:
      typeStr = 'success';
      titleStr = '已完成';
      break;
    case 5:
      typeStr = 'default';
      titleStr = '已取消';
      break;
    case 6:
        typeStr = 'default';
        titleStr = '其他';
        break;
  }
  if(type === 'tag'){
    return typeStr;
  }
  return titleStr;
}

//完成和取消工单
const changestatusWorkSheet = async (status:number,id:number) => {
  try {
    const {flag,msg} = await API.updateWorkSheetStatus({id,status});
    if(flag !== 1){
      throw msg;
    }
    if(status === 5) ElMessage.success('取消成功');
    if(status === 4) ElMessage.success('完成成功');
  } catch (error) {
    ElMessage.error(error);
  }
}

//删除工单
const deleteWorkSheet = async (selectedRowKeys:any) => {
  let ids = '';
  selectedRowKeys.forEach((item:any)=>{
    ids += item.id + ',';
  });
  ids = ids.substring(0,ids.length-1);
  try {
    const {flag,msg} = await API.deleteWorkSheet({ids});
    if(flag !== 1){
      throw msg;
    }
    ElMessage.success('删除成功');
  } catch (error) {
    ElMessage.error(error);
  }
}

export {
  deleteWorkSheet,
  changestatusWorkSheet,
  getStatusStr,
  parament
};