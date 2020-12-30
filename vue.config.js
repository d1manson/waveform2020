const WorkerPlugin = require("worker-plugin");

module.exports = {
  chainWebpack: (config) => config.resolve.symlinks(false),
  configureWebpack: {
    output: {
      globalObject: "this",
    },
    plugins: [new WorkerPlugin()],
  },
};
