import type { App } from 'vue';
import 'element-plus/lib/theme-chalk/index.css';
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
// 设置语言
locale.use(lang)
import {
    ElPopover,
    ElPopper,
    ElTree,
    ElButton,
    ElSelect,
    ElOption,
    ElTabs,
    ElTable,
    ElTableColumn,
    ElTabPane,
    ElDialog,
    ElInput,
    ElTooltip,
    ElForm,
    ElFormItem,
    ElRadio,
    ElRadioGroup,
    ElCheckbox,
    ElSwitch,
    ElTimePicker,
    ElPagination,
    ElDatePicker,
    ElTag,
    ElLoading,
    ElCascaderPanel,
    ElInfiniteScroll,
    ElMessageBox,
    ElAutocomplete,
    ElEmpty,
    ElProgress
} from 'element-plus';

const components = [ElProgress, ElEmpty, ElAutocomplete, ElRadioGroup, ElCascaderPanel, ElTag, ElDatePicker, ElPagination, ElTimePicker, ElSwitch, ElCheckbox, ElRadio, ElFormItem, ElForm, ElTooltip, ElInput, ElTree, ElTable, ElTableColumn, ElButton, ElSelect, ElOption, ElTabs, ElTabPane, ElPopover, ElPopper, ElDialog];
const plugins = [ElLoading, ElInfiniteScroll, ElMessageBox];
export function setupElement(app: App<Element>) {
    components.forEach(component => {
        app.component(component.name, component)
    });
    plugins.forEach(plugin => {
        app.use(plugin as any)
    })
}
