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
  // 下面更新的都是图片的宽高
  'nw-resize'(this:VirtualCanvas,e:MouseEvent){
    const { imagePos:{x,y},imageHeight,imageWidth} = store.state
    this.updateCtxPos(e)
    const diffX = this.ctxPos.x - this.downPos.x;
    const diffY = this.ctxPos.y - this.downPos.y
    this.applySnapshot()
    store.commit('setImageHeight',-diffY + imageHeight)
    store.commit('setImageWidth',-diffX + imageWidth)
    // store.commit('setImagePos',{x:x+diffX,y:y+diffY})
    this.update()
    // 重新更新老的位置
    this.reDrawImage()
    this.updateMousedownPos(e)
    // 绘制控制框之前将 canvas 画板保存
    this.drawImageControl()
  },
  'ne-resize'(this:VirtualCanvas,e:MouseEvent){
  },
  'se-resize'(this:VirtualCanvas,e:MouseEvent){},
  'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
}