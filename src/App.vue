<template>
  <div class="main">
    <file-explorer />
    <file-drop />
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

<style scoped>
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
