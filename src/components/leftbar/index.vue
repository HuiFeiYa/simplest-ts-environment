<template>
  <div class="leftbar bg-theme hp100">
    <div class="content">
      <template v-if="isShowConfig">
        <div class="flex align-center">
          <el-input v-model="width" placeholder="宽"></el-input>
          <svg-icon style="font-size:20px" :icon-class="lock" @icon-click="onIconClick"></svg-icon>
          <el-input :disabled="!isOpen" v-model="height" placeholder="高" min="300" max="800"></el-input>
        </div>
        <h4>背景颜色选择</h4>
        <el-color-picker v-model="bgColor" @change="onColorPickerInput"></el-color-picker>
        <Icon @click="onBgPatternClick"></Icon>
      </template>
      <template v-if="isShowHengxian || isShowQianbi">
        <h4>线宽</h4>
        <el-input-number v-model="lineWidth" :min="1" :max="10" label="描述文字"></el-input-number>
      </template>
    </div>
  </div>
</template>

<script>
  import Icon from './pattern.vue'
  export default {
    name: '',
    components:{
      Icon
    },
    data() {
      return {
        isOpen:false,
        color:'',
        isLoad:false
      }
    },
    computed:{
      width:{
        get() {
          return this.$store.state.canvasRect.width
        },
        set(val) {
          this.$store.commit('setCanvasRectWidth',val)
          // 锁住的时候是联动的
          if(!this.isOpen){
            this.$store.commit('setCanvasRectHeight',val)
          }
        }
      },
      height:{
        get() {
          return this.$store.state.canvasRect.height
        },
        set(val) {
          this.$store.commit('setCanvasRectHeight',val)
        }
      },
      operate() {
        return this.$store.state.operate
      },
      isShowConfig() {
        return this.operate === 'shezhi'
      },
      isShowQianbi(){
        return this.operate === 'qianbi'
      },
      isShowHengxian() {
        return this.operate === 'hengxian'
      },
      isShow() {
        return this.isShowConfig || this.isShowQianbi || this.isShowHengxian
      },
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
      onIconClick() {
        this.isOpen = !this.isOpen
      },
      onBgPatternClick(val) {
        this.$store.commit('setBgColor',val)
        this.$instance.update(true)
      },
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
  flex-shrink: 0;
}
.content{
  background-color: #fff;
  height: 80%;
  border-radius: 8px;
}
</style>
