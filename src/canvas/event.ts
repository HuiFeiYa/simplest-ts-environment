import { VirtualCanvas } from './canvas';
export function mousedown(this:VirtualCanvas,e:MouseEvent){
      // 当鼠标 mousedown 时候，更新画笔的起点
      this.updateCtxPos(e)
      const { x, y } = this.ctxPos
      this.cloneCtx.beginPath()
      this.cloneCtx.moveTo(x,y)
      // 标记是否开始绘画
      this.isStart = true
}
export function mousemove(this:VirtualCanvas,e:MouseEvent){
  if(this.isStart) {
    this.updateCtxPos(e)
    const { x, y } = this.ctxPos
    this.cloneCtx.lineTo(x,y)
    this.cloneCtx.stroke()
    this.updateCanvas()
  }
}
export function mouseup(this:VirtualCanvas,e:MouseEvent){
  this.isStart = false
}