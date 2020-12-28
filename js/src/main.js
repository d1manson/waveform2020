import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

(async () => {
  window.wasm = await import("wasm-waveform2020");

  window.wasm.greet();
})();
