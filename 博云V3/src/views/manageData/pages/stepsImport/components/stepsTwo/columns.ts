const columns = [
  {
    title: '序号',
    dataIndex: 'sum',
    width: '70px',
    align: 'left',
  },
  {
    title: '车牌号',
    dataIndex: 'plate',
    align: 'left',
    width: '120px',
    slots: { customRender: 'plate' },
  },
  {
    title: 'SIM卡号',
    dataIndex: 'sim',
    align: 'left',
    width: '120px',
    slots: { customRender: 'sim' },
  },
  {
    title: '设备号',
    dataIndex: 'terminalNo',
    align: 'left',
    width: '140px',
    slots: { customRender: 'terminalNo' },
  },
  {
    title: '设备类型',
    dataIndex: 'terminalType',
    align: 'left',
    width: '100px',
    slots: { customRender: 'terminalType' },
  },
  {
    title: '失败原因',
    dataIndex: 'errorMessage',
    align: 'left',
    width: '300px',
    slots: { customRender: 'remarkSlots' },
  },
  {
    title: '操作',
    key: 'operation',
    width: '150px',
    align: 'left',
    slots: { customRender: 'operation' },
  }
];
export default columns;