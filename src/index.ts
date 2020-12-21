import Vue from 'vue';
import App from './App.vue'
import SvgIcon from './components/svgIcon/index.vue'
import Vuetify from './plugins/vuetify'
import './assets/style/index.less'
import Vuex from 'vuex'
import store from './store/index'
Vue.component('svg-icon',SvgIcon)
const app = new Vue({
  // @ts-ignore
  Vuetify,
  store,
  render:h=>h(App),
}).$mount('#app')