import Vue from 'vue';
import App from './App.vue'
import SvgIcon from './components/svgIcon/index.vue'
import './assets/style/index.less'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index'
import Canvas from './canvas/canvas'
Vue.component('svg-icon',SvgIcon)
// @ts-ignore
Vue.use(Canvas)
Vue.use(ElementUI);

// const instance = new Canvas()
const app = new Vue({
  store,
  render:h=>h(App),
}).$mount('#app')