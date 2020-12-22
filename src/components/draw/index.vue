<template>
  <div class="draw">
    <canvas id="canvas" width="600" height="600"></canvas>
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
      }
    },

    methods: {}
  }
</script>

<style lang='scss' scoped>
.draw{
  flex-grow: 1;
  background-color: #eee;
}
#canvas{
  background-color: #fff;
}
</style>
