import readAsArrayBuffer from "./read_as_array_buffer";

const regex_cut_a = /n_clusters:\s*(\S*)\s*n_channels:\s*(\S*)\s*n_params:\s*(\S*)\s*times_used_in_Vt:\s*(\S*)\s*(\S*)\s*(\S*)\s*(\S*)/;
const regex_cut_b = /Exact_cut_for: ((?:[\s\S](?! spikes:))*[\s\S])\s*spikes: ([0-9]*)/;
const regex_cut_c = /([0-9]+)/g;

export default async function(f) {
  const buffer = await readAsArrayBuffer(f);
  const fullText = new TextDecoder("utf-8").decode(buffer);

  let match = regex_cut_a.exec(fullText);
  const header = {};
  header.n_clusters = parseInt(match[1]);
  header.n_channels = parseInt(match[2]);
  header.n_params = parseInt(match[3]);

  match = regex_cut_b.exec(fullText);
  header.exp = match[1];
  header.n_spikes = parseInt(match[2]);
  header.data_start = match.index + match[0].length;
  header.is_clu = false;

  const cut_as_str = fullText.slice(header.data_start).match(regex_cut_c);
  const cut = new Uint16Array(cut_as_str.length);
  const counts = new Uint32Array(header.n_clusters + 1);

  for (let ii = 0; ii < cut.length; ii++) {
    cut[ii] = parseInt(cut_as_str[ii]);
    counts[cut[ii]]++;
  }

  return {
    cut,
    header,
    group_counts: counts,
  };
}
