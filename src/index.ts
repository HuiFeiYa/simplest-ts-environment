import Vue from 'vue';
import App from './App.vue'
import SvgIcon from './components/svgIcon/index.vue'
import './assets/style/index.less'
Vue.component('svg-icon',SvgIcon)
const app = new Vue({
  render:h=>h(App)
}).$mount('#app')