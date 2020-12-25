import { VirtualCanvas } from './canvas';
import store from '../store'
import { shapeEvent } from './eventMap';
let hasSet = false
const cursor = {
  height:25,
  width:2
}
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
      }
    }, 500);
  },500)
}
// 当点击非选中图形时候重新绘制页面
function drawCurShape(this:VirtualCanvas) {
  if(!store.state.shape) {
     return 
  }
  this.applyShapeImageData()
  // 更新当前图形的位置
  const diffX = this.ctxPos.x - this.downPos.x;
  const diffY = this.ctxPos.y - this.downPos.y
  const { x,y,side } = store.state.shapePos
  store.commit('setShapePos',{x:x + diffX,y:y + diffY,side})
  if(store.state.shape) {
    // 重新绘制图形
    shapeEvent[store.state.shape].call(this,x + diffX,y + diffY,side)
  }
  // 重置path存储
  store.commit('setShape','')
  this.setPath({})
  this.saveShapeImageData()
}
export default {
  qianbi(this:VirtualCanvas,e:MouseEvent) {
    this.updateCtxPos(e)
  },
  hengxian(this:VirtualCanvas,e:MouseEvent){
    this.updateMousedownPos(e)
  },
  ziti(this:VirtualCanvas,e:MouseEvent) {
    if(!hasSet) {
      // 当鼠标重新点击其他位置时候保存当前画板的内容。
      this.shapeData = this.cloneCtx.getImageData(0,0,this.width,this.height)
      blink(this)
      hasSet = true
      store.commit('setCursor',true)
    }
  },
  tuxing(this:VirtualCanvas,e:MouseEvent){
    const { x,y } = this.pos(e)
    for(let path of Object.entries(this.shapePath)) {
      const [key,value] = path;
      // 判断图形时候是否点击到对应的 path
      // @ts-ignore
      if(store.state.shape && this.cloneCtx.isPointInPath(value,x,y)){
        this.canvas.style.cursor = key
        store.commit('setDirection',key)
        return 
      }
      
    }
    // 如果没有选中其中任何一个 path，将 canvas 置为未选中
    this.canvas.style.cursor = 'default'
    // this.applySnapshot()
    drawCurShape.call(this)
    this.update()
    console.log('未选中')
  },
  qingchu(this:VirtualCanvas,e:MouseEvent){},
  shezhi(this:VirtualCanvas,e:MouseEvent){},
  'left-copy'(this:VirtualCanvas,e:MouseEvent){},
  right(this:VirtualCanvas,e:MouseEvent){},
  daoru(this:VirtualCanvas,e:MouseEvent){
    const { x,y } = this.pos(e)
    const { imageWidth } = store.state
    for(let path of Object.entries(this.imagePath)) {
      const [key,value] = path;
      // 判断图形时候是否点击到对应的 path
      // @ts-ignore
      if(store.state.operate === 'daoru' && this.cloneCtx.isPointInPath(value,x,y)){
        this.canvas.style.cursor = key
        store.commit('setDirection',key)
        return 
      }
      
    }
    // 如果没有选中其中任何一个 path，将 canvas 置为未选中
    this.canvas.style.cursor = 'default'
    // 重置画板
    this.applySnapshot()
    // 然后在绘制图形
    this.reDrawImage()
    this.update()
    console.log('未选中图片')
  },
  daochu(this:VirtualCanvas,e:MouseEvent){},
  shanchu(this:VirtualCanvas,e:MouseEvent){},
  
}