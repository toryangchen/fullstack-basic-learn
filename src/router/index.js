import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routers = [
  {
    path: '/',
    component: require('../App.vue'),
  },
  {
    path: '/first',
    component: require('../pages/first.vue'),
  },
  {
    path: '/second',
    component: require('../pages/second.vue'),
  },
];

const router = new VueRouter({
  routers,
});

export default router;
