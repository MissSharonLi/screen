import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'
import ElementUI from 'element-ui'
import { vueBaberrage } from 'vue-baberrage'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(vueBaberrage)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
