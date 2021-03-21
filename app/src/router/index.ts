import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Root = () => import(/* webpackChunkName: "root" */ '@/views/Layout.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: Root,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
