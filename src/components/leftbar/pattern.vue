<template>
  <div>
    <img class="icon" v-for="(path,index) in list" :key="path" :src="'/images/'+path+'.png'" alt="" :class="{select:index === selectIndex}" @click="onClick(path,index)">
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
        list:[
          'gongji','nainiu','niu','tuzi','yang'
        ],
        selectIndex:-1
      }
    },

    methods: {
      onClick(path,index){
        this.$emit('click',path)
        this.selectIndex = index
      }
    }
  }
</script>

<style lang='less' scoped>
.icon{
  width:50px;
  height: 50px;
  border:1px solid transparent;
}
.select{
  border:1px solid orange;
}
</style>
