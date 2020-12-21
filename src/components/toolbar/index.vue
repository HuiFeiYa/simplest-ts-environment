<template>
  <div class="toolbar">
    <div>速写板</div>
    <div class="operate lh20">
        <svg-icon v-for="item in iconList" :key="item" :icon-class="item"></svg-icon>
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
.operate{


}
</style>
