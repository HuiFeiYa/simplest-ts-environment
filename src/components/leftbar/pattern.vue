<template>
  <div>
    <img class="icon" v-for="path in list" :key="path" :src="'/images/'+path+'.png'" alt="" @click="onClick(path)">
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
        list:[
          'gongji','nainiu','niu','tuzi','yang'
        ]
      }
    },

    methods: {
      onClick(path){
        this.$emit('click',path)
      }
    }
  }
</script>

<style lang='less' scoped>
.icon{
  width:60px;
  height: 60px;
}
</style>
