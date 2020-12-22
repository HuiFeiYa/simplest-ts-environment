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
        const canvas = document.getElementById('canvas') as HTMLCanvasElement
        const instance = new VirtualCanvas(canvas)
        // 保证实例只创建一次
        if( !_Vue.prototype.$instance){
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