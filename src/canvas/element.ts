import { RectW,RectH } from '../types/index'
// 存储已经加载的图片，避免重复创建相同的图片
const imgMap:any = {}
// 两者都传数字设置宽高
export async function canvasImg(path:string,a:number,b:number):Promise<HTMLCanvasElement>
// 传一个值的时候带上 type 标注是 width | height
export async function canvasImg(path:string,a:RectW|RectH):Promise<HTMLCanvasElement>
export async function canvasImg(path:string,a:number | RectW | RectH,b?:number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let img!:any

  if(!imgMap[path]){
    // 加载图片
    img = await loadImg(path)
    imgMap[path] = img
  }else{
    img = imgMap[path]
  }
  let w=0,h=0;
  // 原图片的宽高比
  const rate = img.width / img.height
  if(b !== undefined) {
    h = b
    if(typeof a === 'number') {
      w = a
    }
  }else{
    if(typeof a !== 'number' ){
      if(a.type === 'width') {
        w = a.val
        h = w / rate;
      }
      if(a.type === 'height') {
        h = a.val
        w = h * rate
      }
    }
  }
  canvas.width = w
  canvas.height = h
  ctx!.drawImage(img,0,0,w,h)
  return canvas
}
export function loadImg(path:string):Promise<HTMLImageElement>{
  return new Promise((resolve,reject)=>{
    const img = document.createElement('img')
    img.src = path
    img.onload = function() {
      resolve(img)
    }
  })
}