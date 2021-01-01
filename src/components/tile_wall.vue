<template>
  <div class="tile-wall">
    <div class="cut-group" v-for="(count, i) in cutGroupCounts" :key="i">
      #{{ i }} | n={{ count }}
      <br />
      <addressable-canvas
        :width="256"
        :height="60"
        style="border:1px solid #0f0"
        :id="'waves-' + i"
        @new="sendCanvasToWorker('waves', i, $event)"
      />
    </div>

    <canvas
      ref="offCanvas"
      width="512"
      height="1024"
      style="position: absolute; bottom: 0px; right: 0px; opacity: 0.4; border: 1px solid red; height: 512px; width: 256px;"
    />
  </div>
</template>

<script>
import * as Comlink from "comlink";
import AddressableCanvas from "./addressable_canvas";

export default {
  name: "TileWall",
  props: {},
  components: {
    AddressableCanvas,
  },
  data: () => ({
    cutGroupCounts: [],
  }),
  workerEvents: {
    "update:cut-counts"(cutGroupCounts) {
      this.cutGroupCounts = cutGroupCounts;
    },
    "offscreen-page-rendered"(bitmap) {
      this.$refs.offCanvas
        .getContext("bitmaprenderer")
        .transferFromImageBitmap(bitmap);
    },
  },
  mounted() {},
  methods: {
    sendCanvasToWorker(kind, idx, canv) {
      canv = canv.transferControlToOffscreen();
      this.worker.addCanvasById(kind, idx, Comlink.transfer(canv, [canv]));
    },
  },
};
</script>

<style scoped lang="scss">
.tile-wall {
  padding: 10px 5px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
.cut-group {
  display: inline-block;
  border: 1px solid #ccc;
  margin: 2px;
  padding: 2px;
}
</style>
