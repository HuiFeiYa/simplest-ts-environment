import Vue from 'vue';
import App from './App.vue'
import SvgIcon from './components/svgIcon/index.vue'
import Vuetify from './plugins/vuetify'
import './assets/style/index.less'
// @ts-ignore
Vue.use(Vuetify)
Vue.component('svg-icon',SvgIcon)
const app = new Vue({
  render:h=>h(App)
}).$mount('#app')