import { VirtualCanvas } from './canvas';
import store from '../store'
const cursor = {
  height:25,
  width:2
}
let hasSet = false
function blink(_this:any) {
  const { width,height } = cursor
  _this.cloneCtx.fillStyle = '#000'
  _this.cloneCtx.fillRect(_this.downPos.x-width/2,_this.downPos.y-height/2,width,height)
  _this.updateCanvas()
  let t = setTimeout(()=>{
    _this.applySnapshot()
    _this.update()
    let k = setTimeout(() => {
      clearTimeout(t)
      if(store.state.isCusor) {
        blink(_this)
      }else{
        clearTimeout(k)
        hasSet = false
        // store.commit('setCursor',false)
      }
    }, 500);
  },500)
}
// 此处的事件类型和 toolbar 中的图标名保持一致
export const down = {
  qianbi(this:VirtualCanvas,e:MouseEvent) {
    this.updateCtxPos(e)
  },
  hengxian(this:VirtualCanvas,e:MouseEvent){
    this.updateMousedownPos(e)
  },
  ziti(this:VirtualCanvas,e:MouseEvent) {
    if(!hasSet) {
      // 当鼠标重新点击其他位置时候保存当前画板的内容。
      this.tempData = this.cloneCtx.getImageData(0,0,this.width,this.height)
      blink(this)
      hasSet = true
      store.commit('setCursor',true)
    }
  }
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
    this.update()
  },
  'ziti'(this:VirtualCanvas) {}
}
export const up = {
  'qianbi'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'hengxian'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'ziti'(this:VirtualCanvas){

  }
}