const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const axios = require("axios");
const Agent = require("https").Agent;
const chalk = require("chalk");
const DevServer = require("webpack-dev-server");

const clientConfig = env => ({
  mode: "development",
  target: "web",
  entry: ["./src/ssr/entry-client.tsx"],
  output: {
    pathinfo: true, // 输入代码添加额外的路径注释，提高代码可读性
    filename: `client/[name].js` /* development、production 输出文件 */,
    publicPath: "/" /* development 输入目录前缀 */
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".sass", ".less"],
    modules: [env.src, "node_modules"],
    alias: env.alias
  },
  devtool: "cheap-module-source-map",
  optimization: {
    runtimeChunk: "single"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [env.src],
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.resolve(
        __dirname,
        `${env.src}/index.html`
      ) /* 自动在该模板中导入 output 中的filename文件 */
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin() /* 控制台显示加载进度 */
  ]
});

const serverConfig = env => ({
  mode: "production",
  target: "node",
  bail: true,
  devtool: false,
  entry: ["./src/ssr/entry-server.tsx"],
  output: {
    libraryTarget: "commonjs2" /* 用于module.constructor */,
    chunkFilename: `static/js/[name].chunk.js`,
    filename: `server/[name].js` /* development、production 输出文件 */,
    publicPath: "/" /* development 输入目录前缀 */
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: [env.src, "node_modules"]
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: {
          minChunks: 1,
          minSize: 0,
          name: "vendors"
        }
      }
    },
    runtimeChunk: false
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [env.src],
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProgressPlugin()
  ]
});

const devServer = (compiler, env) => {
  return new DevServer(compiler, {
    contentBase: env.contentBase,
    watchContentBase: true,
    host: env.host,
    historyApiFallback: true,
    hot: true,
    compress: true,
    quiet: true,
    overlay: {
      warnings: true,
      errors: true
    },
    before: function(app) {
      // 开启https时 需要使用http Agent代理获取数据
      app.use((req, res, next) => {
        if (
          /^\/client/.test(req.path) ||
          /^\/server/.test(req.path) ||
          /^\/index.html/.test(req.path) ||
          /^\/favicon.ico/.test(req.path) ||
          /^\/static/.test(req.path)
        ) {
          next();
        } else {
          try {
            Promise.all([
              axios.get(`http://localhost:3000/server/main.js`, {
                httpsAgent: new Agent({ rejectUnauthorized: false })
              }),
              axios.get(`http://localhost:3000/index.html`, {
                httpsAgent: new Agent({ rejectUnauthorized: false })
              })
            ]).then(([main, tpl]) => {
              const Module = module.constructor;
              const mainModule = new Module();
              mainModule._compile(main.data, "serverJS");
              const result = mainModule.exports.default(req.path);
              res.end(tpl.data.replace("<!--container-->", result.html));
            });
          } catch (e) {
            res.end(e);
          }
        }
      });
    }
  });
};

module.exports = start = env => {
  const webpackConfig = [clientConfig(env), serverConfig(env)];
  const compiler = webpack(webpackConfig);
  const server = devServer(compiler, env);
  server.listen(env.port, env.host, error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.info(
      chalk`starting dev server on {green http://localhost:${env.port}/} \n`
    );
    return null;
  });

  ["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });
};
