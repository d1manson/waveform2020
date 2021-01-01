import * as Comlink from "comlink";

let triggerFn = (eventName, payload) => null;

// this is exposed within Comlink.expose({}) in main-worker.js
export function setTriggerFunction(triggerNew) {
  triggerFn = triggerNew;
}

export function trigger(eventName, data, transferables) {
  triggerFn(
    eventName,
    transferables ? Comlink.transfer(data, transferables) : data
  );
}
