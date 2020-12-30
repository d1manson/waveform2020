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
          <pane size="35">
            TODO: plot clusters here
          </pane>
        </splitpanes></pane
      >
      <pane size="70">
        TODO: Tilewall
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

export default {
  name: "App",
  components: {
    FileDrop,
    FileExplorer,
    Splitpanes,
    Pane,
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
</style>
