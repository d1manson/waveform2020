/*

  Usage:

    import { createApp } from "vue";
    import App from "./App.vue";
    import * as Comlink from "comlink";
    import workerMixin from "./worker_vue_mixin";

    const worker = Comlink.wrap(new Worker("./main-worker.js", { type: "module" }));
    const app = createApp(App);
    app.mixin(workerMixin(worker));
    app.mount("#app");

  This provides a .worker property on all vue components, which is simply
  the object passed through to the workerMixin function. Note we are using comlink
  here, which makes it much nicer to talk to workers.

  It also allows for you to add the following to your component config:

  {
    workerEvents: {
      "some-event"(data){
        // handle event
      }
    },
    ... props, data, methods etc.
  }

  On the worker side you need:

    let trigger = (eventName, payload) => null;

    Comlink.expose({
      setTriggerFunction(triggerNew) {
        trigger = triggerNew;
      },
      ...
    });

  And then you can use this within the worker code:
    trigger("some-event", data);
*/

import * as Comlink from "comlink";

export default (worker) => {
  const workerEventHandlers = {};

  worker.setTriggerFunction(
    Comlink.proxy((eventName, data) => {
      const handlers = workerEventHandlers[eventName];
      handlers && handlers.forEach((h) => h(data));
    })
  );

  return {
    data: () => ({ worker: worker, $_boundWorkerEventHandlers: null }),
    mounted() {
      if (!this.$options.workerEvents) {
        return;
      }
      this.$_boundWorkerEventHandlers = {};

      for (const [eventName, handler] of Object.entries(
        this.$options.workerEvents
      )) {
        const boudHandler = handler.bind(this);
        this.$_boundWorkerEventHandlers[eventName] = boudHandler;
        workerEventHandlers[eventName] = workerEventHandlers[eventName] || [];
        workerEventHandlers[eventName].push(boudHandler);
      }
    },
    unmounted() {
      if (!this.$options.workerEvents) {
        return;
      }
      for (const [eventName, handler] of Object.entries(
        this.$_boundWorkerEventHandlers
      )) {
        workerEventHandlers[eventName] = workerEventHandlers[eventName].filter(
          (h) => h !== handler
        );
      }
    },
  };
};
