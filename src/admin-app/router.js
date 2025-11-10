import { createRouter } from '../shared/router/createRouter'

const base = process.env.TARGET === 'all' ? '/admin' : '/'
export default createRouter({
  base,
  routes: [
    { path: '/', component: () => import('./pages/Dashboard.vue') },
    // ... các route admin
    { path: '*', component: () => import('../shared/pages/NotFound.vue') },
  ],
})
