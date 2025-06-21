import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeIndex.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginIndex.vue'),
    },
    {
      path: '/buycar',
      name: 'buycar',
      component: () => import('@/views/buycar/BuycarIndex.vue'),
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: () => import('@/views/favorite/FavoriteIndex.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/UserIndex.vue'),
    }
  ],
})

export default router
