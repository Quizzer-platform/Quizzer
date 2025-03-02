import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import UserProfileView from './views/UserProfileView.vue';
import NotFoundView from './views/NotFoundView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/admin', component: AdminDashboardView },
    { path: '/profile', component: UserProfileView },
    { path: '/:notFound(.*)', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 
