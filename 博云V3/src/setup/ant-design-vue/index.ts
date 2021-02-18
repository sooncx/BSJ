import type { App } from 'vue';

import {TimePicker, Switch, Button, Slider,Cascader, Input, Row, Col, Form, Layout, Menu, Tabs, Upload, Radio, Steps, Table, Pagination, Select, Checkbox, Tag, Tooltip, DatePicker, Modal, Spin, Empty, Dropdown, Tree, Popover } from 'ant-design-vue';

export function setupAntd(app: App<Element>) {
  app.use(Button)
    .use(Input)
    .use(Col)
    .use(Row)
    .use(Modal)
    .use(Layout)
    .use(Menu)
    .use(Slider)
    .use(Tabs)
    .use(Upload)
    .use(Steps)
    .use(Radio)
    .use(Table)
    .use(Pagination)
    .use(Checkbox)
    .use(Select)
    .use(Form)
    .use(Tag)
    .use(Tooltip)
    .use(DatePicker)
    .use(Spin)
    .use(Empty)
    .use(Dropdown)
    .use(Tree)
    .use(Popover)
    .use(Cascader)
    .use(Switch)
    .use(TimePicker)
}
