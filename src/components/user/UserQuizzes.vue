<!-- <template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar v-model:isMenuOpen="isMenuOpen" />

            <div class="flex-1 min-h-screen bg-gray-100">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                            <h1 class="text-2xl font-bold text-teal-800">Your Quiz Performance</h1>
                            <div class="mt-4 md:mt-0">
                                <p class="text-lg font-semibold">Overall Rank: <span class="text-teal-600">#{{ userRank }}</span></p>
                                <p class="text-lg font-semibold">Total Score: <span class="text-teal-600">{{ totalScore }}</span></p>
                            </div>
                        </div>

                        <div v-if="loading" class="text-center py-8">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
                            <p class="text-gray-600 mt-4">Loading your quizzes...</p>
                        </div>

                        <div v-else-if="userQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.id"
                                class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between">
                                    <div class="w-16 h-10 bg-teal-100 flex items-center justify-center">
                                        {{ quiz.category }}
                                    </div>
                                    <p class="font-bold text-teal-700">Score: {{ quiz.score }}/{{ quiz.totalQuestions }}</p>
                                </div>
                                <p class="font-bold mt-2 truncate">{{ quiz.title }}</p>
                                <p class="text-gray-500 mt-2 line-clamp-2">{{ quiz.description }}</p>
                                <div class="mt-2 text-sm text-gray-600">
                                    <p>Duration: {{ quiz.duration }} minutes</p>
                                    <p>Questions: {{ quiz.totalQuestions }}</p>
                                </div>
                                <div class="flex justify-end mt-6">
                                    <router-link :to="`/quiz/${quiz.id}/results`"
                                        class="bg-teal-600 text-white p-2 rounded hover:bg-teal-700 transition-colors">
                                        View Details
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-12">
                            <div class="text-6xl mb-4">📝</div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">No Quizzes Completed Yet</h3>
                            <p class="text-gray-600 mb-8">Start your learning journey by taking your first quiz!</p>
                            <router-link to="/quizzes" 
                                class="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                                Browse Available Quizzes
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as dbRef, get, onValue, off } from 'firebase/database';
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
        async fetchQuizDetails(quizId) {
            try {
                const quizRef = dbRef(database, `quizzes/${quizId}`);
                const snapshot = await get(quizRef);
                if (snapshot.exists()) {
                    return snapshot.val();
                }
                return null;
            } catch (error) {
                console.error(`Error fetching quiz details for ${quizId}:`, error);
                return null;
            }
        },

        async fetchUserQuizzes() {
            this.loading = true;
            try {
                if (!this.userId) {
                    console.warn('No user ID found');
                    return;
                }

                const userRef = dbRef(database, `users/${this.userId}`);
                this.listener = onValue(userRef, async (snapshot) => {
                    try {
                        const userData = snapshot.val();
                        if (userData && userData.attemptedQuizzes) {
                            this.totalScore = userData.overallScore|| 0;
                            
                            const detailedQuizzes = await Promise.all(
                                userData.attemptedQuizzes.map(async (attempt) => {
                                    const quizDetails = await this.fetchQuizDetails(attempt.quizId);
                                    if (quizDetails) {
                                        return {
                                            id: attempt.quizId,
                                            score: attempt.quizScore,
                                            title: quizDetails.title,
                                            category: quizDetails.category,
                                            description: quizDetails.description,
                                            duration: quizDetails.duration,
                                            totalQuestions: quizDetails.questions ? quizDetails.questions.length : 0,
                                            timestamp: quizDetails.createdAt
                                        };
                                    }
                                    return null;
                                })
                            );

                            this.userQuizzes = detailedQuizzes.filter(quiz => quiz !== null);
                        } else {
                            this.userQuizzes = [];
                            this.totalScore = 0;
                        }

                        // Fetch user rank based on overall scores
                        const usersRef = dbRef(database, 'users');
                        const usersSnapshot = await get(usersRef);
                        if (usersSnapshot.exists()) {
                            const users = Object.values(usersSnapshot.val())
                                .filter(user => user && user.overallScore !== undefined)
                                .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
                            
                            this.userRank = users.findIndex(user => user.uid === this.userId) + 1;
                            if (this.userRank === 0) {
                                this.userRank = users.length + 1;
                            }
                        }
                    } catch (error) {
                        console.error('Error processing quiz data:', error);
                        this.userQuizzes = [];
                        this.totalScore = 0;
                        this.userRank = 0;
                    } finally {
                        this.loading = false;
                    }
                });

                this.quizzesRef = userRef;
            } catch (error) {
                console.error('Error fetching user quizzes:', error);
                this.userQuizzes = [];
                this.totalScore = 0;
                this.userRank = 0;
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchUserQuizzes();
    },
    beforeUnmount() {
        if (this.quizzesRef && this.listener) {
            off(this.quizzesRef, this.listener);
            this.listener = null;
            this.quizzesRef = null;
        }
    }
};
</script> -->
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
                                <p class="text-lg font-semibold">Overall Rank: <span class="text-teal-600">#{{ userRank }}</span></p>
                                <p class="text-lg font-semibold">Total Score: <span class="text-teal-600">{{ totalScore }}</span></p>
                            </div>
                        </div>

                        <div v-if="loading" class="text-center py-8">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
                            <p class="text-gray-600 mt-4">Loading your quizzes...</p>
                        </div>

                        <div v-else-if="userQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.id" class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between">
                                    <div class="w-16 h-10 bg-teal-100 flex items-center justify-center">
                                        {{ quiz.category }}
                                    </div>
                                    <p class="font-bold text-teal-700">Score: {{ quiz.score }}/{{ quiz.totalQuestions }}</p>
                                </div>
                                <p class="font-bold mt-2 truncate">{{ quiz.title }}</p>
                                <p class="text-gray-500 mt-2 line-clamp-2">{{ quiz.description }}</p>
                                <div class="mt-2 text-sm text-gray-600">
                                    <p>Duration: {{ quiz.duration }} minutes</p>
                                    <p>Questions: {{ quiz.totalQuestions }}</p>
                                </div>
                                <div class="flex justify-end mt-6">
                                    <router-link :to="`/quiz/${quiz.id}/results`"
                                        class="bg-teal-600 text-white p-2 rounded hover:bg-teal-700 transition-colors">
                                        View Details
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-12">
                            <div class="text-6xl mb-4">📝</div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">No Quizzes Completed Yet</h3>
                            <p class="text-gray-600 mb-8">Start your learning journey by taking your first quiz!</p>
                            <router-link to="/quizzes" 
                                class="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                                Browse Available Quizzes
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup إذا كان quizzesToTake = 0 -->
        <div v-if="quizzesToTake === 0" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 class="text-xl font-bold text-red-600">Subscription Required</h2>
                <p class="text-gray-700 mt-2">To take another exam, you need to subscribe.</p>
                <router-link to="/pricing" class="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                    Go to Pricing
                </router-link>
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
            quizzesToTake: 1, // افتراضي حتى يتم التحديث
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
                    console.log("User Data from Firebase:", userData);

                    this.totalScore = userData.overallScore || 0;
                    this.quizzesToTake = userData.quizzesToTake || 0;

                    if (userData.attemptedQuizzes) {
                        const detailedQuizzes = await Promise.all(
                            userData.attemptedQuizzes.map(async (attempt) => {
                                const quizDetails = await this.fetchQuizDetails(attempt.quizId);
                                return quizDetails ? { ...quizDetails, id: attempt.quizId, score: attempt.quizScore } : null;
                            })
                        );

                        this.userQuizzes = detailedQuizzes.filter(quiz => quiz !== null);
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

        async fetchQuizDetails(quizId) {
            try {
                const quizRef = dbRef(database, `quizzes/${quizId}`);
                const snapshot = await get(quizRef);
                return snapshot.exists() ? snapshot.val() : null;
            } catch (error) {
                console.error("Error fetching quiz details:", error);
                return null;
            }
        },

        async calculateUserRank() {
            const usersRef = dbRef(database, 'users');
            const usersSnapshot = await get(usersRef);
            if (usersSnapshot.exists()) {
                const users = Object.values(usersSnapshot.val()).sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
                this.userRank = users.findIndex(user => user.uid === this.userId) + 1;
            }
        }
    },
    mounted() {
        this.fetchUserQuizzes();
    },
    beforeUnmount() {
        if (this.quizzesRef && this.listener) {
            off(this.quizzesRef, this.listener);
        }
    }
};
</script>
