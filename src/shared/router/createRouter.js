import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// eslint-disable-next-line import/prefer-default-export
export function createRouter({ routes, base }) {
  return new VueRouter({
    mode: 'history', // hoặc 'hash' nếu bạn không rewrite 404 -> index.html
    base,
    routes,
    scrollBehavior: () => ({ x: 0, y: 0 }),
  })
}
