import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordNormalized,
  RouteRecordRaw,
} from 'vue-router';
import { store } from '@/store';

const Root = () => import(/* webpackChunkName: "root" */ '@/views/Layout.vue');
const Problemset = () =>
  import(/* webpackChunkName: "problemset" */ '@/views/Problemset.vue');
const ProblemPage = () =>
  import(/* webpackChunkName: "problemPage" */ '@/views/ProblemPage.vue');
const CollectionPage = () =>
  import(/* webpackChunkName: "collectionPage" */ '@/views/CollectionPage.vue');
const RecommendPage = () =>
  import(/* webpackChunkName: "recommendPage" */ '@/views/RecommendPage.vue');
const UserProfile = () =>
  import(/* webpackChunkName: "userProfile" */ '@/views/UserProfile.vue');
const UserSettings = () =>
  import(/* webpackChunkName: "userSettings" */ '@/views/UserSettings.vue');

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
        path: 'collections/:id',
        name: 'CollectionPage',
        component: CollectionPage,
        meta: {
          requiresLogin: true,
        },
      },
      {
        path: 'recommends/:id',
        name: 'RecommendPage',
        component: RecommendPage,
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile,
        meta: {
          requiresLogin: true,
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: UserSettings,
        meta: {
          requiresLogin: true,
        },
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

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    if (
      to.matched.some(
        (record: RouteRecordNormalized): boolean =>
          record.meta.requiresLogin as boolean
      ) &&
      !store.getters.isLoggedIn
    ) {
      console.log('User not logged in, redirecting...');
      return { name: 'Problemset' };
    } else {
      return true;
    }
  }
);

export default router;
