import { reactive } from "vue";
import dayJs from "dayjs";
import { message,Modal } from 'ant-design-vue';
import API from "@/api/manageData";
import { getgvids } from "@/views/manageData/module/src/function";
import { ElMessage } from 'element-plus';
const data = reactive({
  renewOptions: [                             // 续费选择值
    { value: 0,label: '续费' },
    { value: 1,label: '不续费' }
  ],
  statusOptions: [                            // 车辆状态选择值
    { value: '',label: '全部' },
    { value: 1,label: '已过期' },
    { value: 0,label: '正常' }
  ],
  carStatusOptions: [                         // 车辆运动状态选择值
    { value: '',label: '全部' },
    { value: '静止',label: '静止' },
    { value: '行驶',label: '行驶' },
    { value: '离线',label: '离线' },
    { value: '从未上线',label: '从未上线' }
  ],
  renewYearOptions:[                          // 续费年限选择值
    { value: 0,title: '未选择' },
    { value: 1,title: '1年' },
    { value: 2,title: '2年' },
    { value: 3,title: '3年' },
    { value: 4,title: '4年' },
    { value: 5,title: '5年' },
  ],
  expireTimeOptions:[                         // 过期时间选择值
    { value: 3,title: '近三天' },
    { value: 7,title: '近七天' },
    { value: 31,title: '近一个月' }
  ],
  installDate: <any>[],                       // 安装时间
  activationTime: [],                         // 激活时间
  VehGroup: <any>{},                          // 车辆车组搜索值
  highSearch: true,                           // 高级搜索显示切换值
  renew: 0,                                   // 续费值
  activeVisible: true,                        // 表格操作列是否显示
  search: {
    offlineTimeBegin: <number | string>0,     // 离线时间开始
    offlineTimeEnd: <number | string>0,       // 离线时间结束
    isState: <number | string>'',             // 车辆状态
    vehicleState: '',                         // 车辆行驶状态
    installDateStart: '',                     // 安装时间开始
    installDateEnd: '',                       // 安装时间结束
    groupId: <number | string>'',             // 车组ID
    vehicleId: <number | string>'',           // 车辆ID
    activationTmeStart: '',                   // 激活时间开始
    activationTmeEnd: '',                     // 激活时间结束
    displayYear: 0,                           // 续费年限值
    expireTime: 2678400,                      // 过期时间
    pageNumber: 0,
    pageSize: 0,
  },
  tableData : <any>[],                        // 表格数据
  pagination :{                               // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,                    // 是否允许选中 指定数量
    pageSize: 40,                             // 分页数量
    total: 0,
    current:1,
    pageSizeOptions: ['40','60','80','100'],  // 指定数量
  },
  tableLoading:false,
  customNoRechargeVisible: false,             // 自定义不续费 自定义转出 显示状态
  customNoRechargeConfirmLoading: false,      
  carRechargeModelVisible: false,             // 续费窗口 显示状态
  selectTableItem:<any>[],                    // 表格选中数据
  carRechargeNumber: 1,                       // 续费数量
  customNoRechargeType: 0,                    // 自定义类型 不续费或转出
  customNoRechargeOkRes: {                    // 自定义不续费 自定义转出 回调内容
    noPermission:[],                          // 无权限
    nonexistent: [],                          // 无设备
    success:[]                                // 成功
  },
  carCustomNoRechargeOkVisible:false,         // 自定义不续费 自定义转出 回调显示窗口
});

// 获取数据
const getData = async () => {
  data.tableLoading = true;
  data.tableData = [];
  data.search.pageNumber = data.pagination.current;
  data.search.pageSize = data.pagination.pageSize;
  try {
    const { obj,msg,flag } = await API.pageVehicleExpire(data.search);
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

// 选择即将到期时间
const onExpireTime = (day:number) => {
  data.search.expireTime = day * 86400;
  onSearch();
}

// 分页功能
const currentChange = (page: number, pageSize: number) => {
  data.pagination.current = page;
  data.pagination.pageSize = pageSize;
  getData();
};


let select:Array<Object> = [];
// 多选功能
const handleSelectionChange = (item: any) => {
  select = item;
}

// 批量续费
const batchRecharge = () => {
  if(select.length === 0){
    message.warning('请选择车辆');
    return false;
  }
  data.carRechargeModelVisible = true;
  data.carRechargeNumber = select.length;
  data.selectTableItem = [];
  select.forEach((item:any) => {
    data.selectTableItem.push({
      NOW: item.NOW,
      terminalNo: item.terminalNo
    });
  })
}
// 批量转入不续费
const batchIntoNoRecharge = () => {
  if(select.length === 0){
    ElMessage.error('请选择车辆');
    return false;
  }
  Modal.confirm({
    title: '批量转入不续费',
    content: `确定将选中的${select.length}辆车加入不续费列表？`,
    async onOk() {
      const info = {
        isState: 2,
        gvids: getgvids(select)
      };
      try {
        const { flag,msg } = await API.batchVehicleStateRecharge(info);
        if(flag !== 1){
          throw msg;
        }
        ElMessage.success('操作成功');
        getData();
      } catch (error) {
        ElMessage.error(error);
      }
    }
  });
}
// 自定义不续费
const customNoRecharge = (type:number) => {
  data.customNoRechargeType = type;
  data.customNoRechargeVisible = true;
}
// 单个续费
const carRecharge = (item:any) => {
  data.carRechargeModelVisible = true;
  data.carRechargeNumber = 0;
  data.selectTableItem = [];
  data.selectTableItem.push({
    expireTime: item.expireDate,
    plate: item.plate,
    NOW: item.NOW,
    groupId: item.groupId,
    vehicleId: item.vehicleId
  });
}

// 时间格式化
const getDayJs = (date:any) => {
  return dayJs(date).format("YYYY-MM-DD HH:mm:ss");
}
// 搜索 或 导出
const onSearch = (type:string='search') => {
  data.search.installDateStart = '';
  data.search.installDateEnd = '';
  data.search.activationTmeStart = '';
  data.search.activationTmeEnd = '';
  data.search.vehicleId = '';
  data.search.groupId = '';
  data.search.offlineTimeBegin = 0;
  data.search.offlineTimeEnd = 0;
  if(data.installDate[0]) data.search.installDateStart = getDayJs(data.installDate[0]);
  if(data.installDate[1]) data.search.installDateEnd = getDayJs(data.installDate[1]);
  if(data.activationTime[0]) data.search.activationTmeStart = getDayJs(data.activationTime[0]);
  if(data.activationTime[1]) data.search.activationTmeEnd = getDayJs(data.activationTime[1]);
  if(data.VehGroup && data.VehGroup.flag !== undefined){
    if(data.VehGroup.flag == 1){
      data.search.vehicleId = data.VehGroup.vehicleId;
      data.search.groupId = data.VehGroup.groupId;
    }else{
      data.search.groupId = data.VehGroup.groupId;
      data.search.vehicleId = '';
    }
  }
  try {
    if(data.search.offlineTimeBegin || data.search.offlineTimeEnd){
      if(!data.search.offlineTimeBegin) throw '离线开始时间不能为空';
      if(!data.search.offlineTimeEnd) throw '离线结束时间不能为空';
      if(data.search.offlineTimeBegin > data.search.offlineTimeEnd) throw '开始时间不能大于结束时间！！';
      if(data.search.offlineTimeEnd > 999) throw '离线结束时间不能大于999';
    }
  } catch (error) {
    ElMessage.error(error);return false;
  }

  // 不续费
  if(data.renew === 1){
    data.activeVisible = false;
    data.pagination.total = 0;
    data.tableData = [];
  }
  // 导出
  if(type === 'export'){
    API.exportVehicleExpire({...data.search});
    return false;
  }
  data.pagination.current = 1;
  getData();
}
// 续费类型选择事件
const onRenew = (item:number) => {
  if(item === 1){
    data.search.isState  = '2';
  }else{
    data.search.isState  =  '';
  }
}

// 自定义续费提交成功返回值
const customNoRechargeOk = (obj: any) => {
  data.customNoRechargeOkRes = obj;
  getData();
  data.carCustomNoRechargeOkVisible = true;
}

//自定义 不续费或转出 回调
const customBatchRechargeOk = (item:any) => {
  let ids = item.split(',');
  data.carRechargeModelVisible = true;
  data.selectTableItem = [];
  ids.forEach((value:any) => {
    if(value){
      data.selectTableItem.push({
        terminalNo: value
      });
    }
  });
  data.carRechargeNumber = data.selectTableItem.length;
}

// 返回状态字符串
const getStatusStr = (status:number) => {
  return status === 1 ? '已过期' : status === 0 ? '正常'  : '不续费';
}

export {
  getStatusStr,
  customBatchRechargeOk,
  onSearch,
  customNoRechargeOk,
  onRenew,
  carRecharge,
  getData,
  customNoRecharge,
  batchRecharge,
  handleSelectionChange,
  data,
  onExpireTime,
  currentChange,
  batchIntoNoRecharge
};