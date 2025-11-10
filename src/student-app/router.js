import { createRouter } from '../shared/router/createRouter'

const base = '/'

const HomePage = () => import('./pages/Home.vue')
const NotFoundPage = () => import('../shared/pages/NotFound.vue')

export default createRouter({
  base,
  routes: [
    {
      path: '/',
      name: 'student-home',
      component: HomePage,
    },
    {
      path: '/home',
      redirect: { name: 'student-home' },
    },
    // ... các route student
    {
      path: '*',
      name: 'student-not-found',
      component: NotFoundPage,
    },
  ],
})
