<template>
  <div class="leftbar bg-theme hp100">
    <div class="content">
      <div class="flex align-center">
        <v-text-field
          v-model="width"
          class="w70"
          label="Regular"
          single-line
          placeholder="宽"
        ></v-text-field>
        <svg-icon style="font-size:20px" :icon-class="lock"></svg-icon>
        <v-text-field
          v-model="height"
          class="w70"
          label="Regular"
          single-line
          placeholder="高"
        ></v-text-field>
      </div>
      <h4>背景颜色选择</h4>
      <div data-app>
        <v-color-picker
          dot-size="25"
          show-swatches
          swatches-max-height="200"
        ></v-color-picker>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',

    data() {
      return {
        // 画板尺寸
        width:'',
        height:'',
        isOpen:false,
        color:''
      }
    },
    computed:{
      lock() {
        return this.isOpen ? 'kaisuo' : 'suo'
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
  background-color: #fff;
  height: 80%;
  border-radius: 8px;
}
</style>
