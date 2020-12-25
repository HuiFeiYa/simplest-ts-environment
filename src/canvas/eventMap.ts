import { VirtualCanvas } from './canvas';

export { default as down } from './down'
export { default as move } from './move'
export { default as up } from './up'
// shape形状的大小
const defaultSide = 100
// 控制点矩形的大小
const cSide = 20

export const shapeEvent = {
  sibianxing(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide) {
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.save()
    this.cloneCtx.lineWidth = 2
    path.moveTo(cX - side/(2*Math.tan(Math.PI/3)),cY-side/2)
    path.lineTo(cX + side * Math.cos(Math.PI/6),cY-side/2)
    path.lineTo(cX+ side * Math.cos(Math.PI/6) - side / 2,cY+side/2)
    path.lineTo(cX - side/(2*Math.tan(Math.PI/3))-side/2,cY+side/2)
    path.closePath()
    this.cloneCtx.stroke(path)
    this.update()
    this.cloneCtx.restore()
    return path
  },
  sibianxing1(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide) {
    this.cloneCtx.beginPath()
    const path = new Path2D()
    this.cloneCtx.save()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.lineWidth = 2
    path.rect(cX-side/2,cY-side/2,side,side)
    this.cloneCtx.stroke(path)
    this.update()
    this.cloneCtx.restore()
    return path
  },
  sanjiaoxing(this:VirtualCanvas,cX:number,cY:number,side:number=defaultSide){
    const path = new Path2D()
    this.cloneCtx.strokeStyle = '#000'
    this.cloneCtx.beginPath()
    this.cloneCtx.save()
    this.cloneCtx.lineWidth = 2 
    path.moveTo(cX,cY-side)
    path.lineTo(cX+Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    path.lineTo(cX-Math.cos(Math.PI/6)*side,cY + Math.sin(Math.PI/6)*side)
    path.closePath()
    this.cloneCtx.stroke(path)
    this.update()
    this.cloneCtx.restore()
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