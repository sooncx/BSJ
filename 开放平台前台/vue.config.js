const webpack = require('webpack');
module.exports = {
  runtimeCompiler: true,
  devServer: {
    // open: true, //配置自动启动浏览器
    proxy: {
      "/api": {
        target: "http://120.77.133.46:8002/api/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    } // 配置多个代理
  },
  // publicPath: process.env.NODE_ENV === "production"
  //       ? '/webConsole/'   // 对应后面`nginx`路径，这里添加的目的是其他静态资源文件统一前缀路径
  //       : '/',
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        prependData: `
        @import "~@/assets/css/variables.scss";
        @import "~@/assets/css/mixin.scss";
        `
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
      })
    ]
  }
};
