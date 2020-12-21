import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    ctx!:CanvasRenderingContext2D
  },
  mutations:{
    canvasContext(state,ctx:CanvasRenderingContext2D) {
      // @ts-ignore
      state.ctx = ctx;
    }
  }
})