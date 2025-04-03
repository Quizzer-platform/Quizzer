<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>
    <div class="relative isolate overflow-hidden bg-white dark:bg-[#1a202c] pb-16 pt-20">

        <div class="flex flex-col items-center justify-center m-7">
            <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center m-7">
                Choose the <span class="text-teal-600 dark:text-teal-400">Perfect Plan</span> for Your
                {{ orgId ? "Organization" : "Quizzes" }}
            </h2>
<!-- Loading Spinner -->
        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading plans...</p>
        </div>
            <!-- Pricing Cards -->
                <div v-else
                    :class="{
                        'grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl': !orgId,
                        'grid grid-cols-1 md:grid-cols-2 gap-6 justify-center w-full max-w-3xl': orgId
                    }"
                >
                <div v-for="plan in (orgId ? plans : userPlans)" :key="plan.name"
                    class="relative border rounded-xl p-8 shadow-lg bg-white dark:bg-gray-800 hover:shadow-2xl hover:scale-105 hover:bg-teal-50 dark:hover:bg-gray-700 transition-all duration-300"
                    :class="{
                        'border-teal-700 dark:border-teal-500': plan.name === 'Pro Plan',
                        'border-teal-500 dark:border-teal-400': plan.name === 'Starter Plan',
                        'border-gray-300 dark:border-gray-600': plan.name === 'Free'
                    }">

                    <div class="absolute top-0 left-0 w-full h-12 rounded-t-xl"></div>

                    <h3 class="text-2xl text-center font-semibold text-gray-800 dark:text-gray-100 mt-6">{{ plan.name }}</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-center mt-2">{{ plan.description }}</p>

                    <!-- Price Display -->
                    <p class="text-3xl font-bold text-center text-gray-900 dark:text-gray-200 mt-4">{{ plan.price }}</p>

                    <button
                        class="mt-6 w-full bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-300 shadow-md cursor-pointer"
                        @click="selectPlan(plan)">
                        Get Started
                    </button>

                    <hr class="my-4 border-gray-300 dark:border-gray-600">

                    <!-- Plan Benefits -->
                    <ul class="text-left text-gray-700 dark:text-gray-300 space-y-2">
                        <li>✔ {{ plan.noOfQuizzes }} quizzes available</li>
                    </ul>
                </div>
            </div>

            <!-- Popup Modal -->
            <div v-if="showModal" class="fixed inset-0 bg-black/40 dark:bg-black/50 flex justify-center items-center z-50 px-4">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h3 class="text-lg sm:text-xl font-semibold text-red-600">
                        This Plan is for Individual Users Only
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                        The Free plan lets users take 5 quizzes before subscribing. Organizations need a paid plan to create quizzes.
                    </p>
                    <button @click="showModal = false"
                        class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 transition cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
            <!-- Admin Restriction Popup -->
            <div v-if="showAdminModal" class="fixed inset-0 bg-black/40 dark:bg-black/50 flex justify-center items-center z-50 px-4">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h3 class="text-lg sm:text-xl font-semibold text-red-600">
                        Admins Cannot Subscribe to a Plan
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                        As an admin, you do not need to subscribe to any plan. Please manage organizations and quizzes from your dashboard.
                    </p>
                    <button @click="showAdminModal = false"
                        class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 transition cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
            <!-- Login Required Popup Modal -->
<div v-if="showLoginModal" class="fixed inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 px-4">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h3 class="text-lg sm:text-xl font-semibold text-red-600">
            Login Required
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            You need to be logged in to subscribe to a plan. If you don’t have an account, sign up now to get started!
        </p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button @click="goToLogin"
                class="w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 transition cursor-pointer">
                Log In
            </button>
            <button @click="goToSignup"
                class="w-full sm:w-auto px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition cursor-pointer">
                Sign Up
            </button>
        </div>
    </div>
</div>

            <!-- Features Comparison Table -->
            <div class="max-w-5xl w-full mt-12">
                <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6">Feature Comparison</h3>
                <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 text-center">
                    <thead>
                        <tr class="bg-gray-100 dark:bg-gray-700">
                            <th class="border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-gray-100">Feature</th>
                            <th v-if="!orgId" class="border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-gray-100">Free</th>
                            <th class="border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-gray-100">Starter Plan</th>
                            <th class="border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-gray-100">Pro Plan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="feature in (orgId ? featuresForOrg : features)" :key="feature.name"
                            class="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                            <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-700 dark:text-gray-300 font-medium">
                                {{ feature.name }}
                            </td>
                            <td v-if="!orgId" class="border border-gray-300 dark:border-gray-600 dark:text-gray-100 p-3">{{ feature.free }}</td>
                            <td class="border border-gray-300 dark:border-gray-600 dark:text-gray-100 p-3">{{ feature.starter }}</td>
                            <td class="border border-gray-300 dark:border-gray-600 dark:text-gray-100 p-3">{{ feature.pro }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import { useRouter } from "vue-router";
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import { ref as dbRef, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/firebase";

export default {
    components: { Navbar, Footer },
    setup() {
        const router = useRouter();

        return { router };
    },
    data() {
        return {
            loading: true,
            isLoggedIn: false,
            showLoginModal: false,
            orgId: null, // Will store organization ID if the user is an organization
            showModal: false, // Controls popup display
            isAdmin: false, // Default false until we fetch user data
            showAdminModal: false, // New modal for admin restriction
             userPlans: [
            { name: "Free", description: "Access 5 quizzes", price: "EGP 0", noOfQuizzes: "5", maxQuestionsPerQuiz: "10" },
            { name: "Starter Plan", description: "Access 15 quizzes", price: "EGP 500", noOfQuizzes: "15", maxQuestionsPerQuiz: "20" },
            { name: "Pro Plan", description: "Access 50 quizzes", price: "EGP 1500", noOfQuizzes: "50", maxQuestionsPerQuiz: "Unlimited" },
        ],
            plans: [
                // { name: "Free", description: "Basic access", price: "EGP 0", noOfQuizzes: "5", maxQuestionsPerQuiz: "10" },
                { name: "Starter Plan", description: "For small teams", price: "EGP 1000", noOfQuizzes: "20", maxQuestionsPerQuiz: "30" },
                { name: "Pro Plan", description: "Advanced features", price: "EGP 3000", noOfQuizzes: "50", maxQuestionsPerQuiz: "Unlimited" },
            ],
            features: [
                { name: "Number of Quizzes", free: "5", starter: "20", pro: "50" },
                { name: "Max Questions per Quiz", free: "10", starter: "30", pro: "60" },
                // { name: "Quiz Reports", free: "Basic", starter: "Detailed", pro: "Full Insights" },
                // { name: "Admin Users", free: "1 Admin", starter: "5 Admins", pro: "Unlimited" },
                { name: "Scheduled Quiz Option", free: "✖", starter: "✔", pro: "✔" },
                { name: "Custom Branding", free: "✖", starter: "✔", pro: "✔" },
            ],
            featuresForOrg: [
            { name: "Number of Quizzes", starter: "20", pro: "50" },
            { name: "Max Questions per Quiz", starter: "30", pro: "60" },
            { name: "Scheduled Quiz Option", starter: "✔", pro: "✔" },
            { name: "Custom Branding", starter: "✔", pro: "✔" },
        ],
        };
    },
    async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            this.isLoggedIn = true;
            try {
                const userRef = dbRef(database, `users/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    this.orgId = snapshot.val().organizationId || null;
                    this.isAdmin = snapshot.val().role === "admin";
                } else {
                    console.log("User record not found.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                this.loading = false;
            }
        } else {
            this.isLoggedIn = false;
            // this.showLoginModal = true;
            this.loading = false;
        }
    });
},
    methods: {
        goToLogin() {
        this.showLoginModal = false;
        this.$router.push("/login");
        },
        goToSignup() {
            this.showLoginModal = false;
            this.$router.push("/usersignup");
        },
        selectPlan(plan) {
            if (!this.isLoggedIn) {
            // console.log("User is not logged in. Showing login popup.");
            this.showLoginModal = true; // Trigger login popup
            return;
            }
            // console.log("Selected Plan:", plan.name); // ✅ Debugging Log
            // console.log("orgId:", this.orgId); // ✅ Debugging Log
            if (this.isAdmin) {
            // console.log("Admin cannot subscribe to plans."); // Debugging Log
            this.showAdminModal = true;
            return;
            }
            if (plan.name === "Free") {
                if (this.orgId) {
                    // console.log("Organization trying to get Free plan. Showing modal."); // ✅ Debugging Log
                    this.showModal = true;
                } else {
                    // console.log("Redirecting individual user to quizzes page...");
                    this.$router.push("/quizzes");
                }
            } else {
                // console.log("Redirecting to payment page...");
                this.$router.push({
                    path: "/payment",
                    query: {
                        name: plan.name,
                        price: plan.price,
                        description: plan.description,
                        noOfQuizzes: plan.noOfQuizzes,
                    },
                });
            }
        },
    },
};
</script>
