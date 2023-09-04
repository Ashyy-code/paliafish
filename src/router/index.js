import { createRouter, createWebHistory } from 'vue-router'

//Views
import Landing from '../views/Landing.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Landing
    }
  ]
})

export default router
