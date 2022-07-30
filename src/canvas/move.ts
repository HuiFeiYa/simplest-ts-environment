import { VirtualCanvas } from './canvas';
import store from '../store'
import { createPattern } from './pattern'
import ImageEvent from './imageEvent'
import { setPath } from './event'
import { shapeEvent } from './eventMap'
function changeSide(this:VirtualCanvas) {
  const diffX = this.ctxPos.x - this.downPos.x;
  const shape = store.state.shape
  const { x,y,side } = store.state.shapePos
  this.applyShapeImageData()
  shapeEvent[shape].call(this,x,y,side + diffX);
  // shapeControl[shape].call(this,x,y,side+diffX);
}
export default  {
  async 'qianbi'(this:VirtualCanvas,e:MouseEvent){
    const { x, y } = this.ctxPos
    const lineColor = store.state.lineColor
    this.cloneCtx.save()
    this.cloneCtx.lineWidth = store.state.lineWidth

    if(/\#/g.test(lineColor)) { 
      this.cloneCtx.strokeStyle = lineColor
    }else{
      const p = await createPattern(this.cloneCtx, 'images/'+ lineColor+'.png',40,40)
      this.cloneCtx.strokeStyle = p
    }
      
    this.cloneCtx.lineTo(x,y)
    this.cloneCtx.stroke()
    this.updateCanvas()
    this.cloneCtx.restore()
  },
  async 'hengxian'(this:VirtualCanvas,e:MouseEvent){
    this.applySnapshot()
    this.cloneCtx.beginPath()
    this.cloneCtx.save()
    this.cloneCtx.lineWidth = store.state.lineWidth

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
    this.cloneCtx.restore()
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