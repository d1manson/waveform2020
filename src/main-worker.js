import * as Comlink from "comlink";
import { render as renderWaves, setOffScreenCanvas } from "./wave_webgl";
import parseTetFile from "./parse_tet_file";
import parseCutFile from "./parse_cut_file";

const fileFromName = new Map();
const experiments = {};

let trigger = (eventName, payload) => null;

function storeFileWithinExperiments(f) {
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
}

async function render(tetFile, cutFile) {
  const { webgl_voltage_data } = await parseTetFile(tetFile);

  const { cut } = await parseCutFile(cutFile);

  renderWaves(webgl_voltage_data, cut);
}

Comlink.expose({
  addFiles(newFiles) {
    newFiles.forEach((f) => {
      fileFromName.set(f.name, f);
      storeFileWithinExperiments(f);
    });
    trigger(
      "update:organised-files",
      Object.values(experiments).sort((a, b) => (a.name > b.name ? 1 : -1))
    );
  },
  setTriggerFunction(triggerNew) {
    trigger = triggerNew;
  },
  useTileWallCanvas(offscreenCanvasNew) {
    // this is only needed during development when we want to use a real canvas
    // in the long run we can just create an offscreen canvas from scratch on the worker
    setOffScreenCanvas(offscreenCanvasNew);
  },
  render({ experiment_name, tet_num, cut_file_name }) {
    // This is extremely rough, it will need to be substantially rethought when
    // used for real.
    const tetFileName =
      experiments[experiment_name].tetrodes[tet_num].tet_file.name;
    const tetFile = fileFromName.get(tetFileName);
    const cutFile = fileFromName.get(cut_file_name);
    render(tetFile, cutFile);
  },
});
