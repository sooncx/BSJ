import { reactive,ref } from "vue";
import API from "@/api/manageData";
import vehGroupType  from "@/components/VehGroup/src/type";
import { ElMessage } from "element-plus";


const data = reactive({
  search: {
    VehGroup : <vehGroupType>{}
  },
  tableData : <any>[],      //表格数据
  pagination :{             // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,  // 是否允许选中 指定数量
    pageSize: 40,           // 分页数量
    total: 0,
    current:1,
    pageSizeOptions: ['40','60','80','100'], //指定数量
  },
  carSettleListModalVisible: false,
  tableLoading: false,
  headerAppend: {
    title:'结清数：',
    value: 0,
    icon: 'icon-wanjie',
  },
  vehicleId:0,
});


const getData = async () => {
  data.tableLoading = true;
  data.tableData = [];
  const info = {
    pageNumber: data.pagination.current,
    pageSize: data.pagination.pageSize,
    vehicleId: <number | string>'',
    groupId: <number | string>'',
  };
  if(data.search.VehGroup && data.search.VehGroup.flag !== undefined){
    info.groupId = data.search.VehGroup.groupId;
    if(data.search.VehGroup.flag == 1){
      info.vehicleId = data.search.VehGroup.vehicleId;
      info.groupId = 0;
    }
  }
  try {
    // 车辆模糊匹配
    const { obj,flag,msg } = await API.pageSettleList(info);
    if(flag !== 1){
      throw msg;
    }
    data.tableData = obj.data;
    data.pagination.total = obj.total;
    data.headerAppend.value = data.pagination.total;
  } catch (error) {
    ElMessage.error(error);
  }
  data.tableLoading = false;
}
const currentChange = (page: number, pageSize: number) => {
  data.pagination.current = page;
  data.pagination.pageSize = pageSize;
  getData();
};

const onExport = () => {
  const info = {
    vehicleId: <any>'',
    groupId: <any>'',
  }
  if(data.search.VehGroup && data.search.VehGroup.flag !== undefined){
    info.groupId = data.search.VehGroup.groupId;
    if(data.search.VehGroup.flag == 1){
      info.vehicleId = data.search.VehGroup.vehicleId;
      info.groupId = 0;
    }
  }
  API.exportSettleList(info);
}

const back = (item:any) => {
  data.vehicleId = item.vehicleId;
  data.carSettleListModalVisible = true;
}

const onSearch = () => {
  data.pagination.current = 1;
  getData();
}

export { 
  data,
  onSearch,
  onExport,
  getData,
  back,
  currentChange,
};