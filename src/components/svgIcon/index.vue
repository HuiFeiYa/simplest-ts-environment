<template>
  <svg :class="svgClass" class="icon" aria-hidden="true" @click="onIconClick">
    <use :href="iconName" />
  </svg>
</template>
<script>
export default {
  props:{
    iconClass:{
      type:String,
      default:''
    },
    className:{
      type:String,
      default:''
    }
  },
  computed:{
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      return this.className ? 'svg-icon' : ('svg-icon' + this.className)
    }
  },
  methods:{
    onIconClick() {
      this.$emit('icon-click',this.iconClass)
    }
  }
}
</script>
<style lang='less'>
.icon {
  width: 1.2em; height: 1.2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  user-select: none;
}

// 使用方法在 index.html 中引入在线js <script src="//at.alicdn.com/t/font_1212269_rxke3jpoo9r.js"></script>
// 使用格式
/*
  <svg class="icon" aria-hidden="true">
    <use xlink:href="#iconduigouxuanzhong" />
  </svg>
*/

// 如果使用 symbol 图片未生效，那么是未生成最新的js代码
</style>