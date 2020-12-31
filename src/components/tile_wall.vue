<template>
  <div class="tile-wall">
    <h4>Tile Wall: Under Development</h4>

    <canvas
      ref="theCanvas"
      width="512"
      height="1024"
      style="border: 1px solid red; height: 768px; width: 384px;"
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
  methods: {},
};
</script>

<style scoped></style>
