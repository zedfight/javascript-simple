const express = require("express");
const app = express();
const createRouter = require("./routers/router");
const chalk = require("chalk");
const ejs = require("ejs");
var compression = require("compression");
var bodyParser = require("body-parser");
const { createEnv } = require("./env");
const env = createEnv(app);

// 静态资源
app.use("/static", express.static(__dirname + "/src/static"));
app.use("/", express.static(__dirname + "/src"));

// 模板
app.engine("html", ejs.__express);
app.set("view engine", "html");
app.set("views", "./src");

// 解析post数据
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// 路由
createRouter(app);

// 服务
app.listen(env.PORT, () =>
  console.info(chalk`starting dev server on {green http://localhost:3000/}`)
);
