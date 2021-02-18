// 注册插件  按需引入 减小包大小
//  @element-ui  地址  http://element-cn.eleme.io/#/zh-CN

import Vue from "vue";
import "@/style/theme/index.css";
import "@/assets/css/reset.scss";

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Button,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  Tree,
  Table,
  TableColumn,
  Pagination,
  Select,
  Option,
  DatePicker
} from "element-ui";

Vue.component("el-dropdown", Dropdown);
Vue.component("el-dropdown-menu", DropdownMenu);
Vue.component("el-dropdown-item", DropdownItem);
Vue.component("el-dialog", Dialog);
Vue.component("el-button", Button);
Vue.component("el-input", Input);
Vue.component("el-form", Form);
Vue.component("el-form-item", FormItem);
Vue.component("el-row", Row);
Vue.component("el-col", Col);
Vue.component("el-tree", Tree);
Vue.component("el-table", Table);
Vue.component("el-table-column", TableColumn);
Vue.component("el-pagination", Pagination);
Vue.component("el-select", Select);
Vue.component("el-option", Option);
Vue.component("el-date-picker", DatePicker);

Vue.prototype.$sleep = async (ms = 100) => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
};

export default Vue;
