<template>
  <div class="draw">
    <canvas id="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
      }
    },
    computed:{
      width() {
        return this.$store.state.canvasRect.width
      },
      height() {
        return this.$store.state.canvasRect.height
      },
    },
    methods: {}
  }
</script>

<style lang='scss' scoped>
.draw{
  flex-grow: 1;
  background-color: #eee;
  overflow: hidden;
}
#canvas{
  background-color: #fff;
}
</style>
