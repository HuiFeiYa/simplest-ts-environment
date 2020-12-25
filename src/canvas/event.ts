import { VirtualCanvas } from './canvas';
import store from '../store/index'
import { down,move,up,shapeEvent,shapeControl } from './eventMap'
export function mousedown(this:VirtualCanvas,e:MouseEvent){
      const operate  = store.state.operate
      this.updateCtxPos(e)
      this.updateMousedownPos(e)
      // 当鼠标 mousedown 时候，更新画笔的起点
      down[operate].call(this,e)
      const { x, y } = this.ctxPos
      this.cloneCtx.beginPath()
      this.cloneCtx.moveTo(x,y)
      // 标记是否开始绘画
      this.isStart = true
}
export function mousemove(this:VirtualCanvas,e:MouseEvent){
  if(this.isStart) {
    const {operate,direction}  = store.state
    this.updateCtxPos(e)
    move[operate].call(this,e)
    if(store.getters.isMoveShape) {
      move.figure[direction].call(this,e)
    }
  }
}
export function mouseup(this:VirtualCanvas,e:MouseEvent){
  this.isStart = false
  const {operate,direction}  = store.state
  if(store.getters.isMoveShape) {
    up.figure[direction].call(this,e)
  }else{
    up[operate].call(this)
  }
}
export function drawShape(this:VirtualCanvas) {
  const { width,height } = this
  const cX = width / 2;
  const cY = height / 2
  store.commit('setShapePos',{x:cX,y:cY,side:store.state.shapePos.side})
  setPath.call(this,cX,cY);
}
export function setPath(this:VirtualCanvas,cX:number,cY:number) {
  const shape = store.state.shape
  if(!shape) return 
  const move = shapeEvent[shape].call(this,cX,cY)
  this.saveSnapshot()
  // const control = shapeControl[shape].call(this,cX,cY)
  // 将path存储到 VirtualCanvas.shapePath 中
  this.setPath(Object.assign({move}))
}