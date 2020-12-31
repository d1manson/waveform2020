import { createApp } from "vue";
import App from "./App.vue";
import * as Comlink from "comlink";
import workerMixin from "./worker_vue_mixin";

const worker = Comlink.wrap(new Worker("./main-worker.js", { type: "module" }));

const app = createApp(App);

app.mixin(workerMixin(worker));

app.mount("#app");
