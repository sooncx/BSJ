// 注册插件  按需引入 减小包大小
//  @element-ui  地址  http://element-cn.eleme.io/#/zh-CN

import Vue from "vue";
import {
  Row,
  Col,
  Dialog,
  Message,
  Form,
  FormItem,
  Input,
  Button,
  Select,
  Option,
  Pagination,
  Tabs,
  TabPane,
  Tree,
  Autocomplete,
  Table,
  TableColumn,
  Menu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Popover,
  Upload,
  MessageBox,
  Slider,
  InputNumber,
  Loading,
  InfiniteScroll
} from "element-ui";
import API from "@/api/httpApi";
import "@/style/theme/index.css";
import "@/assets/css/reset.scss";

Vue.use(Loading);
Vue.use(InfiniteScroll);
Vue.component("el-row", Row);
Vue.component("el-col", Col);
Vue.component("el-dialog", Dialog);
Vue.component("el-form", Form);
Vue.component("el-form-item", FormItem);
Vue.component("el-input", Input);
Vue.component("el-button", Button);
Vue.component("el-button", Button);
Vue.component("el-select", Select);
Vue.component("el-option", Option);
Vue.component("el-pagination", Pagination);
Vue.component("el-tabs", Tabs);
Vue.component("el-tab-pane", TabPane);
Vue.component("el-tree", Tree);
Vue.component("el-autocomplete", Autocomplete);
Vue.component("el-table", Table);
Vue.component("el-table-column", TableColumn);
Vue.component("el-menu", Menu);
Vue.component("el-menu-item", MenuItem);
Vue.component("el-dropdown", Dropdown);
Vue.component("el-dropdown-menu", DropdownMenu);
Vue.component("el-dropdown-item", DropdownItem);
Vue.component("el-date-picker", DatePicker);
Vue.component("el-popover", Popover);
Vue.component("el-upload", Upload);
Vue.component("el-slider", Slider);
Vue.component("el-input-number", InputNumber);

Vue.prototype.$msg = Message;
Vue.prototype.$msgBox = MessageBox;
Vue.prototype.$API = API;
Vue.prototype.$sleep = async (ms = 100) => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
};

export default Vue;
