import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import UserProfileView from './views/UserProfileView.vue';
import NotFoundView from './views/NotFoundView.vue';
import Leaderboard from './components/home/Leaderboard.vue';
import CategoryPage from '@/views/CategoryPage.vue';  // The category page
import Quizlevels from "@/views/QuizLevels.vue";
import ContactUs from "@/views/ContactUs.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/admin', component: AdminDashboardView },
    { path: '/profile', component: UserProfileView },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/:notFound(.*)', component: NotFoundView },
    { path: '/categories', component: CategoryPage },
    { path: '/quizLevels', component:Quizlevels },
    { path: '/contactus', component:ContactUs },


    { path: '/:notFound(.*)', component: NotFoundView }, // this must be at end all time 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 
