<template>
  <div class="leftbar bg-theme hp100">
    <div class="content">
      <div class="flex align-center">
        <el-input v-model="width" placeholder="宽"></el-input>
        <svg-icon style="font-size:20px" :icon-class="lock"></svg-icon>
        <el-input v-model="height" placeholder="高"></el-input>
      </div>
      <h4>背景颜色选择</h4>
      <el-color-picker v-model="bgColor" @change="onColorPickerInput"></el-color-picker>
      <h4>线宽</h4>
      <el-input-number v-model="lineWidth" :min="1" :max="10" label="描述文字"></el-input-number>
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
      },
      lineWidth:{
        get(){
          return this.$store.state.lineWidth
        },
        set(value){
          this.$store.commit('setLineWidth',value)
        }
      },
      bgColor:{
        get() {
          return this.$store.state.bgColor
        },
        set(val) {
          this.$store.commit('setBgColor',val)
        }
      }
    },
    methods: {
      onColorPickerInput() {
        if(this.$instance) {
          this.$instance.update()
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
