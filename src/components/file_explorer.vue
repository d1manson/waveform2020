<template>
  <div class="file-explorer">
    <template v-if="experiments.length">
      <div
        v-for="experiment in experiments"
        :key="experiment.name"
        class="experiment"
      >
        <div class="experiment-top">
          <div class="experiment-name">trial '{{ experiment.name }}'</div>
          <div
            class="file set-file"
            v-if="experiment.set_file"
            :title="experiment.set_file.name"
          >
            {{ experiment.set_file.short }}
          </div>
          <div
            class="file pos-file"
            v-if="experiment.pos_file"
            :title="experiment.pos_file.name"
          >
            {{ experiment.pos_file.short }}
          </div>
        </div>
        <div class="experiment-bottom">
          <div
            v-for="tet in experiment.tetrodes.filter((tet) => !!tet)"
            :key="tet.num"
            class="tet-file-group"
          >
            <div
              class="file tet-file"
              v-if="tet.tet_file"
              :title="tet.tet_file.name"
            >
              {{ tet.tet_file.short }}
            </div>

            <div
              class="file cut-file"
              v-for="cut_file in tet.cut_files"
              :key="cut_file.name"
              :title="cut_file.name"
            >
              {{ cut_file.short }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="empty">
      <h4>File Explorer</h4>
      Drag files onto the page to get started.
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
    experiments: [],
  }),
  mounted() {
    window.fe = this;
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.file-explorer {
  width: 400px;
  padding: 10px 2px;
  margin: 0 auto;
  background: #f5f5f5;
}
.experiment {
  margin: 4px 2px;
  border: 1px solid #d0d0d0;
  padding: 4px 2px;
  background: white;
}
.file {
  font-size: 0.8em;
  display: inline-block;
  margin-left: 4px;
  padding: 1px 2px;
  border: 1px solid;

  &.pos-file,
  &.set-file {
    background: #e6d39c;
    color: #82630b;
    border-color: #82630b;
  }

  &.tet-file {
    background: #ddd;
  }
  &.cut-file {
    background: #e8bebe;
    border-color: #5a4242;
    color: #5a4242;
  }
}
.experiment-name {
  font-size: 0.8em;
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
}
.experiment-bottom {
  margin-top: 2px;
}
.tet-file-group {
  display: inline-block;
  margin-right: 4px;
}
h4 {
  margin: 5px 0px;
}
.empty {
  margin: 4px 2px;
  border: 1px solid #d0d0d0;
  padding: 10px;
  text-align: center;
  background: white;
}
</style>
