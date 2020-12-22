class VirtualCanvas {
  private canvas !:HTMLCanvasElement;
  private ctx!:CanvasRenderingContext2D
  public cloneCanvas!:HTMLCanvasElement;
  public cloneCtx!:CanvasRenderingContext2D
  // 当前 canvas 相对于窗口左上角的位置
  public boundPos = {
    top:0,
    left:0
  }
  // 当前画笔的位置
  public ctxPos = {
    x:0,
    y:0
  }
  public isStart = false
  constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.cloneCanvas = document.createElement('canvas');
    this.cloneCanvas.width = canvas.width
    this.cloneCanvas.height = canvas.height
    this.cloneCtx = this.cloneCanvas.getContext('2d') as CanvasRenderingContext2D
    this.init()
    console.log(canvas.width,canvas.height)
  }
  get width() {
    return this.cloneCanvas.width
  }
  get height() {
    return this.cloneCanvas.height
  }
  init() {
    // 给 canvas 设置监听事件
    this.mousedown()
    this.mousemove()
    this.mouseup()
    // 绑定原型上函数的this指向
    this.updateCanvas = this.updateCanvas.bind(this)
    this.updateBg = this.updateBg.bind(this)
    const { top,left } = this.canvas.getBoundingClientRect()
    // 更新画板的位置
    this.boundPos = { top,left }
  }
  mousedown() {
    this.canvas.addEventListener('mousedown',e => {
      // 当鼠标 mousedown 时候，更新画笔的起点
      this.updateCtxPos(e)
      const { x, y } = this.ctxPos
      this.cloneCtx.beginPath()
      this.cloneCtx.moveTo(x,y)
      // 标记是否开始绘画
      this.isStart = true
    })
  }
  mousemove() {
    this.canvas.addEventListener('mousemove',(e) => {
      if(this.isStart) {
        this.updateCtxPos(e)
        const { x, y } = this.ctxPos
        this.cloneCtx.lineTo(x,y)
        this.cloneCtx.stroke()
        this.updateCanvas()
      }
    })
  }
  mouseup() {
    this.canvas.addEventListener('mouseup',e => {
      this.isStart = false
    })
  }
  updateCtxPos(e:MouseEvent) {
    const { clientX,clientY } = e
    const { top,left } = this.boundPos
    this.ctxPos = {
      x:clientX - left,
      y:clientY - top
    }
  }
  updateBg(color:string) {
    // 将之前的 ctx 状态存储到栈中
    this.ctx.save()
    console.log('clientX,clientY',this.width,this.height)

    this.ctx.clearRect(0,0,this.width,this.height)
    this.updateCanvas()
    // 绘制背景的时候改为,在现有画布内容后面绘制新的图形
    this.ctx.globalCompositeOperation = 'destination-over'
    this.ctx.fillStyle = color
    this.ctx.fillRect(0,0,this.width,this.height)
    this.ctx.restore()
  }
  updateCanvas() {
    this.ctx.drawImage(this.cloneCanvas,0,0,this.width,this.height)
  }
  resize(w:number,h:number) {
    this.cloneCanvas.width = w
    this.cloneCanvas.height = h
  }
  
}
const fn = {
  install(_Vue:any,options:any){
    // 添加全局混入，将 context 添加的 Vue 原型上
    _Vue.mixin({
      mounted() {
        // 保证实例只创建一次
        if( !_Vue.prototype.$instance){
          const canvas = document.getElementById('canvas') as HTMLCanvasElement
          const instance = new VirtualCanvas(canvas)
          _Vue.prototype.$instance = instance
          _Vue.prototype.$ctx = instance.cloneCtx
          _Vue.prototype.$canvas = function(w:number,h:number) {
          }
        }
      }
    })
  }
}

export default fn