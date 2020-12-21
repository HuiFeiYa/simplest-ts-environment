<template>
  <div>
    <toolbar></toolbar>
    <div class="box">1</div>
  </div>
</template>
<script>
import './main'
import toolbar from './components/toolbar.vue'
export default {
  components:{
    toolbar
  }

}
</script>
<style lang='less'>
.box{
  background-color: red;
}
</style>