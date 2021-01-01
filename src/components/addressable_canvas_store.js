/*
  This allows you to upsert a canvas identied by {prefix, idx, width height}
  either from a worker thread or from a main thread.
  
  TODO: use an LRU cache somehow to prevent memory leaks if the set of
  canvases in use changes a lot.

  Note that once a canvas has been transfered to the other thread it can't
  have its width/height changed.

  I might want to have the worker emit an event or something when new canvases 
  are created and/or when canvases are updated so that the main thread doesn't
  need to decide on when to create canvases (and their size).
*/

import * as Comlink from "comlink";

const canvasFromId = new Map();

export function upsertCanvasesForWorkerThread(canvProps) {
  const canvs = canvProps.map(({ prefix, idx, width, height }) =>
    upsertCanvas({
      prefix,
      idx,
      width,
      height,
    }).transferControlToOffscreen()
  );

  return Comlink.transfer(canvs, canvs);
}

export function upsertCanvas({ prefix, idx, width, height }) {
  const key = `${prefix}|${idx}|${width}|${height}`;
  let canv = canvasFromId.get(key);
  if (!canv) {
    canv = document.createElement("canvas");
    canv.width = width;
    canv.height = height;
    canvasFromId.set(key, canv);
  }
  return canv;
}
