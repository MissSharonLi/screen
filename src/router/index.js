import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@views/Home.vue')
  }
]
const Rout = new Router({
  // base: process.env.BASE_URL,
  routes
})
export default Rout
