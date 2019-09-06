import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/first',
  },
  {
    path: '/first',
    component: () => import('../pages/first.vue'),
  },
  {
    path: '/second',
    component: () => import('../pages/second.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
