const path = require("path");
// All path must be represented by path.resolve, direct use string invalid in Win32.

function resolve(relativePath) {
  return path.resolve(__dirname, `./${relativePath}`);
}

module.exports = {
  src: resolve("src"),
  contentBase: resolve("src/static"),
  tsConfig: resolve("tsconfig.json"),
  port: 3000,
  host: "0.0.0.0"
};
