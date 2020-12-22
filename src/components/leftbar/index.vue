<template>
  <div class="leftbar bg-theme hp100">
    <div class="content">
      <div class="flex align-center">
        <el-input v-model="width" placeholder="宽"></el-input>
        <svg-icon style="font-size:20px" :icon-class="lock"></svg-icon>
        <el-input v-model="height" placeholder="高"></el-input>
      </div>
      <h4>背景颜色选择</h4>
      <el-color-picker @change="onColorPickerInput"></el-color-picker>
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
        color:'',
        isLoad:false
      }
    },
    computed:{
      lock() {
        return this.isOpen ? 'kaisuo' : 'suo'
      }
    },
    methods: {
      onColorPickerInput(color) {
        if(this.$instance) {
          const {updateBg} = this.$instance
          updateBg(color)
        }
      }
    }
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
