import { createRouter } from '../shared/router/createRouter'

const target = process.env.VUE_APP_TARGET || 'all'
const base = target === 'all' ? '/admin' : '/'

const DashboardPage = () => import('./pages/Dashboard.vue')
const NotFoundPage = () => import('../shared/pages/NotFound.vue')

export default createRouter({
  base,
  routes: [
    {
      path: '/',
      name: 'admin-dashboard',
      component: DashboardPage,
    },
    {
      path: '/dashboard',
      redirect: { name: 'admin-dashboard' },
    },
    // ... các route admin
    {
      path: '*',
      name: 'admin-not-found',
      component: NotFoundPage,
    },
  ],
})
