import { VirtualCanvas } from './canvas';
import { setPath } from './event'
import store from '../store'
import { createPattern } from './pattern'
import ImageEvent from './imageEvent'
const cursor = {
  height:25,
  width:2
}
// shape形状的大小
const defaultSide = 100
// 控制点矩形的大小
const cSide = 20
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
export const move = {
  async 'qianbi'(this:VirtualCanvas,e:MouseEvent){
    const { x, y } = this.ctxPos
    const lineColor = store.state.lineColor
    if(/\#/g.test(lineColor)) { 
      this.cloneCtx.strokeStyle = lineColor
    }else{
      const p = await createPattern(this.cloneCtx, 'images/'+ lineColor+'.png',40,40)
      this.cloneCtx.strokeStyle = p
    }
      
    this.cloneCtx.lineTo(x,y)
    this.cloneCtx.stroke()
    this.updateCanvas()
  },
  async 'hengxian'(this:VirtualCanvas,e:MouseEvent){
    this.applySnapshot()
    this.cloneCtx.beginPath()
    const { x, y } = this.downPos
    const { x:x1, y:y1 } = this.ctxPos
    const lineColor = store.state.lineColor
    if(/\#/g.test(lineColor)) { 
      this.cloneCtx.strokeStyle = lineColor
    }else{
      const p = await createPattern(this.cloneCtx, 'images/'+ lineColor+'.png',40,40)
      this.cloneCtx.strokeStyle = p
    }
    this.cloneCtx.moveTo(x,y)
    this.cloneCtx.lineTo(x1,y1)
    this.cloneCtx.stroke()
    this.update()
  },
  'ziti'(this:VirtualCanvas,e:MouseEvent) {},
  tuxing(this:VirtualCanvas,e:MouseEvent){},
  qingchu(this:VirtualCanvas,e:MouseEvent){
    const r = 10
    const { x,y } = this.ctxPos
    this.applySnapshot()
    this.cloneCtx.save()
    this.cloneCtx.beginPath()
    this.cloneCtx.arc(x-r/2,y-r/2,r,0,Math.PI*2,false)
    this.cloneCtx.clip()
    this.cloneCtx.clearRect(0,0,this.width,this.height)
    this.saveSnapshot()
    this.cloneCtx.arc(x-r/2,y-r/2,r+2,0,Math.PI*2,false)
    this.cloneCtx.stroke()
    this.cloneCtx.beginPath()
    this.cloneCtx.arc(x-r/2,y-r/2,2,0,Math.PI*2,false)
    this.cloneCtx.fillStyle = 'red'
    this.cloneCtx.fill()
    this.update()
    this.cloneCtx.restore()
    // this.update()
  },
  shezhi(this:VirtualCanvas,e:MouseEvent){},
  'left-copy'(this:VirtualCanvas,e:MouseEvent){},
  right(this:VirtualCanvas,e:MouseEvent){},
  daoru(this:VirtualCanvas,e:MouseEvent){
    const { direction } = store.state
    ImageEvent[direction].call(this,e)
  },
  daochu(this:VirtualCanvas,e:MouseEvent){},
  shanchu(this:VirtualCanvas,e:MouseEvent){},
  // 图形操作
  figure:{
    'move'(this:VirtualCanvas,e:MouseEvent){
      // 只有图形条件下才能移动
      if(store.state.operate === 'tuxing'){
        this.updateCtxPos(e)
        const diffX = this.ctxPos.x - this.downPos.x;
        const diffY = this.ctxPos.y - this.downPos.y
        // 移动的那个图形
        const shape = store.state.shape
        this.applyShapeImageData()
        setPath.call(this,store.state.shapePos.x + diffX,store.state.shapePos.y+diffY)
      }
    },
    'nw-resize'(this:VirtualCanvas,e:MouseEvent){},
    'ne-resize'(this:VirtualCanvas,e:MouseEvent){
      this.updateCtxPos(e)
      changeSide.call(this)
      // this.applyShapeImageData()
    },
    'se-resize'(this:VirtualCanvas,e:MouseEvent){},
    'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
  }
}
function changeSide(this:VirtualCanvas) {
  const diffX = this.ctxPos.x - this.downPos.x;
  const shape = store.state.shape
  const { x,y,side } = store.state.shapePos
  this.applyShapeImageData()
  shapeEvent[shape].call(this,x,y,side + diffX);
  // shapeControl[shape].call(this,x,y,side+diffX);
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
export const up = {
  'qianbi'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'hengxian'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'ziti'(this:VirtualCanvas){

  },
  tuxing(this:VirtualCanvas){
    
  },
  qingchu(this:VirtualCanvas){
    // 清除鼠标
    this.applySnapshot()
    this.update()
  },
  shezhi(this:VirtualCanvas,e:MouseEvent){},
  'left-copy'(this:VirtualCanvas,e:MouseEvent){},
  right(this:VirtualCanvas,e:MouseEvent){},
  daoru(this:VirtualCanvas,e:MouseEvent){},
  daochu(this:VirtualCanvas,e:MouseEvent){},
  shanchu(this:VirtualCanvas,e:MouseEvent){},
  // 图形操作
  figure:{
    'move'(this:VirtualCanvas,e:MouseEvent){
      this.saveSnapshot()
      // 更新当前图形的位置
      const diffX = this.ctxPos.x - this.downPos.x;
      const diffY = this.ctxPos.y - this.downPos.y
      store.commit('setShapePos',{x:store.state.shapePos.x + diffX,y:store.state.shapePos.y + diffY,side:store.state.shapePos.side})
    },
    'nw-resize'(this:VirtualCanvas,e:MouseEvent){},
    'ne-resize'(this:VirtualCanvas,e:MouseEvent){
      this.saveShapeImageData()
    },
    'se-resize'(this:VirtualCanvas,e:MouseEvent){},
    'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
  }
}

export const shapeEvent = {
  sibianxing(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide) {
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.lineWidth = 2
    path.moveTo(cX - side/(2*Math.tan(Math.PI/3)),cY-side/2)
    path.lineTo(cX + side * Math.cos(Math.PI/6),cY-side/2)
    path.lineTo(cX+ side * Math.cos(Math.PI/6) - side / 2,cY+side/2)
    path.lineTo(cX - side/(2*Math.tan(Math.PI/3))-side/2,cY+side/2)
    path.closePath()
    this.cloneCtx.stroke(path)
    this.update()
    return path
  },
  sibianxing1(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide) {
    this.cloneCtx.beginPath()
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.lineWidth = 2
    path.rect(cX-side/2,cY-side/2,side,side)
    this.cloneCtx.stroke(path)
    this.update()
    return path
  },
  sanjiaoxing(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide){
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.lineWidth = 2 
    path.moveTo(cX,cY-side)
    path.lineTo(cX+Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    path.lineTo(cX-Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    path.closePath()
    this.cloneCtx.stroke(path)
    this.update()
    return path
  }
}

export const shapeControl = {
  sibianxing(this:VirtualCanvas,x:number,y:number,side:number=defaultSide){
  },
  sibianxing1(this:VirtualCanvas,x:number,y:number,side:number=defaultSide){
    this.cloneCtx.beginPath()
    const { width,height } = this
    const p1 = new Path2D()
    const p2 = new Path2D()
    const p3 = new Path2D()
    const p4 = new Path2D()
    p1.rect(x - side/2-cSide/2,y-side/2-cSide/2,cSide,cSide)
    p2.rect(x + side/2-cSide/2,y-side/2-cSide/2,cSide,cSide)
    p3.rect(x + side/2-cSide/2,y+side/2-cSide/2,cSide,cSide)
    p4.rect(x - side/2-cSide/2,y+side/2-cSide/2,cSide,cSide)
    this.cloneCtx.strokeStyle = 'blue'
    this.cloneCtx.stroke(p1)
    this.cloneCtx.stroke(p2)
    this.cloneCtx.stroke(p3)
    this.cloneCtx.stroke(p4)
    this.update()
    return {
      'nw-resize':p1,
      'ne-resize':p2,
      'se-resize':p3,
      'sw-resize':p4,
    }
  },
  sanjiaoxing(this:VirtualCanvas,x:number,y:number,side:number=defaultSide){
    const { width,height } = this
    const path = new Path2D()
    return path
  },
}