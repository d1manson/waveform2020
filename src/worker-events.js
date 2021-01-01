import * as Comlink from "comlink";

let triggerFn = (eventName, payload) => null;

// this is exposed within Comlink.expose({}) in main-worker.js
// see https://github.com/GoogleChromeLabs/comlink/issues/506#issuecomment-753367898
export function setTriggerFunction(triggerNew) {
  triggerFn = triggerNew;
}

export function trigger(eventName, data, transferables) {
  triggerFn(
    eventName,
    transferables ? Comlink.transfer(data, transferables) : data
  );
}
