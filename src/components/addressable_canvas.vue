<template>
  <div class="canv-wrapper"></div>
</template>

<script>
/*
  This is designed to be used with a worker, but we don't actually
  expose the worker bit itself here. Basically you can upsert a
  a canvas by id, and put it wherever you want in the dom using this
  component. Removing and adding it will bring the same canvas object
  back. This means you can send the canvas to the worker once, and then
  let the worker deal with it after that by id.
  
  TODO: use an LRU cache, and when evicted emit an event
  so that we can clean up on the worker too.
  Also since you can't change the width/height after transfering
  control to the worker, we should treat the width and height as part
  of the id.
*/
const canvasFromId = new Map();

export default {
  name: "AddressableCanvas",
  emits: ["new"],
  props: {
    id: {
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
    this.$el.appendChild(this.upsertCanvasById(this.id));
  },
  methods: {
    upsertCanvasById(id) {
      let canv = canvasFromId.get(id);
      if (!canv) {
        canv = document.createElement("canvas");
        canv.width = this.width;
        canv.height = this.height;
        this.$emit("new", canv);
        canvasFromId.set(id, canv);
      } else {
        if (canv.width !== this.width || canv.height !== this.height) {
          throw new Error(
            "AddressableCanvas: changing width/height isn't permitted, but see note at top of component"
          );
        }
      }
      return canv;
    },
  },
  watch: {
    id(newId, oldId) {
      this.$el.replaceChild(
        this.upsertCanvasById(newId),
        this.upsertCanvasById(oldId)
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
