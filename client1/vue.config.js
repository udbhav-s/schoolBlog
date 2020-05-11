/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  outputDir: path.resolve(__dirname, "../server/public"),
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/"
      }
    }
  },
  configureWebpack: {
    devtool: "source-map"
  },
  chainWebpack(config) {
    config.plugin("CompressionPlugin").use(CompressionPlugin);
  }
};
