<template>
  <div class="hp100">
    <!-- <canvas id="canvas" width="600" height="500"></canvas> -->
    <toolbar @icon-click="onIconClick"></toolbar>
    <div class="hp100 main">
      <leftbar></leftbar>
      <draw></draw>
      <rightbar></rightbar>
    </div>
  </div>
</template>
<script>
import toolbar from './components/toolbar/index.vue'
import leftbar from './components/leftbar/index.vue'
import rightbar from './components/rightbar/index.vue'
import draw from './components/draw/index.vue'
export default {
  components:{
    toolbar,
    leftbar,
    rightbar,
    draw
  },
  methods:{
    onIconClick(type) {
      console.log(type)
    }
  }
}
</script>
<style lang='less'>
*{
  margin:0;
  padding: 0;
}
.box{
  background-color: red;
}
html,body{
  width:100%;
  height: 100%;
  overflow: hidden;
}
.main{
  display: flex;
}
</style>