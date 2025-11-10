import { createRouter } from '../shared/router/createRouter'

const target = process.env.VUE_APP_TARGET || 'all'
const base = target === 'all' ? '/admin' : '/'
export default createRouter({
  base,
  routes: [
    { path: '/', component: () => import('./pages/Dashboard.vue') },
    // ... các route admin
    { path: '*', component: () => import('../shared/pages/NotFound.vue') },
  ],
})
