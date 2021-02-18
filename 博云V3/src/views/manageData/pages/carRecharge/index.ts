import { reactive } from "vue";
const parament = reactive({
  headerAppend:{
    title:'加钱币：',
    value: 0,
    icon: 'icon-bi',
  },
  tabsItem: [
    {
      id: 160401,
      title: '车辆续费',
      value: 'carRecharge'
    },
    {
      id:0,
      title: '续费记录',
      value: 'rechargeLog'
    },
    {
      id: 160402,
      title: '车币划拨',
      value: 'carCoin'
    },
    {
      id: 160403,
      title: '车币划拨记录',
      value: 'carCoinLog'
    }
  ],
});

export { 
  parament
};