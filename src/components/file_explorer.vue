<template>
  <div class="file-explorer">
    <template v-if="experiments.length">
      <div class="experiment-list">
        <div
          v-for="experiment in experiments"
          :key="experiment.name"
          class="experiment"
          @click="switchTo(experiment.name)"
          :class="{ selected: experiment.name === selectedExperimentName }"
        >
          <div class="experiment-top">
            <div
              class="experiment-name"
              :class="{ selected: experiment.name === selectedExperimentName }"
            >
              trial '{{ experiment.name }}'
            </div>
            <div
              class="file set-file"
              :class="{ selected: experiment.name === selectedExperimentName }"
              v-if="experiment.set_file"
              :title="experiment.set_file.name"
            >
              {{ experiment.set_file.short }}
            </div>
            <div
              class="file pos-file"
              :class="{ selected: experiment.name === selectedExperimentName }"
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
              @click.stop="switchTo(experiment.name, tet.num)"
            >
              <div
                class="file tet-file"
                :class="{
                  small: selectedTetNum !== tet.num,
                  selected:
                    selectedTetNum === tet.num &&
                    selectedExperimentName === experiment.name,
                }"
                v-if="tet.tet_file"
                :title="tet.tet_file.name"
              >
                {{ tet.tet_file.short }}
              </div>

              <div
                class="file cut-file"
                :class="{
                  small: selectedTetNum !== tet.num,
                  selected:
                    selectedCutName && selectedCutName === cut_file.name,
                }"
                v-for="cut_file in tet.cut_files"
                :key="cut_file.name"
                :title="cut_file.name"
                @click.stop="switchTo(experiment.name, tet.num, cut_file.name)"
              >
                {{ cut_file.short }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="state-info">
        Selected trial '{{ selectedExperimentName }}',
        {{
          selectedTetNum
            ? `tetrode #${selectedTetNum}`
            : "but no tetrode selected"
        }}.
      </div>
    </template>
    <div v-else class="empty">
      <h4>File Explorer</h4>
      After dragging files onto the page, they will be listed here.
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
    selectedExperimentName: null,
    selectedTetNum: null,
    selectedCutName: null,
  }),
  mounted() {
    window.fe = this;
  },
  methods: {
    switchTo(experimentName, tetNum, cutFileName) {
      this.selectedExperimentName = experimentName;
      this.selectedTetNum = tetNum || this.selectedTetNum;
      this.selectedCutName = cutFileName;

      if (!this.selectedCutName) {
        const exp = this.experiments.find((exp) => exp.name === experimentName);
        const tet = exp.tetrodes[this.selectedTetNum];
        if (tet) {
          this.selectedCutName = tet.cut_files[0] && tet.cut_files[0].name;
        }
      }

      this.worker.render({
        experiment_name: this.selectedExperimentName,
        tet_num: this.selectedTetNum,
        cut_file_name: this.selectedCutName,
      });
    },
  },

  watch: {
    experiments() {
      if (this.experiments.length && !this.selectedExperimentName) {
        const tet = this.experiments[0].tetrodes.find((t) => !!t);
        this.switchTo(this.experiments[0].name, tet && tet.num);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.file-explorer {
  width: 100%;
  height: 100%;
  padding: 10px 2px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.experiment-list {
  overflow-y: auto;
  flex-grow: 1;
}
.state-info {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 0.6em;
  padding: 5px 0px 5px 6px;
  border-top: 1px solid #c3c0c0;
}
.experiment {
  margin: 4px 2px;
  border: 1px solid #d0d0d0;
  padding: 4px 6px;
  background: white;
  cursor: pointer;
  &.selected {
    background: #f1efb6;
    border-color: #e0da34;
  }
}
.file {
  font-size: 0.8em;
  display: inline-block;
  margin-left: 4px;
  padding: 1px 2px;
  border: 1px solid;
  &.small {
    width: 3px;
    overflow: hidden;
  }
  &.pos-file,
  &.set-file {
    background: #c4e6e6;
    color: #0b2b82;
    border-color: #0b2b82;
    &.selected {
      background: #c6eb81;
    }
  }

  &.tet-file {
    background: #ddd;
    &.selected {
      background: #dbe02c;
    }
  }
  &.cut-file {
    background: #e8bebe;
    border-color: #5a4242;
    color: #5a4242;
    &.selected {
      background: #d0a541;
    }
  }
}
.experiment-name {
  font-size: 0.8em;
  display: inline-block;
  margin-right: 10px;
  &.selected {
    font-weight: bold;
  }
}
.experiment-bottom {
  margin-top: 2px;
}
.tet-file-group {
  display: inline-block;
  margin-right: 4px;
  vertical-align: top;
  line-height: 0.8em;
}
h4 {
  margin: 5px 0px;
}
.empty {
  margin: 4px 20px;
  border: 1px solid #d0d0d0;
  padding: 10px;
  text-align: center;
  background: white;
}
</style>
