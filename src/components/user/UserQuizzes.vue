<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <div class="flex-1 min-h-screen bg-gray-100 md:ml-54">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                            <h1 class="text-2xl font-bold text-teal-800">Your Quiz Performance</h1>
                            <div class="mt-4 md:mt-0">
                                <p class="text-lg font-semibold">Overall Rank: <span class="text-teal-600">#{{ userRank
                                }}</span></p>
                                <p class="text-lg font-semibold">Total Score: <span class="text-teal-600">{{ totalScore
                                }}</span></p>
                            </div>
                        </div>

                        <div v-if="loading" class="text-center py-8">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
                            <p class="text-gray-600 mt-4">Loading your quizzes...</p>
                        </div>

                        <div v-else-if="userQuizzes.length > 0"
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.quizId"
                                class="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-semibold text-white bg-teal-600 px-3 py-1 my-2 rounded-full">
                                        {{ quiz.title }} </span>
                                    <span class="text-sm font-semibold text-gray-700">
                                        {{ new Date(quiz.timestamp).toLocaleDateString() }}
                                    </span>
                                </div>
                                <h3 class="font-bold text-sm text-gray-800 truncate">Describtion: {{ quiz.category ||
                                    'General' }}</h3>
                                <p class="text-sm text-gray-600 mt-1">
                                    Questions: {{ quiz.totalQuestions }}
                                </p>
                                <p class="mt-2 text-sm font-medium">
                                    Score:
                                    <span :class="quiz.quizScore >= quiz.totalQuestions / 2 ? 'text-green-600' : 'text-red-600'"
                                        class="font-bold">
                                        {{ quiz.quizScore }} / {{ quiz.totalQuestions }}
                                    </span>
                                </p>
                                <!-- In the template, update the button -->
                                <button @click="goToQuizAnswers(quiz.quizId)"
                                    class="mt-6 bg-teal-700 hover:bg-teal-900 mb-6 cursor-pointer text-white px-6 py-2 rounded-lg shadow-md transition">
                                    Check Correct Answers
                                </button>
                            </div>
                        </div>

                        <div v-else class="text-center py-12">
                            <div class="text-6xl mb-4">📝</div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">No Quizzes Completed Yet</h3>
                            <p class="text-gray-600 mb-8">Start your learning journey by taking your first quiz!</p>
                            <router-link to="/quizzes"
                                class="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors  cursor-pointer">
                                Browse Available Quizzes
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup إذا كان quizzesToTake = 0 -->
        <div v-if="quizzesToTake === 0"
            class="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 px-4">
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 class="text-lg sm:text-xl font-semibold text-red-600">❌ Access Denied!</h2>
                <p class="text-gray-600 mt-2 text-sm sm:text-base">
                    To know your progress or to take another exam, you need to subscribe.
                </p>
                <div class="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <button @click="goToPricing"
                        class="w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition cursor-pointer">
                        Go to pricing
                    </button>
                    <button @click="goToProfile"
                        class="w-full sm:w-auto px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition cursor-pointer">
                        Go back to Profile
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { ref as dbRef, get, onValue, off, update } from 'firebase/database';
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
            loading: true
        };
    },
    computed: {
        userId() {
            return this.$store.state.user?.uid;
        }
    },
    methods: {
        async fetchUserQuizzes() {
            this.loading = true;
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            this.listener = onValue(userRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    // console.log("User Data from Firebase:", userData);

                    this.totalScore = userData.overallScore || 0;
                    this.quizzesToTake = userData.quizzesToTake || 0;

                    if (userData.attemptedQuizzes) {
                        this.userQuizzes = userData.attemptedQuizzes.slice(1).map((attempt) => ({
                            quizId: attempt.quizId,
                            title: attempt.title || 'Untitled',
                            category: attempt.category || 'General',
                            timestamp: attempt.timestamp || '',
                            totalQuestions: attempt.totalQuestions || 0,
                            quizScore: attempt.quizScore || 0
                        }));
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
        goToPricing() {
            this.$router.push("/pricing");
        },
        goToQuizAnswers(quizId) {
            if (!quizId) return;
            this.$router.push(`/quiz/quizAnswers/${quizId}`);
        },
    },
    mounted() {
        if (this.userId) {
            this.fetchUserQuizzes();
        }
    },
    beforeUnmount() {
        if (this.listener && this.quizzesRef) {
            off(this.quizzesRef, this.listener);
        }
    }
};
</script>
