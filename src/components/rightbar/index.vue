<template>
  <div class="rightbar bg-theme hp100">
    <div class="content">
      <svg-icon v-for="item in iconList" :key="item" class="fs20" :icon-class="item" @icon-click="onIconClick"></svg-icon>
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

    methods: {
      onIconClick(val,e) {
        this.$store.commit('setShape',val)
        this.$instance.saveTempImageData()
        this.$instance.drawShape()
      }
    }
  }
</script>

<style lang='less' scoped>
.rightbar{
  width:100px;
  padding:0 10px;
  box-sizing: border-box;
}
.content{
  background-color: #fff;
  height: 80%;
  border-radius: 8px;
  display: flex;
}
</style>
