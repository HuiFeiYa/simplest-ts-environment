import { VirtualCanvas } from './canvas';
import store from '../store/index'
export default {
  // 更新的是图片的起点位置
  move(this:VirtualCanvas,e:MouseEvent) {
    const { x,y } = store.state.imagePos
    this.updateCtxPos(e)
    const diffX = this.ctxPos.x - this.downPos.x;
    const diffY = this.ctxPos.y - this.downPos.y
    this.applySnapshot()
    store.commit('setImagePos',{x:x+diffX,y:y+diffY})
    this.reDrawImage()
    this.update()
    // 重新更新老的位置
    this.updateMousedownPos(e)
    // 绘制控制框之前将 canvas 画板保存
    this.drawImageControl()
  },
  // 更新宽高，其实位置的xy
  'nw-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth-diffX,imageHeight-diffX,{x:x+diffX,y:y+diffX})
  },
  // 更新宽高和起始位置的y
  'ne-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth+diffX,imageHeight+diffX,{x,y:y-diffX})
  },
  // 更新宽高
  'se-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth+diffX,imageHeight+diffX,{x,y})
  },
  // 更新宽高,x
  'sw-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth-diffX,imageHeight-diffX,{x:x+diffX,y})
  },
  // 四条边的中心点
  // 改变高度和，左上角的起始点
  'n-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth,imageHeight-diffY,{x,y:y+diffY})
  },
  // 只改变宽度
  'e-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth + diffX,imageHeight,{x,y})
  },
  // 只改变高度
  's-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth,imageHeight+diffY,{x,y})
  },
  // 改变宽度和左上角的起始位置
  'w-resize'(this:VirtualCanvas,e:MouseEvent){
    const { diffX,diffY } = calcDiffDistance.call(this,e)
    const { imageHeight,imageWidth,imagePos:{x,y} } = store.state
    updateImageSize.call(this,e,imageWidth-diffX,imageHeight,{x:x+diffX,y})
  },
}
function calcDiffDistance(this:VirtualCanvas,e:MouseEvent) {
  const { imagePos:{x,y}} = store.state
  this.updateCtxPos(e)
  const diffX = this.ctxPos.x - this.downPos.x;
  const diffY = this.ctxPos.y - this.downPos.y
  return {
    diffX,
    diffY
  }
}
function updateImageSize(this:VirtualCanvas,e:MouseEvent,w:number,h:number,pos:{x:number,y:number}) {
  this.applySnapshot()
  store.commit('setImageHeight',h)
  store.commit('setImageWidth',w)
  store.commit('setImagePos',pos)
  this.update()
  // 重新更新老的位置
  this.reDrawImage()
  this.updateMousedownPos(e)
  // 绘制控制框之前将 canvas 画板保存
  this.drawImageControl()
}