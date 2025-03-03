import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import UserProfileView from './views/UserProfileView.vue';
import NotFoundView from './views/NotFoundView.vue';
<<<<<<< HEAD
import CategoryPage from '@/views/CategoryPage.vue';  
import Leaderboard from './components/home/Leaderboard.vue';
=======
import CategoryPage from '@/views/CategoryPage.vue';  // The category page
import Quizlevels from "@/views/QuizLevels.vue";
>>>>>>> 0b8494e9df5d8458444121c77170f5447dfeef5b

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/admin', component: AdminDashboardView },
    { path: '/profile', component: UserProfileView },
<<<<<<< HEAD
    { path: '/leaderboard', component: Leaderboard },

    { path: '/:notFound(.*)', component: NotFoundView },
=======
>>>>>>> 0b8494e9df5d8458444121c77170f5447dfeef5b
    { path: '/categories', component: CategoryPage },
    { path: '/quizLevels', component:Quizlevels },
    { path: '/:notFound(.*)', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 
