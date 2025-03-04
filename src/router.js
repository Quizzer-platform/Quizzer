import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import AdminOrganizationsView from './views/AdminOrganizationsView.vue';
import UserProfileView from './views/UserProfileView.vue';
import NotFoundView from './views/NotFoundView.vue';
import Leaderboard from './components/home/Leaderboard.vue';
import CategoryView from './views/CategoryView.vue';  // The category page
import Quizlevels from "./views/QuizLevelsView.vue";
import ContactUs from "./views/ContactUsView.vue";
import PricingPage from "./components/home/PricingPage.vue";
import CreateQuizView from './views/CreateQuizView.vue';
import Quizzes from './components/home/Quizzes.vue';



const routes = [
    { path: '/', component: HomeView },
    { path: '/home', redirect: '/' },
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/admin', component: AdminDashboardView },
    { path: '/admin/organizations', component: AdminOrganizationsView },
    { path: '/profile', component: UserProfileView },
    { path: '/admin/createQuiz', component: CreateQuizView },

    { path: '/leaderboard', component: Leaderboard },
    { path: '/categories', component: CategoryView },
    { path: '/quizLevels', component: Quizlevels },
    { path: '/contactus', component: ContactUs },
    { path: '/pricing', component: PricingPage },
    { path: '/quizzes', component: Quizzes },


    { path: '/:notFound(.*)', component: NotFoundView }, // this must be at end all time 
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router 
