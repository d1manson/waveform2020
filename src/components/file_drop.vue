<template>
  <div class="main" id="drop_zone" @drop="onDrop" @dragover="onDragOver">
    <h1>File Drop</h1>
    <div v-for="fn in fileNames" :key="fn">{{ fn }}</div>
  </div>
</template>

<script>
//import * as Comlink from "comlink";

export default {
  name: "FileDrop",
  props: {},
  workerEvents: {
    "update:file-name"(filesNames) {
      this.fileNames = filesNames;
    },
  },
  data: () => ({
    fileNames: [],
  }),
  mounted() {
    window.fd = this;
  },
  methods: {
    async onDrop(event) {
      event.preventDefault();
      const newFiles = event.dataTransfer.items
        ? [...event.dataTransfer.items]
            .filter((item) => item.kind === "file")
            .map((item) => item.getAsFile())
        : event.dataTransfer.files;
      this.worker.addFiles(newFiles);
    },
    onDragOver(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.main {
  width: 80vw;
  height: 50vh;
  background: #ccc;
  margin: 0 auto;
}
</style>
