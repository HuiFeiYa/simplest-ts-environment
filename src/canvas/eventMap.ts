import { VirtualCanvas } from './canvas';
// 此处的事件类型和 toolbar 中的图标名保持一致
export const down = {
  qianbi(this:VirtualCanvas,e:MouseEvent) {
    this.updateCtxPos(e)
  },
  hengxian(this:VirtualCanvas,e:MouseEvent){
    this.updateMousedownPos(e)
  },
  ziti(this:VirtualCanvas,e:MouseEvent) {}
}
export const move = {
  'qianbi'(this:VirtualCanvas,e:MouseEvent){
    const { x, y } = this.ctxPos
    this.cloneCtx.lineTo(x,y)
    this.cloneCtx.stroke()
    this.updateCanvas()
  },
  'hengxian'(this:VirtualCanvas,e:MouseEvent){
    this.applySnapshot()
    this.cloneCtx.beginPath()
    const { x, y } = this.downPos
    const { x:x1, y:y1 } = this.ctxPos
    this.cloneCtx.moveTo(x,y)
    this.cloneCtx.lineTo(x1,y1)
    this.cloneCtx.stroke()
    this.draw()
  },
  'ziti'(this:VirtualCanvas) {}
}
export const up = {

}