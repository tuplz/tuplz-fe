import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Root = () => import(/* webpackChunkName: "root" */ '@/views/Layout.vue');
const Problemset = () =>
  import(/* webpackChunkName: "problemset" */ '@/views/Problemset.vue');
const ProblemPage = () =>
  import(/* webpackChunkName: "problemPage" */ '@/views/ProblemPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Root,
    redirect: {
      name: 'Problemset',
    },
    children: [
      {
        path: 'problemset',
        name: 'Problemset',
        component: Problemset,
      },
      {
        path: 'problems/:id',
        name: 'ProblemPage',
        component: ProblemPage,
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
