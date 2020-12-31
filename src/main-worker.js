import * as Comlink from "comlink";
import waveWebgl from "./wave_webgl";
import parseTetFile from "./parse_tet_file";

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

let offscreenCanvas;

async function render(tetFile) {
  const { header, body } = await parseTetFile(tetFile);
  waveWebgl(offscreenCanvas, body, makeDummyCutData(1e3), 1e3);
}

function makeDummyCutData(nWaves) {
  const CUT_DATA = new Float32Array(nWaves * 2);
  for (let ii = 0; ii < nWaves; ii++) {
    CUT_DATA[ii * 2 + 0] = ii % 2;
    CUT_DATA[ii * 2 + 1] = (ii & 2) >> 1;
  }
  return CUT_DATA;
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
    offscreenCanvas = offscreenCanvasNew;
  },
  render({ experiment_name, tet_num }) {
    // This is extremely rough, it will need to be substantially rethought when
    // used for real.
    const tetFileName =
      experiments[experiment_name].tetrodes[tet_num].tet_file.name;
    const tetFile = fileFromName.get(tetFileName);
    render(tetFile);
  },
});
