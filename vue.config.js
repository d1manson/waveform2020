const WorkerPlugin = require("worker-plugin"),
  path = require("path");

module.exports = {
  chainWebpack: (config) => config.resolve.symlinks(false),
  configureWebpack: {
    output: {
      globalObject: "this",
    },
    plugins: [new WorkerPlugin()],
  },

  // this is required to make github pages work
  publicPath: "./dist",
};
