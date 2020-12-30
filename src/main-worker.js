import * as Comlink from "comlink";

const files = [];

function organiseFiles() {
  const experiments = {};
  files.forEach((f) => {
    const parts = f.name.match(/(.*)(_\d+\.cut|\.set|\.pos|\.\d+)$/);
    if (!parts) {
      return;
    }
    const experimentName = parts[1];
    experiments[experimentName] = { name: experimentName };
  });
  trigger("update:organised-files", experiments);
}

function updateFileNames() {
  const names = files.map((f) => f.name);
  trigger("update:file-name", names);
}

let trigger = (eventName, payload) => null;

Comlink.expose({
  addFiles(newFiles) {
    newFiles.forEach((f) => files.push(f));
    organiseFiles();
    updateFileNames();
  },
  setTriggerFunction(triggerNew) {
    trigger = triggerNew;
  },
});
