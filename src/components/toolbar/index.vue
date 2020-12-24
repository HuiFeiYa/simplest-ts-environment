<template>
  <div class="toolbar">
    <div class="left">速写板</div>
    <div class="operate lh20">
        <svg-icon class="mr10"  v-for="item in iconList" :key="item" :icon-class="item" :class="{'color-red':curIcon === item}" @icon-click="onIconClick"></svg-icon>
    </div>
    <el-dialog
      title="设置导出图片"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <h4>选择导出图片类型</h4>
      <el-select v-model="imageType">
        <el-option v-for="item in imageTypeList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <h4>设置导出尺寸</h4>
      <div class="flex">
        <el-input v-model="width" placeholder="宽"></el-input>
        <svg-icon style="font-size:40px" icon-class="kaisuo"></svg-icon>
        <el-input v-model="height" placeholder="高"></el-input>
      </div>
      <h4>设置导出文件名</h4>
      <el-input v-model="filename"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSureClick">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { iconList } from './config'
  export default {
    name: '',

    data() {
      return {
        iconList,
        imageTypeList:[
          'png','jpg'
        ],
        imageType:'png',
        centerDialogVisible:false,
        width:0,
        height:0,
        filename:'下载'
      }
    },
    mounted() {
      this.width = this.canvasRect.width
      this.height = this.canvasRect.height
    },
    computed:{
      curIcon() {
        return this.$store.state.operate
      },
      head() {
        return this.$store.state.head
      },
      canvasRect() {
        return this.$store.state.canvasRect
      }
    },
    methods: {
      onIconClick(val) {
        switch (val) {
          case 'left-copy':
            this.$instance.back()
            break;
          case 'right':
            this.$instance.forward()
          case 'daochu':
            this.centerDialogVisible = true
          default:
            break;
        }
        this.$store.commit('setOperate',val)
      },
      onSureClick() {
        this.centerDialogVisible = false
        this.$instance.download(this.width,this.height,this.imageType,this.filename)

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
