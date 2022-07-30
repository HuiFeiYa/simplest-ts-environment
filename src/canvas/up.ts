import { VirtualCanvas } from './canvas';
import store from '../store'
export default  {
  'qianbi'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'hengxian'(this:VirtualCanvas){
    this.saveSnapshot()
  },
  'ziti'(this:VirtualCanvas){

  },
  tuxing(this:VirtualCanvas){
    
  },
  qingchu(this:VirtualCanvas){
    // 清除鼠标
    this.applySnapshot()
    this.update()
  },
  shezhi(this:VirtualCanvas,e:MouseEvent){},
  'left-copy'(this:VirtualCanvas,e:MouseEvent){},
  right(this:VirtualCanvas,e:MouseEvent){},
  daoru(this:VirtualCanvas,e:MouseEvent){},
  daochu(this:VirtualCanvas,e:MouseEvent){},
  shanchu(this:VirtualCanvas,e:MouseEvent){},
  // 图形操作
  figure:{
    'move'(this:VirtualCanvas,e:MouseEvent){
      this.saveSnapshot()
      // 更新当前图形的位置
      const diffX = this.ctxPos.x - this.downPos.x;
      const diffY = this.ctxPos.y - this.downPos.y
      store.commit('setShapePos',{x:store.state.shapePos.x + diffX,y:store.state.shapePos.y + diffY,side:store.state.shapePos.side})
    },
    'nw-resize'(this:VirtualCanvas,e:MouseEvent){},
    'ne-resize'(this:VirtualCanvas,e:MouseEvent){
      this.saveShapeImageData()
    },
    'se-resize'(this:VirtualCanvas,e:MouseEvent){},
    'sw-resize'(this:VirtualCanvas,e:MouseEvent){},
  }
}