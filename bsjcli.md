# 博实结 cli 工具

- 全局安装 cli 工具: `npm i bsjcli -g`

## web 初始化

- 项目初始化: `bsjcli init vue/web yourProjectName`
- ui 框架：`element`
- css: 使用了 scss 修改全局变量在 `src/assets/variables` 和全局 scss 混入方法 `src/assets/mixin`
- 时间处理：`dayjs`

## h5 初始化

- 项目初始化: `bsjcli init vue/h5 yourProjectName`
- ui 框架：`vant`
- css: 使用了 less 修改全局变量在 `src/assets/variables` 和全局 less 混入方法 `src/assets/mixin`
- 时间处理：`dayjs`

## API 的使用

- 服务器请求地址: `src/api/baseURL`
- axios 的请求拦截和响应拦截: `src/api/apiConfig`
- 请求的接口地址放在: `src/api/url`
- 请求的方法封装放在: `src/api/httpApi`
- 常用的 axios 方法封装放在: `src/api/apiFn` 里面还有下载文件和请求经纬度地址的封装
