import { VirtualCanvas } from './canvas';
import store from '../store/index'
import { down,move,up,shapeEvent } from './eventMap'
export function mousedown(this:VirtualCanvas,e:MouseEvent){
  console.log('down')
      const operate  = store.state.operate
      this.updateCtxPos(e)
      this.updateMousedownPos(e)
      // 当鼠标 mousedown 时候，更新画笔的起点
      down[operate].call(this,e)
      const { x, y } = this.ctxPos
      this.cloneCtx.beginPath()
      this.cloneCtx.lineWidth = store.state.lineWidth
      this.cloneCtx.moveTo(x,y)
      // 标记是否开始绘画
      this.isStart = true
}
export function mousemove(this:VirtualCanvas,e:MouseEvent){
  if(this.isStart) {
    const operate  = store.state.operate
    this.updateCtxPos(e)
    move[operate].call(this,e)
  }
}
export function mouseup(this:VirtualCanvas,e:MouseEvent){
  this.isStart = false
  const operate  = store.state.operate
  up[operate].call(this)
}
export function drawShape(this:VirtualCanvas) {
  const shape = store.state.shape
  console.log('1')
  shapeEvent[shape].call(this)
}