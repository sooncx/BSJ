import type { PropType } from 'vue';
export const modalProps = {
  visible: Boolean as PropType<boolean>,

  /**
   * 拖拽开关
   */
  draggable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  /**
   * 垂直居中展示 Modal
   */
  centered: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  cancelText: {
    type: String as PropType<string>,
    default: '取消',
  },

  okText: {
    type: String as PropType<string>,
    default: '保存',
  },

  /**
   * 全选Flag
   */
  checkboxFlag: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  /**
   * 全选文本
   */
  checkboxText: {
    type: String as PropType<string>,
    default: '全选',
  },

  /**
   * 全选回调
   */
  checkboxFn: Function as PropType<() => Promise<boolean>>,

  /**
   * 全选值
   */
  checkboxChecked: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  /**
   * 描述
   */
  description: String as PropType<string>,

  /**
   * ok回调
   */
  onOk: Function as PropType<() => Promise<boolean>>,
};

export const basicProps = Object.assign({}, modalProps, {
  /**
   * Modal 完全关闭后的回调
   */
  afterClose: Function as PropType<() => Promise<any>>,

  /**
   * Modal body 样式
   */
  bodyStyle: Object as PropType<any>,

  /**
   * 是否显示右上角的关闭按钮
   */
  closable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  /**
   * 自定义关闭图标
   */
  closeIcon: Object as PropType<any>,

  /**
   * 确定按钮 loading
   */
  confirmLoading: Boolean as PropType<boolean>,

  /**
   * 关闭时销毁 Modal 里的子元素
   */
  destroyOnClose: Boolean as PropType<boolean>,

  /**
   * 底部内容，当不需要默认底部按钮时，可以设为 :footer="null"
   */
  footer: Object as PropType<any>,

  /**
   * 指定 Modal 挂载的 HTML 节点
   */
  getContainer: Function as PropType<() => any>,

  /**
   * 是否展示遮罩
   */
  mask: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  /**
   * 点击蒙层是否允许关闭
   */
  maskClosable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  /**
   * 是否支持键盘 esc 关闭
   */
  keyboard: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  /**
   * 遮罩样式
   */
  maskStyle: Object as PropType<any>,

  /**
   * 确认按钮类型
   */
  okType: {
    type: String as PropType<string>,
    default: 'primary',
  },

  /**
   * ok 按钮 props
   */
  okButtonProps: Object as PropType<any>,

  /**
   * cancel 按钮 props
   */
  cancelButtonProps: Object as PropType<any>,

  /**
   * 标题
   */
  title: {
    type: String as PropType<string>,
    default: '标题'
  },

  /**
   * 对话框是否可见
   */
  visible: Boolean as PropType<boolean>,

  /**
   * 宽度
   */
  width: [String, Number] as PropType<string | number>,

  /**
   * 对话框外层容器的类名
   */
  wrapClassName: {
    type: String as PropType<string>,
  },

  /**
   * 设置 Modal 的 z-index
   */
  zIndex: {
    type: Number as PropType<number>,
  },

  /**
   * 可用于设置浮层的样式，调整浮层位置等
   */
  dialogStyle: Object as PropType<any>,

  /**
   * 	可用于设置浮层的类名
   */
  dialogClass: String as PropType<string>,
});
