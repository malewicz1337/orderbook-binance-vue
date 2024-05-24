import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
    {
      path: '/order-book',
      name: 'OrderBook',
      component: () => import('../views/OrderBookView.vue')
    },
    { path: '/settings', name: 'Settings', component: () => import('../views/SettingsView.vue') }
  ]
})

export default router
