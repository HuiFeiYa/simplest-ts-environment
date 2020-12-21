import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    canvasInstance:null
  },
  mutations:{
    canvasInstance(state,canvasInstance:any) {
      state.canvasInstance = canvasInstance;
    }
  }
})