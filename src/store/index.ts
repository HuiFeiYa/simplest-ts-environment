import Vue from 'vue'
import Vuex from 'vuex'
import { IconType } from '../components/toolbar/config'
import { Shape } from '../components/rightbar/config'
Vue.use(Vuex)
type Direction = 'move' | 'nw-resize' | 'ne-resize' | 'sw-resize' | 'sw-resize'
// 在外面定义好类型
let operate!:IconType
let shape !:Shape
let direction!: Direction
export default new Vuex.Store({
  state:{
    operate,
    lineWidth:1,
    bgColor:'#fff',
    isCusor:false,
    keybord:'',
    isInput:true,
    shape,
    direction,
    shapePos:{
      x:0,
      y:0,
      side:100
    }
  },
  mutations:{
    setOperate(state,type:IconType) {
      state.operate = type
    },
    setLineWidth(state,width:number) {
      state.lineWidth = width
    },
    setBgColor(state,color:string){
      state.bgColor = color
    },
    setCursor(state,val) {
      state.isCusor = val
    },
    setKeybord(state,val) {
      state.keybord += val
    },
    // 输入状态下不显示 cursor
    setInputStatus(state,val){
      state.isInput = val
    },
    deleteOne(state) {
      state.keybord = state.keybord.slice(0,-1)
    },
    clearKey(state) {
      state.keybord = ''
    },
    setShape(state,shape:Shape) {
      state.shape = shape
    },
    setDirection(state,direction:Direction) {
      state.direction = direction
    },
    setShapePos(state,val) {
      state.shapePos = val
    }
  },
  getters:{
    isInput(state) {
      return state.isCusor
    },
    isMoveShape(state) {
      return state.operate === 'tuxing'
    } 
  }
})