<template>
    <div v-if="loading" class="flex flex-col justify-center items-center min-h-screen">
        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quiz details...</p>
    </div>

    <div v-else class="flex flex-col items-center md:w-full md:flex-row md:items-start md:gap-4 max-w-6xl mx-auto p-6">
        <div
            class="flex flex-col my-4 p-4 rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 dark:text-white md:w-[50%]">
            <div
                class="flex flex-col items-start bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-md md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 m-2">{{ QuizName }}</h2>
                </div>
                <div>
                    <button @click="handleStartQuiz"
                        class="bg-teal-700 text-white px-4 py-2 m-2 rounded-lg hover:bg-teal-500 cursor-pointer">
                        Start now
                    </button>
                </div>
            </div>
            <div class="flex flex-col mt-4 font-semibold m-2 p-4 rounded-xl w-fit">
                <div
                    class="bg-teal-200 dark:bg-teal-700 dark:text-white m-2 p-4 rounded-xl shadow-md hover:bg-teal-100 dark:hover:bg-teal-600">
                    &#10004; {{ categoryTitle || 'Category not found' }}
                </div>
                <div
                    class="bg-red-200 dark:bg-red-800 dark:text-white m-2 p-4 rounded-xl shadow-md hover:bg-red-100 dark:hover:bg-red-600">
                    &#10004; {{ QuizDuration }} min
                </div>
                <div
                    class="bg-orange-200 dark:bg-orange-800 dark:text-white m-2 p-4 rounded-xl shadow-md hover:bg-orange-100 dark:hover:bg-orange-600">
                    &#10004; Low
                </div>
            </div>
        </div>

        <div class="md:w-[50%]">
            <div class="p-4 my-8 rounded-xl shadow-md md:w-full bg-gray-100 dark:bg-gray-900">
                <div class="p-4 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-teal-700 dark:text-teal-300">Summary of the {{ QuizName }}
                        test</h3>
                    <p class="mt-2 text-gray-800 dark:text-gray-100">{{ QuizDescribtion }}</p>
                </div>
            </div>
            <details class="bg-gray-100 p-4 rounded-lg dark:bg-gray-900">
                <summary class="font-semibold cursor-pointer text-teal-700 dark:text-teal-300">Who Created it</summary>
                <p class="mt-2 text-gray-800 dark:text-gray-100">Industry experts and professionals created this test.
                </p>
            </details>
            <details class="bg-gray-100 p-4 rounded-lg dark:bg-gray-900 my-2">
                <summary class="font-semibold cursor-pointer text-teal-700 dark:text-teal-300 capitalize">more about the
                    quiz</summary>
                <p class="mt-2 text-gray-800 dark:text-gray-100 capitalize ">number of questions : <span
                        class="font-bold text-teal-600 dark:text-teal-800"> {{ numberOfQuestions }} </span></p>
                <p class="mt-2 text-gray-800 dark:text-gray-100 capitalize ">score per question : <span
                        class="font-bold text-teal-600 dark:text-teal-800"> {{ scorePerQuestion }} </span></p>

            </details>
        </div>
    </div>

    <div v-if="showSubscriptionPopup"
        class="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 px-4">
        <div class="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 class="text-lg sm:text-xl font-semibold text-red-600">❌ Access Denied!</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                To take another exam, you need to subscribe.
            </p>
            <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button @click="goToPricing"
                    class="w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition cursor-pointer">
                    Explore Pricing Plans
                </button>
                <button @click="goToHome"
                    class="w-full sm:w-auto px-5 py-2 bg-gray-400 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-500 transition cursor-pointer">
                    Go back to Home
                </button>
            </div>
        </div>
    </div>

    <div v-if="showAlreadyTakenPopup"
        class="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 px-4">
        <div class="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 class="text-lg sm:text-xl font-semibold text-red-600">❌ Access Denied!</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                You have already taken this quiz!
            </p>
            <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button @click="goToQuizzes"
                    class="w-full sm:w-auto px-5 py-2 bg-gray-400 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-500 transition cursor-pointer">
                    Go back to Quizzes page
                </button>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
        <div class="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 class="text-lg sm:text-xl font-semibold text-red-600">Quizzes Are Meant for Users Only</h3>
            <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                You cannot join this quiz because you are an {{ userRole }} {{ organizationName ? `from
                ${organizationName}` : '' }}.
            </p>
            <button @click="showModal = false"
                class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition cursor-pointer">
                OK
            </button>
        </div>
    </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";

export default {
    data() {
        return {
            quiz: {},
            QuizName: "",
            QuizDescribtion: "",
            QuizDuration: "",
            category: "",
            categoryTitle: "",
            numberOfQuestions: "",
            scorePerQuestion: "",
            loading: true,
            showModal: false,
            userRole: "",
            organizationName: "",
            showSubscriptionPopup: false,
            showAlreadyTakenPopup: false,
        };
    },

    methods: {
        async fetchUserRole() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const db = getDatabase();
                const userRef = dbRef(db, `users/${user.uid}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    this.userRole = userData.role;
                    this.organizationName = userData.organization || "";
                }
            }
        },

        async quizAlreadyTaken() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) return false;

            try {
                const db = getDatabase();
                const userRef = dbRef(db, `users/${user.uid}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const attemptedQuizzes = userData.attemptedQuizzes || [];
                    const quizId = this.$route.params.quizId;

                    if (attemptedQuizzes.some(q => q.quizId === quizId)) {
                        this.showAlreadyTakenPopup = true;
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error("Error checking quiz attempts:", error);
                return false;
            }
        },

        async checkSubscription() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) return;

            try {
                const db = getDatabase();
                const userRef = dbRef(db, `users/${user.uid}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const quizzesToTake = userData.quizzesToTake || 0;

                    if (quizzesToTake === 0) {
                        this.showSubscriptionPopup = true;
                        return false;
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error checking subscription:", error);
                return false;
            }
        },

        async handleStartQuiz() {
            console.log("User Role:", this.userRole);
            if (this.userRole === "admin" || this.userRole === "organization_admin") {
                this.showModal = true;
                return;
            }

            const hasSubscription = await this.checkSubscription();
            console.log("Has Subscription:", hasSubscription);
            if (!hasSubscription) return;

            const alreadyTaken = await this.quizAlreadyTaken();
            console.log("Already Taken:", alreadyTaken);
            if (alreadyTaken) return;

            console.log("Quiz Data:", this.quiz);
            if (!this.quiz.id) {
                console.error("Quiz ID is missing");
                return;
            }

            this.$router.push(`/quizzes/${this.quiz.id}`);
        },

        async loadQuizDetails() {
            const quizId = this.$route.params.quizId;
            if (!quizId) {
                this.loading = false;
                return;
            }

            try {
                const quizResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes/${quizId}.json`);
                const quizData = await quizResponse.json();

                if (quizData) {
                    this.quiz = { ...quizData, id: quizId };
                    this.QuizName = quizData.title;
                    this.QuizDescribtion = quizData.description;
                    this.QuizDuration = quizData.duration;
                    this.category = quizData.category;
                    this.numberOfQuestions = quizData.numberOfQuestions;
                    this.scorePerQuestion = quizData.scorePerQuestion;

                    const categoriesResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/categories.json`);
                    const categoriesData = await categoriesResponse.json();

                    if (categoriesData) {
                        const matchedCategory = Object.entries(categoriesData).find(
                            ([_, cat]) => cat.quizzes && cat.quizzes.includes(quizId)
                        );

                        if (matchedCategory) {
                            this.categoryTitle = matchedCategory[1].title;
                        } else {
                            this.categoryTitle = "Category not found";
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading quiz details:", error);
            } finally {
                this.loading = false;
            }
        },
        goToHome() {
            this.$router.push("/");
        },
        goToProfile() {
            this.$router.push("/profile");
        },
        goToPricing() {
            this.$router.push("/pricing");
        },
        goToQuizzes() {
            this.$router.push("/quizzes");
        }
    },

    async mounted() {
        await this.fetchUserRole();  // Fetch user role before loading quiz details
        this.loadQuizDetails();
    }
};
</script>
