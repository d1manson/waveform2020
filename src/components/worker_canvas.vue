<template>
  <div class="canv-wrapper"></div>
</template>

<script>
/*
  You specify a {prefix,idx} to identify canvases.

  The worker thread controls when a given canvas is actually created and
  what its width/height and pixel data will actually be, but this component
  on the main thread controls where to actually display those
  canvases (if at all, note each canvas can only be displayed in one place).

  TODO: use an LRU cache somehow to prevent memory leaks if the set of
  canvases in use changes a lot.
*/
import * as Comlink from "comlink";

const canvasFromKey = new Map();
const handlerFromKey = new Map();

// This function needs to be registered with the worker
export function upsertCanvasesForWorkerThread(canvProps) {
  const canvs = canvProps //
    .map(({ prefix, idx, width, height }) => {
      const key = `${prefix}|${idx}`;
      let canvas = canvasFromKey.get(key);
      if (canvas && (canvas.width !== width || canvas.height !== height)) {
        canvas = null;
      }
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvasFromKey.set(key, canvas);
        if (handlerFromKey.has(key)) {
          handlerFromKey.get(key)(canvas);
        }
      }

      return canvas.transferControlToOffscreen();
    });

  return Comlink.transfer(canvs, canvs);
}

export default {
  name: "WorkerCanvas",
  props: {
    prefix: {
      required: true,
      type: String,
    },
    idx: {
      required: true,
      type: Number,
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
    this._register(this.key);
  },
  computed: {
    key() {
      return `${this.prefix}|${this.idx}`;
    },
  },
  unmounted() {
    this._release(this.key);
  },
  methods: {
    _register(key) {
      handlerFromKey.set(key, this._handler);
      if (canvasFromKey.has(key)) {
        this._handler(canvasFromKey.get(key));
      }
    },
    _release(key) {
      if (handlerFromKey.get(key) === this._handler) {
        handlerFromKey.delete(key);
      }
    },
  },
  watch: {
    key(newKey, oldKey) {
      this._release(oldKey);
      this._register(newKey);
    },
  },
};
</script>

<style scoped lang="scss">
.canv-wrapper {
  line-height: 0px;
}
</style>
