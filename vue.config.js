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

  // this means use relative paths for js/css etc.
  // This means it supports hosting on github at:
  //  https://some-username.github.com/some-reponame,
  // i.e. where there is 'some-reponame' after the domain
  publicPath: "./",
};
