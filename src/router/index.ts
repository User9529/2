// 2copyu/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeIndex.vue'),
      meta: { title: '主页' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginIndex.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/buycar',
      name: 'buycar',
      component: () => import('@/views/buycar/BuycarIndex.vue'),
      meta: { title: '购物车' }
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: () => import('@/views/favorite/FavoriteIndex.vue'),
      meta: { title: '收藏夹' }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/order/OrderIndex.vue'),
      meta: { title: '订单' }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/components/user/UserIndex.vue'),
      meta: { title: '用户中心' }
    }
  ]
})

export default router
