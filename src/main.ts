import { createPattern } from './pattern'

async function handle() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  let w = canvas.width
  let h = canvas.height 
  const pattern = await createPattern(ctx,'./images/xh2.png',{val:50,type:'height'})
  ctx.fillStyle = pattern
  ctx.fillRect(0,0,canvas.width,canvas.height)
}
handle()