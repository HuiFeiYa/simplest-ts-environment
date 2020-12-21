<template>
  <div class="leftbar bg-theme hp100">
    <div class="content">
      <v-btn block>
    Block Button
  </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
.leftbar{
  width:200px;
  padding:0 10px;
  box-sizing: border-box;
}
.content{
  background-color: #1b1e21;
  height: 80%;
  border-radius: 8px;
}
</style>
