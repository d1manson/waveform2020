<template>
  <div class="main">
    <splitpanes vertical class="default-theme">
      <pane size="30">
        <splitpanes horizontal class="default-theme">
          <pane size="30">
            <file-explorer />
          </pane>
          <pane size="35">
            TODO: plot pos data here
          </pane>
          <pane size="35" class="bottom-pane">
            TODO: plot clusters here
            <hr />
            <div class="note">
              Note this whole thing is still in early development.
              <br />
              <br />
              View the source on github
              <a href="https://github.com/d1manson/waveform2020">here</a>, you
              can also see the old 2016 version
              <a href="https://github.com/d1manson/waveform">here</a>.
              <br />
              <br />
              Google Analytics is used to track usage, but the data sent to
              Google is pretty basic - it doesn't include any details about the
              data you are looking at.
            </div>
          </pane>
        </splitpanes></pane
      >
      <pane size="70">
        <tile-wall />
      </pane>
    </splitpanes>
    <file-drop />
  </div>
</template>

<script>
import FileDrop from "./components/file_drop.vue";
import FileExplorer from "./components/file_explorer.vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import TileWall from "./components/tile_wall.vue";

export default {
  name: "App",
  components: {
    FileDrop,
    FileExplorer,
    Splitpanes,
    Pane,
    TileWall,
  },
};
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}
.splitpanes__pane {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2) inset;
}
.bottom-pane {
  flex-direction: column;
}
.note {
  font-size: 0.8em;
  margin: 10px;
}
</style>
