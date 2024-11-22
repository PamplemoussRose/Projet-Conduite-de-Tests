import AdminDashboard from '@/views/AdminDashboard.vue';
import MaterialDetail from '@/views/MaterialDetail.vue';
import MaterialPage from '@/views/MaterialPage.vue';
import UserDetails from '@/views/UserDetails.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserManagement from '@/views/UserManagement.vue';

import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/manage-users',
    name: 'UserManagement',
    component: UserManagement,
  },
  {
    path: '/materials',
    name: 'MaterialPage',
    component: MaterialPage
  },
  {
    path: '/material/:id',
    name: 'MaterialDetail',
    component: MaterialDetail,
    props: true
  },
  {
    path: '/user/:id',
    name: 'UserDetails',
    component: UserDetails,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
