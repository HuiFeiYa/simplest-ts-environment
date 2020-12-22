import store from '../store/index'
import { mousedown, mouseup, mousemove } from './event';
export class VirtualCanvas {
  private canvas !:HTMLCanvasElement;
  private ctx!:CanvasRenderingContext2D
  private imageData!:ImageData
  public tempData!:ImageData
  private color = '#fff'
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
  // mousedown
  public downPos = {
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
    this.cloneCanvas.style.background = '#fff'
    // document.getElementsByClassName('toolbar')[0].appendChild(this.cloneCanvas)
    this.cloneCtx = this.cloneCanvas.getContext('2d') as CanvasRenderingContext2D
    this.init()
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
    this.update = this.update.bind(this)
    const { top,left } = this.canvas.getBoundingClientRect()
    // 更新画板的位置
    this.boundPos = { top,left }
    // 默认为铅笔状态
    // store.commit('setOperate','qianbi')
    store.commit('setOperate','ziti')
    this.saveSnapshot()
    this.tempData = this.cloneCtx.getImageData(0,0,this.width,this.height)
    // 监听全局的点击事件
    window.addEventListener('click',(e)=>{
      if(e.target !== this.canvas){
        store.commit('setCursor',false)
      }
      store.commit('clearKey')
    })
    document.addEventListener('keydown',(e:KeyboardEvent) =>{
      // 只有输入状态下
      if(store.state.isInput){
        store.commit('setCursor',false)
        
        if(e.key === 'Backspace'){
          store.commit('deleteOne')
          // 将写文案之前的像素更新进来
          this.cloneCtx.putImageData(this.tempData,0,0)
        }else{
          // 清除光标的图像
          this.applySnapshot()
          store.commit('setKeybord',e.key)
        }
        this.updateText()
      }
    })
  }
  updateText() {
    const { x,y } = this.downPos
    this.cloneCtx.font = "28px serif"
    this.cloneCtx.fillText(store.state.keybord,x,y)
    this.update()
    this.saveSnapshot()
  }
  mousedown() {
    this.canvas.addEventListener('mousedown',mousedown.bind(this))
  }
  mousemove() {
    this.canvas.addEventListener('mousemove',mousemove.bind(this))
  }
  mouseup() {
    this.canvas.addEventListener('mouseup',mouseup.bind(this))
  }
  saveSnapshot() {
    this.imageData  = this.cloneCtx.getImageData(0,0,this.width,this.height)
  }
  applySnapshot() {
    this.cloneCtx.putImageData(this.imageData,0,0)
  }
  pos(e:MouseEvent) {
    const { clientX,clientY } = e
    const { top,left } = this.boundPos
    return {
      x:clientX - left,
      y:clientY - top
    }
  }
  // 更新 mousemove 的鼠标位置
  updateCtxPos(e:MouseEvent) {
    this.ctxPos = this.pos(e)
  }
  // 更新 mousedown 时候的位置
  updateMousedownPos(e:MouseEvent) {
    this.downPos = this.pos(e)
  }
  update() {
    // 将之前的 ctx 状态存储到栈中
    this.ctx.save()
    // 清除展示画板的内容
    this.ctx.clearRect(0,0,this.width,this.height)
    this.updateCanvas()
    // 绘制背景的时候改为,在现有画布内容后面绘制新的图形
    this.ctx.globalCompositeOperation = 'destination-over'
    this.ctx.fillStyle = store.state.bgColor
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