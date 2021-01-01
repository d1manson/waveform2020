<template>
  <div class="tile-wall">
    <div class="cut-group" v-for="(count, i) in cutGroupCounts" :key="i">
      <div class="group-info">#{{ i }} | n={{ count }}</div>
      <worker-canvas :path="'waves.' + i" />
    </div>

    <canvas
      v-if="BUILD === 'development'"
      ref="offCanvas"
      width="1024"
      height="1024"
      style="
        position: absolute;
        bottom: 0px; right: 0px; 
        opacity: 0.4; border: 1px solid red;
        width: 256px; height: 256px;"
    />
  </div>
</template>

<script>
import WorkerCanvas from "./worker_canvas";

export default {
  name: "TileWall",
  props: {},
  components: {
    WorkerCanvas,
  },
  data: () => ({
    cutGroupCounts: [],
    BUILD: process.env.NODE_ENV,
  }),
  workerEvents: {
    "update:cut-counts"(cutGroupCounts) {
      this.cutGroupCounts = cutGroupCounts;
    },
    "debug-offscreen-page-rendered"(bitmap) {
      this.$refs.offCanvas
        .getContext("bitmaprenderer")
        .transferFromImageBitmap(bitmap);
    },
  },
  methods: {},
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
.group-info {
  font-size: 0.8em;
}
</style>
