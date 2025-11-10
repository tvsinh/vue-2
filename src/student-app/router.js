import { createRouter } from '../shared/router/createRouter'

const base = '/'
export default createRouter({
  base,
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    // ... các route student
    { path: '*', component: () => import('../shared/pages/NotFound.vue') },
  ],
})
