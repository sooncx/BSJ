import { reactive } from "vue";
const data = reactive({
  search:{ roleName: '',status: 0 },
  tableData : <any>[],      //表格数据
  pagination :{             // 分页配置
    showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
    showSizeChanger: true,  // 是否允许选中 指定数量
    pageSize: 40,           // 分页数量
    total: 0,
    current:1,
    pageSizeOptions: ['40','60','80','100'], //指定数量
  },
  statusOptions: [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '使用'
    },
    {
      value: 2,
      label: '冻结'
    },
  ],
  modalVisible: false,
  modalData: null,
  tableLoading:false,
});

const exportData = () => {

}
const showData = (record:any) => {
  data.modalVisible = true,
  data.modalData = record;
}

export {
  data,
  exportData,
  showData,
};