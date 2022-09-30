const path = require("path");
module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      // 那些文件需要自动引入，使用绝对路径
      patterns: [
        path.join(__dirname, "./src/assets/styles/variables.less"),
        path.join(__dirname, "./src/assets/styles/mixin.less"),
      ],
    }
  },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  chainWebpack: (config) => {
    // config.devServer.disableHostCheck(true)
  },
  // 因为我们在html中用script引入了QC文件，需要在vue中import引入使用，如果使用了import，vue-cli会进行打包
  // 这个配置设置外部扩展，使导入QC时不进行打包
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  },
};
