<template>
  <div>
    <!-- <canvas id="canvas" width="600" height="500"></canvas> -->
    <toolbar></toolbar>
  </div>
</template>
<script>
import toolbar from './components/toolbar/index.vue'
export default {
  components:{
    toolbar
  },
  mounted() {
    // 使用vue模版中的dom需要等dom加载完后执行 mian.ts 中的代码
    // 如果使用 index.html 模版中的dom，可以放到 script 中的顶端位置
    // import('./main')
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
</style>