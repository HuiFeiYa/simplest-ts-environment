import { canvasImg,loadImg } from './element'
import { RectW,RectH } from './types/index'
export async function createPattern(ctx:CanvasRenderingContext2D,path:string):Promise<CanvasPattern>
export async function createPattern(ctx:CanvasRenderingContext2D,path:string,a:number,b:number):Promise<CanvasPattern>
export async function createPattern(ctx:CanvasRenderingContext2D,path:string,a:RectW|RectH):Promise<CanvasPattern>
export async function createPattern(ctx:CanvasRenderingContext2D,path:string,a?:number|RectW|RectH,b?:number) :Promise<CanvasPattern>{
  let image!:HTMLCanvasElement | HTMLImageElement
  // 如果有width说明要自定义宽高，要使用 canvas.drawImage 重新生成自定义大小的 canvas 元素
  if(a === undefined && b === undefined) {
    image = await loadImg(path)
  }else {
    if(typeof a === 'number') {
      if(typeof b === 'number') {
        image = await canvasImg(path,a,b)
      }
    }else if(a !== undefined){
      if(a.type === 'width' || a.type === 'height') {
        image = await canvasImg(path,a)
      }
    }
  }
  return ctx.createPattern(image,'repeat') as CanvasPattern
}
