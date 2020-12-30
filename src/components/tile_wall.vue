<template>
  <div class="tile-wall">
    <h4>Tile Wall: Under Development</h4>

    <canvas
      ref="theCanvas"
      width="400"
      height="400"
      style="border: 1px solid red;"
      @click="doSomething"
    />
  </div>
</template>

<script>
import * as Comlink from "comlink";
export default {
  name: "TileWall",
  props: {},
  data: () => ({}),
  mounted() {
    window.tw = this;
    const offCanv = this.$refs.theCanvas.transferControlToOffscreen();
    window.offCanv = offCanv;
    this.worker.useTileWallCanvas(Comlink.transfer(offCanv, [offCanv]));
  },
  methods: {
    doSomething() {
      this.worker.render();
    },
  },
};
</script>

<style scoped></style>
