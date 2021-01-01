import { createApp } from "vue";
import App from "./App.vue";
import * as Comlink from "comlink";
import workerMixin from "./worker_vue_mixin";
import { createCanvasesForWorkerThread } from "./components/worker_canvas";

const worker = Comlink.wrap(new Worker("./main-worker.js", { type: "module" }));

const app = createApp(App);

app.mixin(workerMixin(worker));

app.mount("#app");

(async () => {
  // see https://github.com/GoogleChromeLabs/comlink/issues/506#issuecomment-753367898
  worker.setRequestCanvasesFunction(
    Comlink.proxy(createCanvasesForWorkerThread)
  );
})();
