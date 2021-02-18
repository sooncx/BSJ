module.exports = {
  runtimeCompiler: true,

  devServer: {
    // open: true, //配置自动启动浏览器
    proxy: {
      "/api": {
        target: "http://yun.car900.com/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    } // 配置多个代理
  },
  configureWebpack: config => {
    config["externals"] = {
      AMap: "AMap", // 高德地图配置
      BMap: "BMap",
      BMapLib: "BMapLib"
    };
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
