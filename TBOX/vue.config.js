module.exports = {
  runtimeCompiler: true,
  devServer: {
    // open: true, //配置自动启动浏览器
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.130.223:7999/",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": ""
    //     }
    //   }
    // } // 配置多个代理
  },

  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `
        @import "~@/assets/css/variables.scss";
        @import "~@/assets/css/mixin.scss";
        `
      }
    }
  }
};
