<template>
  <div class="main">
    <file-drop />
    <file-explorer />
  </div>
</template>

<script>
import FileDrop from "./components/file_drop.vue";
import FileExplorer from "./components/file_explorer.vue";

export default {
  name: "App",
  components: {
    FileDrop,
    FileExplorer,
  },
};
</script>

<style>
.main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
