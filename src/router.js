import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import OrganizationDashboardView from './views/OrganizationDashboardView.vue';
import AdminOrganizationsView from './views/AdminOrganizationsView.vue';
import AdminQuizzesEditDeleteView from "./views/AdminQuizzesEditDeleteView.vue";
import OrganizationQuizzesEditDeleteView from "./views/OrganizationQuizzesEditDelete.vue"
import AdminOrganizationDetailsView from "./views/AdminOrganizationDetailsView.vue";
import OrganizationUserView from './views/OrganizationUserView.vue';
import OrganizationUsersView from "./views/OrganizationUsersView.vue"
import UserProfileView from './views/UserProfileView.vue';
import NotFoundView from './views/NotFoundView.vue';
import Leaderboard from './components/home/Leaderboard.vue';
import CategoryView from './views/CategoryView.vue';  // The category page
import Quizlevels from "./views/QuizLevelsView.vue";
import ContactUs from "./views/ContactUsView.vue";
import PricingPage from "./components/home/PricingPage.vue";
import CategoryCreation from "./components/home/CategoryCreation.vue";

import CreateQuizView from './views/CreateQuizView.vue';
import Quizzes from './components/home/Quizzes.vue';
import QuizDetailsView from './views/QuizDetailsView.vue';
import QuizList from './views/QuizList.vue';


const routes = [
  { path: '/', component: HomeView },
  { path: '/home', redirect: '/' },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/admin', component: AdminDashboardView },
  { path: '/organization', component: OrganizationDashboardView },
  { path: '/admin/organizations', component: AdminOrganizationsView },
  { path: '/admin/organizations/:id', component: AdminOrganizationDetailsView },
  { path: '/organization/user/:id', component: OrganizationUserView },
  { path: '/organization/users', component: OrganizationUsersView },
  { path: '/admin/quizzes', component: AdminQuizzesEditDeleteView },
  { path: '/organization/quizzes',component: OrganizationQuizzesEditDeleteView,},
  { path: '/profile', component: UserProfileView },
  { path: '/admin/createQuiz', component: CreateQuizView },
  { path: '/organization/createQuiz', component: CreateQuizView },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/categories', component: CategoryView },
  { path: '/admin/categorycreation', component: CategoryCreation },

  { path: '/quizLevels', component: Quizlevels },
  { path: '/contactus', component: ContactUs },
  { path: '/pricing', component: PricingPage },
  { path: '/quizzes', component: Quizzes },
  { path: '/quizDetails', component: QuizDetailsView },

{ path: '/quizzes/:quizId', name: 'quizlist', component: QuizList, props: true },
  { path: '/:notFound(.*)', component: NotFoundView }, // this must be at end all time
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router 
