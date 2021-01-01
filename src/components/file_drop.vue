<template>
  <div class="wrapper" v-if="dragging">
    <div class="background">
      <div class="border"></div>
    </div>
    <div class="inner-wrapper">
      <div class="inner">
        Supported file types:
        <ul>
          <li>
            <strong>Axona</strong> .set, .pos, .cut, and numbered tet files
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileDrop",
  props: {},
  data: () => ({
    dragging: false,
  }),
  mounted() {
    window.fd = this;

    // we don't bother to remove them on unmount because we assume this component is never unmounted
    window.document.addEventListener("dragover", this.onDragOver.bind(this));
    window.document.addEventListener("drop", this.onDrop.bind(this));
  },
  methods: {
    async onDrop(event) {
      event.preventDefault();
      const newFiles = event.dataTransfer.items
        ? [...event.dataTransfer.items]
            .filter((item) => item.kind === "file")
            .map((item) => item.getAsFile())
        : event.dataTransfer.files;
      this.dragging = false;

      gtag("event", "drop-files", { value: newFiles.length });
      this.worker.addFiles(newFiles);
    },
    onDragOver(event) {
      event.preventDefault();
      this.dragging = true;
      clearTimeout(this._timer);
      this._timer = setTimeout(() => (this.dragging = false), 500);
    },
  },
};
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  box-sizing: border-box;
  background: white;
  padding: 40px;
  opacity: 0.8;
}
.border {
  border: 8px dashed #ccc;
  flex-grow: 1;
}
.inner-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.inner {
  padding: 10px 30px;
  color: #555;
  background: white;
  opacity: 0.8;
  padding: 20px;
}
strong {
  font-weight: bold;
}
</style>
