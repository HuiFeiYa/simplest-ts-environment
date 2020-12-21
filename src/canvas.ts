class VirtualCanvas {
  private canvas !:HTMLCanvasElement;
  private ctx!:CanvasRenderingContext2D
  public cloneCanvas!:HTMLCanvasElement;
  public cloneCtx!:CanvasRenderingContext2D
  constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.cloneCanvas = document.createElement('canvas');
    this.cloneCanvas.width = canvas.width
    this.cloneCanvas.height = canvas.height
    this.cloneCtx = this.cloneCanvas.getContext('2d') as CanvasRenderingContext2D
    // 绑定原型上函数的this指向
    this.updateCanvas = this.updateCanvas.bind(this)
  }
  updateCanvas(image:any) {
    this.ctx.drawImage(this.cloneCanvas,0,0,this.cloneCanvas.width,this.cloneCanvas.height)
  }
}
async function factor() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if(!canvas) {
    return 
  }
  return new VirtualCanvas(canvas)
}

export default factor()