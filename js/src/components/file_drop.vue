<template>
  <div class="main" id="drop_zone" @drop="onDrop" @dragover="onDragOver">
    <h1>File Drop</h1>
    <div v-for="f in files" :key="f.name">{{ f.name }}</div>
  </div>
</template>

<script>
export default {
  name: "FileDrop",
  props: {},
  data: () => ({
    files: [],
  }),
  mounted() {
    window.fd = this;
  },
  methods: {
    onDrop(event) {
      event.preventDefault();

      const newFiles = event.dataTransfer.items
        ? [...event.dataTransfer.items]
            .filter((item) => item.kind === "file")
            .map((item) => item.getAsFile())
        : event.dataTransfer.files;

      this.files = [...this.files, ...newFiles];
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
