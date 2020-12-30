import * as Comlink from "comlink";

const files = [];

/*
function organiseFiles(){
  const experiments = {};
  files.forEach(f => {
    const experiment_name = f.name.replace(/)
  })

}
*/

function updateFileNames() {
  const names = files.map((f) => f.name);
  trigger("update:file-name", names);
}

let trigger = (eventName, payload) => null;

Comlink.expose({
  addFiles(newFiles) {
    newFiles.forEach((f) => files.push(f));
    //organiseFiles();
    updateFileNames();
  },
  setTriggerFunction(triggerNew) {
    trigger = triggerNew;
  },
});
