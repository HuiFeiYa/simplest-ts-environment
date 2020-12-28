# canvas 画板

## 撤销和前进

如何实现画板的撤销和前进的功能？

### ctx.getImageData(sx,sy,sw,sh)

> CanvasRenderingContext2D.getImageData() 返回一个 ImageData 对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为 sw、高为 sh。

## 更换背景

### ctx.fillStyle = color ctx.fill()填充颜色

    ```
        ctx.fillStyle = 'green'
        ctx.rect(0,0,canvas.width,canvas.height)
        ctx.fill()
    ```

### 存在问题之前画板上的内容会被覆盖

这是因为 ctx.globalCompositeOperation 的默认属性为 source-over, 在现有的画板内容上绘制新图形。所以当我们绘制使用 ctx.fill() 将颜色填充到画板上会覆盖之前画板的内容。

### 如何解决

    设置 ctx.globalCompositeOperation 来改变新生成的绘制在当前画布内容后面
    ```
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = 'green'
      ctx.rect(0,0,canvas.width,canvas.height)
      ctx.fill()
    ```

### 新的问题

    第一次背景绘制解决了，但是后面绘制的新内容都看不见了，因为都层级都更低无法被遮挡了。
    该如何解决？

### 创建一个 canvas 作为 canvas 数据的存储仓库

<img width="300"  src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8989732f2a534dad9bd852a38e62f860~tplv-k3u1fbpfcp-watermark.image" />
1.  创建内容层

    ```内容层
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.lineWidth = 4
        ctx.moveTo(100,100)
        ctx.lineTo(200,100)
        ctx.stroke()
    ```

2. 背景层用于设置背景颜色，和绘制内容层

    ```
        const bgCanvas = document.getElementsByTagName('canvas')[0]
        const bgCtx = bgCanvas.getContext('2d')
        // 将新内容绘制方式改为后方绘制
        ctx.globalCompositeOperation = 'destination-over'
        // 将内容层绘制到背景层上
        bgCtx.drawImage(ctx,0,0,canvas.width,canvas.height)
        // 将新内容绘制方式改为上方绘制
        ctx.globalCompositeOperation = 'source-over'
    ```

## 绘制直线和连续的线，他们的绘制区别

### 区别

绘制直线的流程：

1. mousedown 事件中确定起点
2. mousemove 事件中实时绘制当前点和起点的之间的直线
3. mouseup 一次完整的绘制结束

绘制连续线的流程:

1. mousedown 事件中确认起点
2. mousemove 事件中每次滑动都会绘制和上次 mousemove 事件触发的点的连线。
3. mouseup 一次完整的绘制结束

### 绘制直线流程

1. 在 mousedown 事件中确认鼠标落点位置
2. 将绘制直线的画布内容重新渲染到 canvas 上,绘制落点位置到当前位置的线段
3. 保存绘制的直线 canvas 数据

### 绘制连线线段流程

1. 在 mousemove 事件中更新鼠标位置，使用 ctx.lineTo(x,y) 直接连续绘制 sub-path
2. 保存绘制的连续线 canvas 数据

## 导入图片操作

### 插入图片

1. 点击 toolbar 时候判断点击图标为导入，触发 input 上传的文体，拿到图片地址

    - input change 事件触发，拿到 e.srcElement.files[0] 文件。
    - 通过 new FileReader() 创建 reader 来读取 reader.readAsDataURL(blob)文件转化为图片地址
    - 创建 img 元素，赋值图片地址

    ```
        // file change 事件拿到文件
        const file = e.srcElement.files[0]
    ```

    ```
        // HTML5的File API提供了File和FileReader两个主要对象，可以获得文件信息并读取文件

        // 读取文件:
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...'
        };
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
    ```

2. 将 img 渲染到 canvas 画板上，默认位置画板中心位置
3. 通过 new Path2D() 创建控制框路径(矩形框和边角的控制框),并且将这些路径存储起来，用于以后判断点击的位置是否在对于的路径中。

### 移动图片

如何将图片从框中移动到框外？

<img width="200" src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/490a74a82c8a424394fa309a81288b03~tplv-k3u1fbpfcp-watermark.image" />

<img width="200" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a26f1d6732a44b1799fdb4cb10e99f24~tplv-k3u1fbpfcp-watermark.image">

1. 在插入图片将使用 [ctx.getImageData(0,0,width,height)](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData) 将 canvas 内容保存未 imageData 对象
2. 在 mousemove 事件实时更新当前图片信息(坐标、宽、高、角度)。并存储要绘制的 img 对象
3. 使用 [ctx.putImageData(imageData,dx,dy)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData),将之前存储的 imageData 的内容重新绘制到 canvas 上。(相当于回归到插入图片之前到画板内容)
4. 然后根据最新的(坐标、宽、高、角度)信息来重新绘制 img 对象到 canvas 上。同理根据信息绘制控制框并更新存储的 path 路径。

### 取消选中状态

<img width="200" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a26f1d6732a44b1799fdb4cb10e99f24~tplv-k3u1fbpfcp-watermark.image">
<img width="200" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee4f68b7a0e0442496f33cd65b45735a~tplv-k3u1fbpfcp-watermark.image">

1. 当我们触发 mousedown 事件的时候根据我们保存的 path 路径来判断鼠标落点。当我们点击位置不在 path 中,我们需要取消选中状态
2. 我们需要将导入图片之前当 imageData 重新绘制到 canvas 上 (相当于回归到插入图片之前到画板内容)
3. 将 imageData 重新绘制到 canvas 上，然后我们将当前图片信息(坐标、宽、高、角度)。绘制到 canvas 上

### 拉伸图片

1. 同理在 mousdedown 事件中判断鼠标落点,如果在控制点上就进行拉伸操
2. 根据每个方向的规则去更新图片的(坐标、宽、高、角度)信息
3. 将 imageData 重新绘制到 canvas 上，然后将当前图片信息(坐标、宽、高、角度)。绘制到 canvas 上

## 注意点

### stroke 影响

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <canvas width="500" height="500"></canvas>
  <button>画一条 linewidth 为 10px 的线</button>
  <script>
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    const button = document.getElementsByTagName('button')[0]
    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.moveTo(100,100)
    ctx.lineTo(200,100)
    ctx.stroke()

    button.addEventListener('click',function(){
      ctx.moveTo(100,200)
      ctx.lineTo(200,200)
      ctx.lineWidth = 10
      ctx.stroke()
    })
  </script>
</body>
</html>
```

描述: 后面绘制的 10px 的线条样式宽度后同时改变了之前绘制的 4px 的线条。什么原因？如何解决？

#### ctx.moveTo(x,y)

将 ctx 看作画板的笔头，该方法开始将笔头移动到指定的位置创建一个 sub-path。这里需要知道的是多个 sub-paths 是被一个 ctx.stroke() 方法渲染的，所以你对 ctx 设置了线条相关的样式都会被应用到所有的 sub-paths 上。

#### 如何解决 stroke 线条直接互相影响的情况

在绘制线条前使用 ctx.beginPath(),来清空之前保留的所有 sub-paths ，重新创建路径。

> The CanvasRenderingContext2D.beginPath() method of the Canvas 2D API starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
