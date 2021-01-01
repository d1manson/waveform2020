<template>
  <div class="canv-wrapper"></div>
</template>

<script>
/*
  You specify a path to identify canvases. Path is just a string, but it's
  expected to have dot-delimited parts, e.g 'tiles.0.waves'.
  
  The worker thread controls when a given canvas is actually created and
  what its width/height and pixel data will actually be, but this component
  on the main thread controls where to actually display those
  canvases (if at all, note each canvas can only be displayed in one place).

  TODO: use an LRU cache somehow to prevent memory leaks if the set of
  canvases in use changes a lot.
*/
import * as Comlink from "comlink";

const canvasFromPath = new Map();
const handlerFromPath = new Map();

// This function needs to be registered with the worker
export function upsertCanvasesForWorkerThread(canvProps) {
  const canvs = canvProps //
    .map(({ path, width, height }) => {
      let canvas = canvasFromPath.get(path);
      if (canvas && (canvas.width !== width || canvas.height !== height)) {
        canvas = null;
      }
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvasFromPath.set(path, canvas);
        if (handlerFromPath.has(path)) {
          handlerFromPath.get(path)(canvas);
        }
      }

      return canvas.transferControlToOffscreen();
    });

  return Comlink.transfer(canvs, canvs);
}

export default {
  name: "WorkerCanvas",
  props: {
    path: {
      required: true,
      type: String,
    },
  },
  mounted() {
    this._handler = (canv) => {
      if (this.$el.firstChild) {
        this.$el.replaceChild(this.$el.firstChild, canv);
      } else {
        this.$el.appendChild(canv);
      }
    };
    this._register(this.path);
  },
  unmounted() {
    this._release(this.path);
  },
  methods: {
    _register(path) {
      handlerFromPath.set(path, this._handler);
      if (canvasFromPath.has(path)) {
        this._handler(canvasFromPath.get(path));
      }
    },
    _release(path) {
      if (handlerFromPath.get(path) === this._handler) {
        handlerFromPath.delete(path);
      }
    },
  },
  watch: {
    path(newPath, oldPath) {
      this._release(oldPath);
      this._register(newPath);
    },
  },
};
</script>

<style scoped lang="scss">
.canv-wrapper {
  line-height: 0px;
}
</style>
