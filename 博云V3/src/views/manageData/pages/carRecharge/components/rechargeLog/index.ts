import { reactive } from "vue";
import dayJs from "dayjs";
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
const data = reactive({
  search: {
    pageNumber: 0,
    pageSize: 0,
    startTime: '',                                  // 开始时间
    endTime: '',                                    // 结束时间
    vid: <string | number>'',                       // 车辆ID
  },
  fuzzyValue: <any>{},                              // 车辆搜索
  tableData : <any>[],                              // 表格数据
  pagination :{                                     // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,                          // 是否允许选中 指定数量
    pageSize: 40,                                   // 分页数量
    total: 0,
    current:1,
    pageSizeOptions: ['40','60','80','100'],        // 指定数量
  },
  rangeDate: [                                      // 选择日期默认日期
    dayJs(new Date().getTime() - 3600 * 1000 * 24 * 31).format(
      "YYYY-MM-DD 00:00:00"
    ),
    dayJs(new Date()).format("YYYY-MM-DD 23:59:59"),
  ],
  expireTimeOptions:[                               // 即将到期
    { value: 3,title: '近三天' },
    { value: 7,title: '近七天' },
    { value: 31,title: '近一个月',}
  ],
  tableLoading: false,
  moneyAll: 0,                                      // 消耗车币总数
  plateCount: 0,                                    // 续费车辆总数
});

// 搜索功能
const onSearch = () => {
  data.pagination.current = 1;
  getData();
}

// 获取数据
const getData = async () => {
  data.tableLoading = true;
  data.tableData = [];
  data.search.pageNumber = data.pagination.current;
  data.search.startTime = data.rangeDate[0];
  data.search.endTime = data.rangeDate[1];
  data.search.pageSize = data.pagination.pageSize;
  data.search.vid ='';
  if(data.fuzzyValue){
    data.search.vid = data.fuzzyValue.vehicleId;
  }
  try {
    const { obj,flag,msg } = await API.pageVehicleFreeLog(data.search);
    if(flag !== 1){
      throw msg
    }
    data.tableData = obj.data.list ? obj.data.list : [];
    data.pagination.total = obj.total ? obj.total : 0;
    data.moneyAll = obj.data.moneyAll ? obj.data.moneyAll : 0;
    data.plateCount = obj.data.plateCount ? obj.data.plateCount : 0;
  } catch (error) {
    ElMessage.error(error);
  }
  data.tableLoading = false;
}

// 分页功能
const currentChange = (page: number, pageSize: number) => {
  data.pagination.current = page;
  data.pagination.pageSize = pageSize;
  getData();
};

// 选择即将到期时间
const onExpireTime = (day:number) => {
  data.rangeDate[0] = dayJs(new Date().getTime() - 3600 * 1000 * 24 * day).format(
    "YYYY-MM-DD 00:00:00"
  );
  data.search.startTime = data.rangeDate[0];
  getData();
}
export { 
  data,
  getData,
  onExpireTime,
  onSearch,
  currentChange,
};