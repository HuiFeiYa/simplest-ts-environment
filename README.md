# canvas 画板

## 撤销和前进

如何实现画板的撤销和前进的功能？

### ctx.getImageData(sx,sy,sw,sh)

> CanvasRenderingContext2D.getImageData() 返回一个 ImageData 对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为(sx, sy)、宽为 sw、高为 sh。

这个 api 返回一个 imageData 对象，相当于拿到一个 canvas 的快照，我们可以指定你要的快照的起点位置和大小，一般都是 canvas 的大小。

### ctx.putImageData(imageData,dx,dy)

> CanvasRenderingContext2D.putImageData() 是 Canvas 2D API 将数据从已有的 ImageData 对象绘制到位图的方法。 如果提供了一个绘制过的矩形，则只绘制该矩形的像素。此方法不受画布转换矩阵的影响。

相当于我们把之前存储的快照(也就是 imageData) 重新绘制到 canvas 上

### 撤销

我们将绘制的 canvas 内容都保存一份 imageData (快照)也就得到 [imageData,imageData...] 列表，可以通过 head 来指定当前引用的是第几个快照，然后取出来应用到 canvas 上。

### 前进

同样在有了 [imageData,imageData...] 列表后，我们可以通过后移 head 来获取到当前前进后的快照。

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

canvas 默认的内容混合方式是 ctx.globalCompositeOperation 为 source-over 也就是绘制的新内容在原有内容之上。

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

### 解决方式一：多次设置 ctx.globalCompositeOperation

1. 绘制图案
2. 将 ctx.globalCompositeOperation 设置为 destination-over 也就是在已有内容后面绘制
3. 将 ctx.globalCompositeOperation 设置为 source-over 也就是在已经内容的上绘制

这里也可以在更改 ctx.globalCompositeOperation 将 canvas 当前的状态存储在栈中。再次重新绘制时候，将 canvas 的上下文重新设置为之前的状态。后续详细讲。

#### 仍然存在问题，当我们需要重新修改背景颜色，该如何解决

### 解决方式二：创建一个 canvas 作为 canvas 数据的存储仓库

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

### [ctx.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

> The CanvasRenderingContext2D.drawImage() method of the Canvas 2D API provides different ways to draw an image onto the canvas.

将 image 绘制到 canvas 上。这里的 image 包括

    -   HTMLImageElement 、HTMLCanvasElement 、SVGImageElement 、HTMLVideoElement 等

## 如何导出当前 canvas 的内容为图片？如何自定义下载图片的格式

### 导出 url

    -   canvas.toDataURL()

    > HTMLCanvasElement.toDataURL() 方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。图片的分辨率为 96dpi。通过该方式得到的是 base64的地址。

    * canvas.toBlob()

    > HTMLCanvasElement.toBlob() 方法创造Blob对象，用以展示canvas上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。如不特别指明，图片的类型默认为 image/png，分辨率为96dpi。

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

### 绘制直线流程(见案例)

1. 在 mousedown 事件中确认鼠标落点位置
2. 将绘制直线的画布内容重新渲染到 canvas 上,绘制落点位置到当前位置的线段
3. 保存绘制的直线 canvas 数据

### 绘制连线线段流程

1. 在 mousemove 事件中更新鼠标位置，使用 ctx.lineTo(x,y) 直接连续绘制 sub-path
2. 保存绘制的连续线 canvas 数据

## 导入图片操作

### FileReader

> FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
> 其中 File 对象可以是来自用户在一个\<input>元素上选择文件后返回的 FileList 对象,也可以来自拖放操作生成的 DataTransfer 对象,还可以是来自在一个 HTMLCanvasElement 上执行 mozGetAsFile()方法后返回结果。

#### 构造函数 FileReader

FileReader()
返回一个新构造的 FileReader。

#### 属性

    -   FileReader.readyState 只读

    ```
    表示FileReader状态的数字。取值如下：
    常量名 值 描述
    EMPTY 0 还没有加载任何数据.
    LOADING 1 数据正在被加载.
    DONE 2 已完成全部的读取请求.
    ```
    * FileReader.result 文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

#### 事件处理

    * FileReader.onload。处理 load 事件。该事件在读取操作完成时触发。

#### 方法

    * FileReader.readAsDataURL(),开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。

### 插入图片

通过创建 FileReader 实例来读取 input 选择的文件,

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

## 橡皮擦的功能实现

### 定义

> CanvasRenderingContext2D.clip() 是 Canvas 2D API 将当前创建的路径设置为当前剪切路径的方法。

    ```
        ctx.beginPath()
        // 绘制剪切路径
        ctx.arc(x-left,y-top,R,0,Math.PI*2,false)
        ctx.clip()
        ctx.clearRect(0,0,canvas.width,canvas.height)
    ```
    剪切路径绘制以后是对之后的图形生效，如果图形绘制在 clip 之前，clip 对其没有影响。

> In the image below, the red outline represents a clipping region shaped like a star. Only those parts of the checkerboard pattern that are within the clipping region get drawn.

    ![](https://mdn.mozillademos.org/files/209/Canvas_clipping_path.png)

    -   注意点 1: 剪切之后只能在剪切范围内继续绘制，也就是我们无法操作 clip 范围之外的区域

> Be aware that the clipping region is only constructed from shapes added to the path. It doesn't work with shape primitives drawn directly to the canvas, such as fillRect(). Instead, you'd have to use rect() to add a rectangular shape to the path before calling clip().

    * 注意点2 剪切必须有路径，例如使用 rect() arc() ... 这些创建路径的方法。使用 fillRect() 这类api并没有创建路径，所以剪切无效。

### 实现橡皮擦

    由于 clip 会创建一个新的 clipping region ,clip 之前创建的路径就是新的 clipping region ，默认当前 clip region 为 canvas 左上角。
    这里介绍一下 [ctx.save()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save) 方法

    > The CanvasRenderingContext2D.save() method of the Canvas 2D API saves the entire state of the canvas by pushing the current state onto a stack.

    stack 存储了一下这些，其中就包括 clipping region 。
    * The current transformation matrix.
    * The current clipping region.
    * The current dash list.
    * The current values of the following attributes: strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline, direction, imageSmoothingEnabled.

    我们在 clip 之前将 clipping region 存储在 stack 中。当我们 clip 之后得到我们想要的图形，我们使用 [ctx.restore()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore) 将存储的 state 都重新 restore 到canvas上。这样我们又可以操作 canvas 上所有的区域了。

    > The CanvasRenderingContext2D.restore() method of the Canvas 2D API restores the most recently saved canvas state by popping the top entry in the drawing state stack. If there is no saved state, this method does nothing.
    ```
        canvas.onmousemove = function(e) {
        const { clientX,clientY } = e
        windowLocToCanvas(clientX,clientY)
        }
        function windowLocToCanvas(x,y) {
        const { top,left } = canvas.getBoundingClientRect()
        ctx.save()
        ctx.beginPath()
        ctx.arc(x-left,y-top,R,0,Math.PI*2,false)
        ctx.clip()
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.restore()
        }
    ```

## 如何添加文字和模拟光标

模拟光标就是在鼠标点击点位置绘制一个类似光标的矩形，然后让这个矩形消失 -> 出现 -> 消失的过程。

1. 保存绘制矩形前的内容。
2. 绘制光标矩形
3. 将绘制矩形前的内容重新绘制在 canvas 上，重复 2、3 步。

## 如何设置 canvas 输入文字自动换行

思路：
将输入的内容借助 svg foreignObject 生成 `data:image/svg+xml;charset=utf-8,<svg></svg>`格式的地址，创建 img 将生成的内容绘制在 img 元素上。然后通过 `canvas.drawImage(img, 0, 0);` 来绘制到 canvas。

### 步骤

    1.  将要换行的内容拼接成如下格式,在这里就可以使用 css 来控制换行了。(行内样式) `'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><body></body></foreignObject></svg>`

    2.  创建 img 元素，赋值上面拼接的地址

        ```
        function loadImgSize(path:string,width:number,height:number):Promise<HTMLImageElement> {
        return new Promise(res=>{
            const img = new Image()
            img.width = width
            img.height = height
            img.onload = function () {
            res(img)
            }
            img.src = path
        })
        }
        ```
    3. ctx.drawImage(img,0,0) 将创建的 img 元素绘制到 canvas 上

## 图片压缩

### 流程

图片(本地选取或路径) -> canvas 压缩(使用 ctx.drawImage(img,0,0,w,h)来实现) -> 图片(使用 canvas.toDataURL() 、 canvas.toBlob())方法重新导出图片。

### 前端压缩的好处

    * 由于上传图片尺寸比较小，因此上传速度会比较快，交互会更加流畅，同时大大降低了网络异常导致上传失败风险。
    * 最最重要的体验改进点：省略了图片的再加工成本。很多网站的图片上传功能都会对图片的大小进行限制，尤其是头像上传，限制5M或者2M以内是非常常见的。然后现在的数码设备拍摄功能都非常出众，一张原始图片超过2M几乎是标配，此时如果用户想把手机或相机中的某个得意图片上传作为自己的头像，就会遇到因为图片大小限制而不能上传的窘境，不得不对图片进行再处理，而这种体验其实非常不好的。如果可以在前端进行压缩，则理论上对图片尺寸的限制是没有必要的。

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
