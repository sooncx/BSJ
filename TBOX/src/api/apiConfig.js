import axios from "axios";
import axiosJsonp from "axios-jsonp";
import store from "@/store";
import router from "../router/index";
import baseURL from "./baseURL";
// 创建axios实例
const instance = axios.create({ timeout: 60000 });
if (process.env.NODE_ENV === "development") {
  instance.defaults.baseURL = baseURL; // 开发环境
} else if (process.env.NODE_ENV === "production") {
  instance.defaults.baseURL = "/"; // 生产环境
}

// 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
// 设置Get  请求投
instance.defaults.headers.get["Content-Type"] = "application/json;charset=UTF-8";
// instance.defaults.headers.get['sessionId'] = store.state.LOGINUSER.sId
// 请求拦截器
instance.interceptors.request.use(
  config => {
    config.params = config.params || {};
    config.headers.sessionId = store.state.USER ? store.state.USER.sessionId : "";
    config.adapter = config.adapter === "jsonp" ? axiosJsonp : config.adapter;
    // config.params['sId'] = store.state.LOGINUSER.sId
    // config.params['loginToken'] = store.state.LOGINKOKEN
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  // 服务器状态码不是200的情况
  error => {
    // console.error(router)
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router && router.push("/login");
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          break;
        // 404请求不存在
        case 404:
          break;
        // 其他错误，直接抛出错误提示
        default:
      }
      return Promise.reject(error.response);
    }
  }
);

export default instance;
