# 分享大纲

 利用 canvas 的 api 能实现哪些效果。 对一些基础的功能进行学习，了解这些基础的功能后可以实现更复杂的组合

## 项目结构

## 首先来绘制一条线

### 如何绘制一条线

    下面代码就可以绘制一条线
    ```
      ctx.moveTo(x,y)
      ctx.lineTo(x1,y1)
      ctx.stroke()
    ```

### 在画板上绘制一条线

### 在画板上绘制一条连续的线

## 更换背景

如何更换一个 canvas 的背景

1. 使用 fill / fillRect 来填充背景，如果我们可以通过 fillStyle 来指定填充的颜色,如果不指定，默认是黑色。
2. 直接通过通过 css 给 canvas 元素设置背景颜色。(当 canvas 使用 fill 填充后，canvas 设置的 css 是无法看到的)。

### canvas 中绘制内容的层级问题

ctx.globalCompositeOperation 内容混合方式

    -   多次更换背景仍然出现问题
    -   采用两个 canvas 分别负责背景层和内容层

## 前进后退

## canvas 中导入图片

    -   创建 FileReader 实例，通过 reader.readAsDataURL() 方法读取文件内容，得到 base64 的字符串
    -   创建 img 元素，将 src 地址设置为 base64 的地址
    *   通过 ctx.drawImage(image,dx,dy,sx,sy) 方法将img绘制到canvas上。

## 图片的伸缩、拖拽

### 落点位置判断

    * 绘制拖拽控制框。八个方向 + 矩形框
    * 判断当前落点在哪个控制框内。使用 ctx.isPointInPath(x,y) 判断落点是否在路径内。
      * 出现点问题点：只能用于单次绘制的路径,我们绘制的八个方向 + 矩形框是有九条路径。无法判断是落在哪个方向上。

    * 使用 new Path2D()创建路径实例，通过每个实例的 path.isPointInPath(x,y)来判断是否落在对应的路径。
    * 根据不同落点的位置修改 canvas.style.cursor 显示

### 拖拽实现

    * 在 store 中保存 direction 用于存储当前落点是在哪个位置 'move' | 'nw-resize' | 'ne-resize' | 'sw-resize' | 'sw-resize' ...
    * 在 canvas 的 mousemove 事件中判断落点的值来执行不同的操作。具体查看 move.ts 中的 daoru 函数。
    * 在这些事件中本质就是修改当前图片的 宽、高、x、y 的位置(数学计算)，然后每次更改完这些数据后重新绘制图形。当绘制新的图形前，需要将 canvas 重置到添加图形前。所以我们需要在每次导入图片前保存画板的像素数据。

## 橡皮擦

## 添加文字和模拟光标

## canvas 输入文字自动换行

canvas 本身没有自动换行。需要自己实现，利用 svg forginObject 元素实现。

1. 监听键盘事件，确认输入的内容。将内容拼接成 `<svg xmlns="http://www.w3.org/2000/svg"><body><p style="width:100px"></p></body><foreignObject><body></body></foreignObject></svg>` 格式。

    - 我们可以给 foreiginObject 元素设置宽高
    - 可以给 body 内的元素设置 css 样式，这样我们添加的内容又可以通过 css 来控制了。

2. 创建 img 元素，将上面拼接的 svg 元素字符串改造为: `data:image/svg+xml;charset=utf-8,<svg>省略内容......</svg>`,这个地址可以作为 img.src 的路径，这样我们可以得到一个 img 元素
3. 最后我们将这个 img 元素绘制到 canvas 上

## 容易出现的问题

### lineWidth 设置

当设置 lineWidth 后可能对之前绘制的线条产生影响，每次绘制的线条都是一组 sub-paths，我们给线条宽度都会应用到这一组 sub-paths 上。除非我们使用 ctx.beginPath() 清除所有的 sub-paths。开始一组新的 sub-paths。

## 图片压缩

核心: ctx.drawImage(image,dx,dy,sx,sy),通过该 api 将图片按比例缩小重新绘制到 canvas 上。然后再导出 canvas.toDataURL() 、 canvas.toBlob() 来重新导出图片地址。可以将该地址发送给后端

具体查看 examples/compess.html 文件。

## 下载图片

    * 通过 canvas.toDataURL(type) 拿到图片的 base64的地址,可以通过type设置导出图片的类型如: image/jpeg 或者 image/png
    * 创建 a 标签
        * 通过 download 属性设置下载图片的文件名
        * 通过 href 设置下载文件的地址
        * 模拟执行 click 事件，实现下载操作

## 图片裁剪

![](https://pic1.zhimg.com/80/v2-f5e7b335c5787599d3ab2979efdfb488_1440w.jpg)

核心:使用 ctx.drawImage(image,dx,dy,sx,sy)。
