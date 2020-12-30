import * as Comlink from "comlink";

const files = [];
const fileFromName = new Map();
let trigger = (eventName, payload) => null;

function organiseFiles() {
  const experiments = {};
  files.forEach((f) => {
    const match = f.name.match(/(.*)(_\d+\.cut|\.set|\.pos|\.\d+)$/);
    if (!match) {
      return;
    }
    fileFromName.set(f.name, f);

    const [_, experimentName, fileExtension] = match;
    let exp = experiments[experimentName];
    if (!exp) {
      exp = {
        name: experimentName,
        date: 0,
        set_file: null,
        pos_file: null,
        tetrodes: [],
      };
      experiments[experimentName] = exp;
    }

    if (fileExtension === ".set") {
      exp.set_file = { name: f.name, short: "~.set" };
      exp.date = f.lastModified;
    } else if (fileExtension === ".pos") {
      exp.pos_file = { name: f.name, short: "~.pos" };
    } else {
      const match = fileExtension.match(/\d+/);
      const tetNum = parseInt(match[0]);
      let tet = exp.tetrodes[tetNum];
      if (!tet) {
        tet = { tet_file: null, cut_files: [], num: tetNum };
        exp.tetrodes[tetNum] = tet;
      }
      if (fileExtension.match(/cut/)) {
        tet.cut_files.push({ name: f.name, short: "~.cut" });
      } else {
        tet.tet_file = { name: f.name, short: `~.${tetNum}` };
      }
    }
  });
  trigger(
    "update:organised-files",
    Object.values(experiments).sort((a, b) => (a.name > b.name ? 1 : -1))
  );
}

let offscreenCanvas;

Comlink.expose({
  addFiles(newFiles) {
    newFiles.forEach((f) => files.push(f));
    organiseFiles();
  },
  setTriggerFunction(triggerNew) {
    trigger = triggerNew;
  },
  useTileWallCanvas(offscreenCanvasNew) {
    offscreenCanvas = offscreenCanvasNew;
  },
  render() {
    const ctx = offscreenCanvas.getContext("2d");
    ctx.fillRect(10, 30, 40, 90);
  },
});
