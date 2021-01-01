<template>
  <div class="canv-wrapper"></div>
</template>

<script>
import { upsertCanvas } from "./addressable_canvas_store";

export default {
  name: "AddressableCanvas",
  props: {
    idx: {
      required: true,
      type: Number,
    },
    prefix: {
      required: true,
      type: String,
    },
    width: {
      default: 64,
      type: Number,
    },
    height: {
      default: 64,
      type: Number,
    },
  },
  mounted() {
    this.$el.appendChild(
      upsertCanvas({
        idx: this.idx,
        prefix: this.prefix,
        width: this.width,
        height: this.height,
      })
    );
  },
  methods: {},
  watch: {
    idx(newIdx, oldIdx) {
      this.$el.replaceChild(
        upsertCanvas({
          idx: newIdx,
          prefix: this.prefix,
          width: this.width,
          height: this.height,
        }),
        upsertCanvas({
          idx: oldIdx,
          prefix: this.prefix,
          width: this.width,
          height: this.height,
        })
      );
    },
  },
};
</script>

<style scoped lang="scss">
.canv-wrapper {
  line-height: 0px;
}
</style>
