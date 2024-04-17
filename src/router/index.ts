// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        redirect: { name: 'Paraview', params: { port: '12345' } },
      },
      {
        // param: port
        // just for testing, usually use port 1234 or 12345
        path: 'paraview/:port',
        name: 'Paraview',
        component: () => import(/* webpackChunkName: "paraview" */ '@/views/Paraview.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
