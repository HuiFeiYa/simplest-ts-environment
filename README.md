# canvas 画板

## 更换背景

## 导入图片操作

### 插入图片

1. 点击 toolbar 时候判断点击图标为导入，触发 input 上传的文体，拿到图片地址

    - input change 事件触发，拿到 e.srcElement.files[0] 文件。
    - 通过 new FileReader() 创建 reader 来读取 reader.readAsDataURL(blob)文件转化为图片地址
    - 创建 img 元素，赋值图片地址

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
