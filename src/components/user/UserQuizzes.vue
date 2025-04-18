<template>
    <div class="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-[#1a202c] dark:text-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />
            <div class="flex-1 min-h-screen bg-gray-100 dark:bg-[#1a202c] md:ml-50">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white dark:bg-gray-900/60 dark:text-gray-200 rounded-lg shadow-lg p-6 mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                            <h1 class="text-2xl font-bold text-teal-800 dark:text-teal-400">Your Quiz Performance</h1>
                            <div class="mt-4 md:mt-0">
                                <p class="text-lg font-semibold">
                                    Overall Rank: <span class="text-teal-600 dark:text-teal-300">#{{ userRank }}</span>
                                </p>
                                <p class="text-lg font-semibold">
                                    Total Score: <span class="text-teal-600 dark:text-teal-300">{{ totalScore }}</span>
                                </p>
                                <p class="text-lg font-semibold">
                                    Remaining Quizzes: 
                                    <span class="text-teal-600 dark:text-teal-300">{{ quizzesToTake }}</span>
                                </p>
                            </div>
                        </div>
                        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                            <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Quizzes...</p>
                        </div>

                        <div v-else-if="userQuizzes.length > 0"
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.quizId"
                                class="bg-gray-50 dark:bg-gray-900/85 text-gray-900 dark:text-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <span
                                        class="text-sm font-semibold px-3 py-1 my-2 rounded-full bg-teal-600 text-white dark:bg-teal-700 dark:text-gray-200">
                                        {{ quiz.title }}
                                    </span>
                                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                        {{ new Date(quiz.timestamp).toLocaleDateString() }}
                                    </span>
                                </div>
                                <h3 class="font-bold text-sm truncate">Description: {{ quiz.category || 'General' }}
                                </h3>
                                <p class="text-sm mt-1">Questions: {{ quiz.totalQuestions }}</p>
                                <p class="mt-2 text-sm font-medium">
                                    Score:
                                    <span
                                        :class="quiz.quizScore >= quiz.totalScore / 2 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                                        class="font-bold">
                                        {{ quiz.quizScore }} / {{ quiz.totalScore }}
                                    </span>
                                </p>
                                <button @click="goToQuizAnswers(quiz.quizId)"
                                    class="my-6 bg-teal-700 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow-md transition cursor-pointer">
                                    Check Correct Answers
                                </button>
                            </div>
                        </div>

                        <div v-else class="text-center py-12">
                            <div class="text-6xl mb-4">📝</div>
                            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
                                No Quizzes Completed Yet
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-8">
                                Start your learning journey by taking your first quiz!
                            </p>
                            <router-link to="/quizzes"
                                class="inline-block bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer">
                                Browse Available Quizzes
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup if quizzesToTake = 0 -->
<div v-if="showNoQuizzesPopup" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4" @click="closeNoQuizzesPopup">
    <div
        class="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md text-center" @click.stop>
        <h2 class="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400">Quiz Limit Reached</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            You've used all your available quiz attempts. To take more quizzes , 
            please subscribe to our plans.
        </p>
        <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base font-medium">
            You can still review your previous quiz results below.
        </p>
        <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button @click="goToPricing"
                class="w-full sm:w-auto px-5 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-md transition cursor-pointer">
                Subscribe Now
            </button>
            <button @click="closeNoQuizzesPopup"
                class="w-full sm:w-auto px-5 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition cursor-pointer">
                Close
            </button>
        </div>
    </div>
</div>
    </div>
</template>

<script>
import { ref as dbRef, get, onValue, off, update, getDatabase } from 'firebase/database';
import { database } from '@/firebase';
import UserSidebar from './UserSidebar.vue';

export default {
    name: 'UserQuizzes',
    components: {
        UserSidebar
    },
    data() {
        return {
            isMenuOpen: false,
            userQuizzes: [],
            userRank: 0,
            totalScore: 0,
            quizzesToTake: 5,
            quizzesRef: null,
            listener: null,
            loading: true,
            quizData: [], // Add this to store quiz data
            showNoQuizzesPopup: false ,
        };
    },
    computed: {
        userId() {
            return this.$store.state.user?.uid;
        }
    },
    methods: {
        async loadQuizzes() {
            return new Promise((resolve, reject) => {
                fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json`)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            this.quizData = Object.entries(data).map(([id, quiz]) => ({
                                id: id,
                                numberOfQuestions: quiz.numberOfQuestions,
                                scorePerQuestion: quiz.scorePerQuestion,
                                totalScore: quiz.numberOfQuestions * quiz.scorePerQuestion
                            }));
                            
                            // After loading quiz data, fetch organization quizzes
                            this.fetchOrganizationQuizzes().then(() => {
                                resolve();
                            });
                        } else {
                            this.quizData = [];
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('Error loading quizzes:', error);
                        this.quizData = [];
                        reject(error);
                    });
            });
        },
        
        fetchOrganizationQuizzes() {
            return new Promise((resolve) => {
                const db = getDatabase();
                const orgQuizzesRef = dbRef(db, "organizationQuizzes");
                
                get(orgQuizzesRef)
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            // Get all organization quizzes
                            const orgQuizzes = Object.entries(data)
                                .map(([id, quiz]) => ({
                                    id: id,
                                    numberOfQuestions: quiz.numberOfQuestions || 0,
                                    scorePerQuestion: quiz.scorePerQuestion || 1,
                                    totalScore: (quiz.numberOfQuestions || 0) * (quiz.scorePerQuestion || 1)
                                }));
                                
                            // Merge with existing quiz data
                            this.quizData = [...this.quizData, ...orgQuizzes];
                            console.log("Organization quizzes loaded:", orgQuizzes.length);
                        } else {
                            console.log("No organization quizzes found");
                        }
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error fetching organization quizzes:", error);
                        resolve();
                    });
            });
        },
        
        calculateQuizTotal(quizId) {
            if (!quizId) return 0;
            
            // First check if the quiz exists in our combined quiz data
            const quiz = this.quizData.find(q => q.id === quizId);
            if (quiz) {
                return quiz.totalScore;
            }
            
            return 0;
        },
        
        async fetchUserQuizzes() {
            this.loading = true;
            if (!this.userId) return;

            // Load quizzes data first
            await this.loadQuizzes();

            const userRef = dbRef(database, `users/${this.userId}`);
            this.listener = onValue(userRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();

                    this.totalScore = userData.overallScore || 0;
                    this.quizzesToTake = userData.quizzesToTake || 0;
                    if (this.quizzesToTake === 0) {
                    this.showNoQuizzesPopup = true;
                    }
                    if (userData.attemptedQuizzes) {
                        this.userQuizzes = userData.attemptedQuizzes.slice(1).map((attempt) => {
                            const quizTotal = this.calculateQuizTotal(attempt.quizId);
                            return {
                                quizId: attempt.quizId,
                                title: attempt.title || 'Untitled',
                                category: attempt.category || 'General',
                                timestamp: attempt.timestamp || '',
                                totalQuestions: attempt.totalQuestions || 0,
                                quizScore: attempt.quizScore || 0,
                                totalScore: quizTotal // Add the total score
                            };
                        });
                    } else {
                        this.userQuizzes = [];
                    }

                    this.calculateUserRank();
                } else {
                    console.warn("No user data found.");
                    this.totalScore = 0;
                    this.userQuizzes = [];
                }

                this.loading = false;
            });

            this.quizzesRef = userRef;
        },

        async calculateUserRank() {
            try {
                const usersRef = dbRef(database, 'users');
                const usersSnapshot = await get(usersRef);

                if (usersSnapshot.exists()) {
                    const users = Object.entries(usersSnapshot.val())
                        .map(([uid, userData]) => ({
                            uid,
                            overallScore: userData.overallScore || 0
                        }))
                        .filter(user => user.overallScore > 0)
                        .sort((a, b) => b.overallScore - a.overallScore);

                    const userIndex = users.findIndex(user => user.uid === this.userId);
                    this.userRank = userIndex !== -1 ? userIndex + 1 : users.length + 1;
                } else {
                    this.userRank = 1;
                }
            } catch (error) {
                console.error('Error calculating user rank:', error);
                this.userRank = 0;
            }
        },
        closeNoQuizzesPopup() {
        this.showNoQuizzesPopup = false;
        },
        goToPricing() {
            this.$router.push("/pricing");
        },
        goToProfile() {
            this.$router.push("/profile/userQuizzes");
        },
        goToQuizAnswers(quizId) {
            if (!quizId) return;
            this.$router.push(`/quiz/quizAnswers/${quizId}`);
        },
    },
    async mounted() {
        if (this.userId) {
            await this.fetchUserQuizzes();
        }
    },
    beforeUnmount() {
        if (this.listener && this.quizzesRef) {
            off(this.quizzesRef, this.listener);
        }
    }
};
</script>
