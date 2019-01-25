const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");

const config = {
  mode: "development",
  entry: [
    "webpack-dev-server/client?https://0.0.0.0:3000",
    "webpack/hot/dev-server",
    `./src/index.js`
  ],
  output: {
    filename: "static/js/[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["./src", "node_modules"]
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react"]
        }
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: `./src/index.html`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin()
  ]
};

module.exports = config;
