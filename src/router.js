import { createWebHistory, createRouter } from 'vue-router';
import store from './store';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';
import AdminDashboardView from './views/AdminDashboardView.vue';
import OrganizationDashboardView from './views/OrganizationDashboardView.vue';
import AdminOrganizationsView from './views/AdminOrganizationsView.vue';
import AdminUsersView from './views/AdminUsersView.vue';
import AdminUserView from './views/AdminUserView.vue';
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
import PaymentPage from "./components/payment/PaymentPage.vue"
import ConfirmationPage from "./components/payment/Confirmation.vue"
import CategoryCreation from "./components/home/CategoryCreation.vue";

import CreateQuizView from './views/CreateQuizView.vue';
import OrganizationCreateQuizView from './views/OrganizationCreateQuizView.vue';
import Quizzes from './components/home/Quizzes.vue';
import QuizDetailsView from './views/QuizDetailsView.vue';
import QuizList from './views/QuizList.vue';
import OrganizationSignupForm from './components/auth/OrganizationSignupForm.vue';
import UserQuizzes from './components/user/UserQuizzes.vue';
import UserOrganization from './components/user/UserOrganization.vue';
import UserSubscription from './components/user/UserSubscription.vue';
import NotifyUser from './components/organization/NotifyUser.vue';
import EnterCode from './components/home/EnterCode.vue';
import AdminCategoryEditDelete from './components/admin/AdminCategoryEditDelete.vue';
import QuizAnswers from './components/quiz/QuizAnswers.vue';
import QuizPreview from './components/quiz/QuizPreview.vue';

// import CardPayment from './components/payment/CardPayment.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/home', redirect: '/' },
    // { path: '/cardpayment', component: CardPayment },
    { path: '/login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/usersignup', component: SignupView, meta: { requiresGuest: true } },
    { path: '/organizationsignup', component: OrganizationSignupForm },
    { path: '/admin', component: AdminDashboardView, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/organization', component: OrganizationDashboardView, meta: { requiresAuth: true } },
    { path: '/admin/organizations', component: AdminOrganizationsView, meta: { requiresAuth: true } },
    { path: '/admin/users', component: AdminUsersView, meta: { requiresAuth: true } },
    { path: '/admin/organizations/:id', component: AdminOrganizationDetailsView, meta: { requiresAuth: true } },
    { path: '/organization/user/:id', component: OrganizationUserView, meta: { requiresAuth: true } },
    { path: '/admin/user/:id', component: AdminUserView, meta: { requiresAuth: true } },
    { path: '/organization/users', component: OrganizationUsersView, meta: { requiresAuth: true } },
    { path: '/admin/quizzes', component: AdminQuizzesEditDeleteView, meta: { requiresAuth: true } },
    { path: '/organization/quizzes', component: OrganizationQuizzesEditDeleteView, meta: { requiresAuth: true } },
    { path: '/profile', component: UserProfileView, meta: { requiresAuth: true } },
    { path: '/admin/createQuiz', component: CreateQuizView, meta: { requiresAuth: true } },
    { path: '/organization/createQuiz', component: OrganizationCreateQuizView, meta: { requiresAuth: true } },
    { path: "/organization/quizzes/:quizId", name: "editQuiz", component: OrganizationCreateQuizView, props: true, meta: { requiresAuth: true } },
    { path: "/admin/quizzes/:quizId", name: "adminEditQuiz", component: CreateQuizView, props: true, meta: { requiresAuth: true } },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/categories', component: CategoryView },
    { path: '/admin/categorycreation', component: CategoryCreation, meta: { requiresAuth: true } },
    { path: '/admin/categories', component: AdminCategoryEditDelete, meta: { requiresAuth: true } },
    { path: '/notifyuser', component: NotifyUser },
    { path: '/quizLevels', component: Quizlevels },
    { path: '/contactus', component: ContactUs },
    { path: '/pricing', component: PricingPage },
    { path: '/payment', component: PaymentPage },
    { path: '/payment/confirmation', component: ConfirmationPage },
    { path: '/quizzes', component: Quizzes },
    // { path: '/quizDetails', component: QuizDetailsView },
    { path: '/entercode', component: EnterCode },

    { path: "/quiz/:quizId", name: "quizDetails", component: QuizDetailsView, props: true },
    { path: '/quizzes/:quizId', name: 'quizlist', component: QuizList, props: true, meta: { requiresAuth: true } },

    { path: '/quiz/quizAnswers/:quizId', name: 'quizanswers', component: QuizAnswers, props: true, meta: { requiresAuth: true } },
    { path: '/quiz/quizPreview/:quizId', name: 'quizpreview', component: QuizPreview, props: true, meta: { requiresAuth: true } },

    { path: '/profile/userQuizzes', component: UserQuizzes, meta: { requiresAuth: true } },
    { path: '/profile/userOrg', component: UserOrganization, meta: { requiresAuth: true } },
    { path: '/profile/userSubscription', component: UserSubscription, meta: { requiresAuth: true } },

    { path: '/:notFound(.*)', component: NotFoundView }, // this must be at end all time
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Always scroll to top
        return { top: 0, behavior: 'smooth' }
    }
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAuth && !user) {
        next('/login');
    } else if (requiresAdmin && user?.role !== 'admin') {
        next('/');
    } else {
        next();
    }
});

export default router 
