<template>
  <div class="toolbar">
    <div class="left">速写板</div>
    <div class="operate lh20">
        <svg-icon class="mr10"  v-for="item in iconList" :key="item" :icon-class="item" :class="{'color-red':curIcon === item}" @icon-click="onIconClick"></svg-icon>
    </div>
  </div>
</template>

<script>
  import { iconList } from './config'
  export default {
    name: '',

    data() {
      return {
        iconList
      }
    },
    computed:{
      curIcon() {
        return this.$store.state.operate
      }
    },
    methods: {
      onIconClick(val) {
        this.$store.commit('setOperate',val)
      }
    }
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
.color-red{
  color:red;
  background-color: #fff;
}
</style>
