import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Root = () => import(/* webpackChunkName: "root" */ '@/views/Layout.vue');

const Problemset = () =>
  import(/* webpackChunkName: "problemset" */ '@/views/Problemset.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Root,
    children: [
      {
        path: 'problemset',
        name: 'Problemset',
        component: Problemset,
      },
      {
        path: ':pathMatch(.*)*',
        redirect: {
          name: 'Problemset',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
