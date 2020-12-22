import Vue from 'vue'
import Vuex from 'vuex'
import { IconType } from '../components/toolbar/config'
Vue.use(Vuex)
// 在外面定义好类型
let operate!:IconType
export default new Vuex.Store({
  state:{
    operate
  },
  mutations:{
    setOperate(state,type:IconType) {
      state.operate = type
    }
  }
})