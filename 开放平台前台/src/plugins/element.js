import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import {
  Button,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Carousel,
  CarouselItem,
  Checkbox,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Table,
  TableColumn,
  Scrollbar,
  Select,
  Option,
  Tabs,
  TabPane,
  DatePicker,
  RadioGroup,
  RadioButton,
  Dialog,
  Form,
  FormItem,
  Tooltip,
  Message,
  Pagination,
  Autocomplete,
  MessageBox,
  Popover,
  Loading,
  Upload,
  Progress,
} from 'element-ui';

Vue.use(Button);
Vue.use(Input);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Checkbox);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Scrollbar);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(DatePicker);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Autocomplete);
Vue.use(Popover);
Vue.use(Loading);
Vue.use(Upload);
Vue.use(Progress);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.prototype.$msg = Message;
Vue.prototype.$confirm = MessageBox;
Vue.use(VueLazyload);
