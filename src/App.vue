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
  mounted() {
    // 使用vue模版中的dom需要等dom加载完后执行 mian.ts 中的代码
    // 如果使用 index.html 模版中的dom，可以放到 script 中的顶端位置
    // import('./main')
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