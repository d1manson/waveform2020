import readAsArrayBuffer from "./read_as_array_buffer";

export default async function(f) {
  const buffer = await readAsArrayBuffer(f);
  const top_str = new TextDecoder("utf-8").decode(buffer.slice(0, 1204 + 1));

  const match = top_str.match(/\r\ndata_start/);
  if (!match) {
    throw "did not find end of header in tet file.";
  }

  const data_start = match[0].index + match[0].length;
  return {
    header: "TODO: parse header",
    body: new Int8Array(buffer.slice(data_start, -10)),
  };
}
