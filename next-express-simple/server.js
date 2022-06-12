const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    console.log(pathname);

    if (pathname === "/a") {
      app.render(req, res, "/_next/static/development/pages/index.js", query);
    } else if (pathname === "/b") {
      app.render(req, res, "/a", query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(8080, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:8080");
  });
});
