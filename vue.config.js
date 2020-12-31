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

  // these two are required to make github pages work
  publicPath: "./",
  outputDir: path.resolve(__dirname, "./docs"),
};
