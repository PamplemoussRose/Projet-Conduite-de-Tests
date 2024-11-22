import AdminDashboard from '@/views/AdminDashboard.vue';
import MaterialDetail from '@/views/MaterialDetail.vue';
import MaterialPage from '@/views/MaterialPage.vue';
import UserDetails from '@/views/UserDetails.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserManagement from '@/views/UserManagement.vue';

import { createRouter, createWebHistory } from 'vue-router';
<<<<<<< HEAD
=======
import UserLogin from '@/views/UserLogin.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import UserManagement from '@/views/UserManagement.vue';
import EquipmentDetail from "@/views/EquipmentDetail.vue";
import EquipmentPage from "@/views/EquipmentPage.vue";



>>>>>>> f822a57812af95c45cbaaeb5ffde68f06c06f864
const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
  },
  {
    path: '/equipment-page',
    name: 'EquipmentPage',
    component: EquipmentPage,
  },
<<<<<<< HEAD
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
=======
  { path: '/equipment-detail',
    name: 'EquipmentDetail',
    component: EquipmentDetail,
    props: true },

>>>>>>> f822a57812af95c45cbaaeb5ffde68f06c06f864
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
