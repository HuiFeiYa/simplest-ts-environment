<template>
  <div class="toolbar">
    <div class="left">速写板</div>
    <div class="operate lh20">
        <svg-icon class="mr10" v-for="item in iconList" :key="item" :icon-class="item" v-on="$listeners"></svg-icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
        iconList:['qianbi','hengxian','ziti']
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
.toolbar{
  background-color: #343a40;
  color:#fff;
  padding:5px 10px;
  display: flex;
  align-items: center;
}
.left{
  width:200px;
  font-size:20px;
}
.operate{


}
</style>
