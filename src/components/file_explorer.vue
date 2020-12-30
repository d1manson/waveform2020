<template>
  <div class="main">
    <h1>File Explorer</h1>
    <div
      v-for="experiment in Object.values(experiments)"
      :key="experiment.name"
    >
      {{ experiment.name }}
    </div>
  </div>
</template>

<script>
//import * as Comlink from "comlink";

export default {
  name: "FileExplorer",
  props: {},
  workerEvents: {
    "update:organised-files"(experiments) {
      this.experiments = experiments;
    },
  },
  data: () => ({
    experiments: {},
  }),
  mounted() {
    window.fe = this;
  },
  methods: {},
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
