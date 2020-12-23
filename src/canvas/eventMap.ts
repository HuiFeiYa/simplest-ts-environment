import { VirtualCanvas } from './canvas';
import { setPath } from './event'
import store from '../store'
const cursor = {
  height:25,
  width:2
}
// shape形状的大小
const side = 100
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
  },
  tuxing(this:VirtualCanvas,e:MouseEvent){
    const { x,y } = this.pos(e)
    console.log(x,y)
    for(let path of Object.entries(this.shapePath)) {
      const [key,value] = path;
      // 判断图形时候是否点击到对应的 path
      // @ts-ignore
      if(this.cloneCtx.isPointInPath(value,x,y)){
        this.canvas.style.cursor = key
        store.commit('setDirection',key)
        return 
      }
      
    }
    // 如果没有选中其中任何一个 path，将 canvas 置为未选中
    this.canvas.style.cursor = 'default'
    this.applySnapshot()
    this.update()
    console.log('未选中')
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
  'ziti'(this:VirtualCanvas) {},
  tuxing(this:VirtualCanvas,e:MouseEvent){},
  // 图形操作
  figure:{
    'move'(this:VirtualCanvas,e:MouseEvent){
      this.updateCtxPos(e)
      const diffX = this.ctxPos.x - this.downPos.x;
      const diffY = this.ctxPos.y - this.downPos.y
      // 移动的那个图形
      const shape = store.state.shape
      this.applyTempImageData()
      setPath.call(this,store.state.shapePos.x + diffX,store.state.shapePos.y+diffY)
      // 更新图形的位置
      // shapeEvent[shape].call(this,store.state.shapePos.x + diffX,store.state.shapePos.y+diffY)
      // shapeControl[shape].call(this,store.state.shapePos.x + diffX,store.state.shapePos.y+diffY)
      // console.log('pos',this.ctxPos,this.downPos)
    },
    'nw-resize'(this:VirtualCanvas,e:MouseEvent){},
    'ne-resize'(this:VirtualCanvas,e:MouseEvent){},
    'se-resize'(this:VirtualCanvas,e:MouseEvent){},
    'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
  }
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
    this.saveSnapshot()
    // 更新当前图形的位置
    const diffX = this.ctxPos.x - this.downPos.x;
    const diffY = this.ctxPos.y - this.downPos.y
    store.commit('setShapePos',{x:store.state.shapePos.x + diffX,y:store.state.shapePos.y + diffY})
  },
  // 图形操作
  figure:{
    'move'(this:VirtualCanvas,e:MouseEvent){
      this.updateCtxPos(e)
      const diffX = this.ctxPos.x - this.downPos.x;
      const diffY = this.ctxPos.y - this.downPos.y
      this.applyTempImageData()
      // 移动的那个图形
      const shape = store.state.shape
      // 更新图形的位置
      shapeEvent[shape].call(this,store.state.shapePos.x + diffX,store.state.shapePos.y+diffY)

      console.log('pos',this.ctxPos,this.downPos)
    },
    'nw-resize'(this:VirtualCanvas,e:MouseEvent){},
    'ne-resize'(this:VirtualCanvas,e:MouseEvent){},
    'se-resize'(this:VirtualCanvas,e:MouseEvent){},
    'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
  }
}

export const shapeEvent = {
  sibianxing(this:VirtualCanvas,cX:number,cY:number) {
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.lineWidth = 2
    this.cloneCtx.moveTo(cX - side/(2*Math.tan(Math.PI/3)),cY-side/2)
    this.cloneCtx.lineTo(cX + side * Math.cos(Math.PI/6),cY-side/2)
    this.cloneCtx.lineTo(cX+ side * Math.cos(Math.PI/6) - side / 2,cY+side/2)
    this.cloneCtx.lineTo(cX - side/(2*Math.tan(Math.PI/3))-side/2,cY+side/2)
    this.cloneCtx.closePath()
    this.cloneCtx.stroke()
    this.update()
    return path
  },
  sibianxing1(this:VirtualCanvas,cX:number,cY:number) {
    this.cloneCtx.beginPath()
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.lineWidth = 2
    path.rect(cX-side/2,cY-side/2,side,side)
    this.cloneCtx.stroke(path)
    this.update()
    return path
  },
  sanjiaoxing(this:VirtualCanvas,cX:number,cY:number){
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.lineWidth = 2 
    this.cloneCtx.moveTo(cX,cY-side)
    this.cloneCtx.lineTo(cX+Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    this.cloneCtx.lineTo(cX-Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    this.cloneCtx.closePath()
    this.cloneCtx.stroke()
    this.update()
    return path
  }
}

export const shapeControl = {
  sibianxing(this:VirtualCanvas,x:number,y:number){
    // const { width,height } = this
    // const path = new Path2D()
    // const x = width / 2;
    // const y = height / 2
    // return path
  },
  sibianxing1(this:VirtualCanvas,x:number,y:number){
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
  sanjiaoxing(this:VirtualCanvas,x:number,y:number){
    const { width,height } = this
    const path = new Path2D()
    return path
  },
}