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
    lineWidth:2,
    bgColor:'#fff',
    lineColor:'#000',
    isCusor:false,
    keybord:'',
    isInput:true,
    shape,
    direction,
    shapePos:{
      x:0,
      y:0,
      side:100
    },
    head:1,
    pattern:'',
    canvasRect:{
      width:300,
      height:300
    },
    fontSize:20,
    fontColor:'rgba(0,0,0,0.8)',
    imagePos:{
      x:0,
      y:0
    },
    imageWidth:100,
    imageHeight:0,
    isShowControl:false,
    textAvailaleWidth:0
  },
  mutations:{
    setTextAvailaleWidth(state,width) {
      state.textAvailaleWidth = width
    },
    setIsShowControl(state,val) {
      state.isShowControl = val
    },
    setImageWidth(state,width){
      state.imageWidth = width
    },
    setImageHeight(state,height){
      state.imageHeight = height
    },
    setImagePos(state,pos) {
      state.imagePos = pos
    },
    setFontColor(state,color) {
      console.log('color',color)
      state.fontColor = color
    },
    setFontSize(state,size) {
      state.fontSize = size
    },
    setCanvasRectWidth(state,width){
      state.canvasRect.width = width
    },
    setCanvasRectHeight(state,height){
      state.canvasRect.height = height
    },
    setOperate(state,type:IconType) {
      state.operate = type
    },
    setLineWidth(state,width:number) {
      state.lineWidth = width
    },
    setLineColor(state,color) {
      state.lineColor = color
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
    },
    setHead(state,val){
      state.head = val
    },
    setPattern(state,val) {
      state.pattern = val
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