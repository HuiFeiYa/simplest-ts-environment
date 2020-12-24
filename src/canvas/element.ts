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

function scaleCanvas(canvas:HTMLCanvasElement, width:number, height:number) {
  const w = canvas.width,
      h = canvas.height;
  if (width === undefined) {
      width = w;
  }
  if (height === undefined) {
      height = h;
  }

  let retCanvas = document.createElement("canvas");
  let retCtx = retCanvas.getContext("2d") as CanvasRenderingContext2D
  retCanvas.width = width;
  retCanvas.height = height;
  retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
  return retCanvas;
}

// 获取指定尺寸的图片地址
function getDataURL(canvas:HTMLCanvasElement, type:string, width:number, height:number) {
  canvas = scaleCanvas(canvas, width, height);
  // 可以指定输出图片字符串的类型
  return canvas.toDataURL(type);
}
// 拼接完整的图片类型
function fixType(type:string) {
  type = type.toLowerCase().replace(/jpg/i, "jpeg");
  return "image/" + type;
}

// 通过 a 标签来实现生成图片
function saveFile(strData:string,fileType:string,fileName="下载"){
  let downLink = document.createElement('a')
  downLink.download = fileName + "." + fileType
  downLink.href = strData
  downLink.click()
}

export function download(canvas:HTMLCanvasElement,width:number,height:number,imageType:string,fileName:string) {

  let dataUrl = getDataURL(canvas,fixType(imageType),width,height)
  saveFile(dataUrl,imageType,fileName)
}

export function blobToImg (blob:Blob,width:number) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      let img = new Image()
      img.src = reader.result as string
      img.addEventListener('load', () => {
          resolve(img)
        }
      )
    })
    reader.readAsDataURL(blob)
  })
}
