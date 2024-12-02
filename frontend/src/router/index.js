import AdminDashboard from '@/views/AdminDashboard.vue';
import UserDetails from '@/views/UserDetails.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserManagement from '@/views/UserManagement.vue';
import EquipmentDetail from "@/views/EquipmentDetail.vue";
import EquipmentPage from "@/views/EquipmentPage.vue";
import EquipmentModify from "@/views/EquipmentModify.vue";

import { createRouter, createWebHistory } from 'vue-router';
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

  {
    path: '/equipment-modify',
    name: 'EquipmentModify',
    component: EquipmentModify,
  },

  {
    path: '/user-details',
    name: 'UserDetails',
    component: UserDetails,
    props: true
  },

  { path: '/equipment-detail',
    name: 'EquipmentDetail',
    component: EquipmentDetail,
    props: true },


];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
