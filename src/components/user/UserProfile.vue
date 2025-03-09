<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <!-- Sidebar Toggle for Small Screens -->
        <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <main class="flex-1 p-6 md:ml-54">
                <div
                    class="bg-teal-800 text-white p-10 rounded-lg flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <p class="text-sm">{{ currentDate }}</p>
                        <h1 class="text-3xl font-bold my-3">Welcome back, {{ userData?.name || 'User' }}!</h1>
                        <p class="text-sm">Always stay updated in your Quiz portal</p>
                    </div>
                    <div
                        class="w-24 h-24 bg-gray-400 rounded-full mx-10 flex items-center justify-center text-3xl mt-2">
                        <img v-if="userData?.photoURL" :src="userData.photoURL" :alt="userData?.name"
                            class="w-full h-full rounded-full object-cover">
                        <span v-else>👤</span>
                    </div>
                </div>

                <div class="flex flex-wrap gap-6 mt-6">
                    <!-- Left Section -->
                    <!-- In the Recent Quizzes section -->
                    <div class="flex-1">
                        <h2 class="text-xl font-bold">Recent Quizzes</h2>
                        <div v-if="userQuizzes.length > 0"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.id"
                                class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between">
                                    <div class="w-16 h-10 bg-teal-100 flex items-center justify-center">
                                        {{ quiz.category }}
                                    </div>
                                    <p class="font-bold text-teal-800">Score: {{ quiz.score }}/{{ quiz.totalQuestions }}
                                    </p>
                                </div>
                                <p class="font-bold mt-2 truncate">{{ quiz.title }}</p>
                                <p class="text-gray-500 mt-2">Completed: {{ new
                                    Date(quiz.timestamp).toLocaleDateString() }}</p>
                                <div class="flex justify-end mt-6">
                                    <router-link :to="`/quiz/${quiz.quizId}/results`"
                                        class="bg-teal-600 text-white p-2 rounded hover:bg-teal-800 transition-colors">
                                        View Results
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div v-else class="mt-4 p-6 bg-white rounded-lg shadow text-center">
                            <div class="text-4xl mb-4">📚</div>
                            <h3 class="text-lg font-semibold mb-2">No Quizzes Completed Yet</h3>
                            <p class="text-gray-600 mb-4">Start your learning journey by taking your first quiz!</p>
                            <router-link to="/quizzes"
                                class="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                                Browse Quizzes
                            </router-link>
                        </div>

                        <!-- Badges Section -->
                        <h2 class="mt-7 text-xl font-bold">Badges</h2>
                        <div v-if="userBadges.length > 0" class="flex flex-wrap justify-around gap-4 mt-4">
                            <div v-for="badge in userBadges" :key="badge.id"
                                class="text-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow w-full sm:w-48">
                                <img :src="badge.imageUrl" :alt="badge.name"
                                    class="w-20 h-20 rounded-full mx-auto border-2 shadow-md"
                                    :class="badge.borderColor" />
                                <p class="mt-2 font-bold">{{ badge.name }}</p>
                                <p class="text-sm text-gray-600">{{ badge.description }}</p>
                            </div>
                        </div>
                        <div v-else class="mt-4 p-6 bg-white rounded-lg shadow text-center">
                            <div class="text-4xl mb-4">🏆</div>
                            <h3 class="text-lg font-semibold mb-2">No Badges Yet</h3>
                            <p class="text-gray-600">Complete quizzes and achieve high scores to earn badges!</p>
                        </div>

                        <!-- Right Section - Recommended Quizzes -->
                        <div class="w-full md:w-1/3 my-3">
                            <h2 class="text-xl font-bold my-2">Recommended Quizzes</h2>
                            <div v-if="recommendedQuizzes.length > 0"
                                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mt-5">
                                <router-link v-for="quiz in recommendedQuizzes" :key="quiz.id" :to="`/quiz/${quiz.id}`"
                                    class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center space-x-4">
                                    <img :src="quiz.imageUrl" :alt="quiz.title"
                                        class="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h3 class="font-semibold">{{ quiz.title }}</h3>
                                        <p class="text-sm text-gray-600">{{ quiz.category }}</p>
                                        <p class="text-xs text-teal-600">{{ quiz.questionsCount }} questions</p>
                                    </div>
                                </router-link>
                            </div>
                            <div v-else class="mt-4 p-6 bg-white rounded-lg shadow text-center">
                                <div class="text-4xl mb-4">🎯</div>
                                <h3 class="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                                <p class="text-gray-600 mb-4">Complete more quizzes to get personalized recommendations!
                                </p>
                                <router-link to="/quizzes"
                                    class="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                                    Explore All Quizzes
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { ref as dbRef, get, onValue, off } from 'firebase/database';
import { database } from '@/firebase';
import { mapState } from 'vuex';
import UserSidebar from './UserSidebar.vue';

export default {
    name: 'UserProfile',
    components: {
        UserSidebar
    },
    data() {
        return {
            isMenuOpen: false,
            userData: null,
            userQuizzes: [],
            userBadges: [],
            recommendedQuizzes: [],
            currentDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            listeners: [],
            error: null,
            loading: false
        };
    },
    computed: {
        ...mapState({
            user: state => state.user
        }),
        userId() {
            return this.user?.uid;
        }
    },
    methods: {
        async fetchUserProfile() {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            const listener = onValue(userRef, (snapshot) => {
                this.userData = snapshot.val();
            });
            this.listeners.push([userRef, listener]);
        },
        async fetchUserQuizzes() {
            if (!this.userId) return;

            const quizzesRef = dbRef(database, `userQuizzes/${this.userId}`);
            const listener = onValue(quizzesRef, (snapshot) => {
                const quizzes = snapshot.val();
                this.userQuizzes = quizzes ?
                    Object.values(quizzes)
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 6) : [];
            });
            this.listeners.push([quizzesRef, listener]);
        },
        async fetchUserBadges() {
            if (!this.userId) return;

            const badgesRef = dbRef(database, `userBadges/${this.userId}`);
            const listener = onValue(badgesRef, (snapshot) => {
                const badges = snapshot.val();
                this.userBadges = badges ? Object.values(badges) : [];
            });
            this.listeners.push([badgesRef, listener]);
        },
        async fetchRecommendedQuizzes() {
            try {
                const allQuizzesRef = dbRef(database, 'quizzes');
                const snapshot = await get(allQuizzesRef);
                if (snapshot.exists()) {
                    const allQuizzes = snapshot.val();
                    this.recommendedQuizzes = Object.values(allQuizzes)
                        .filter(quiz => !this.userQuizzes.find(uq => uq.quizId === quiz.id))
                        .slice(0, 3);
                }
            } catch (error) {
                console.error('Error fetching recommended quizzes:', error);
                this.recommendedQuizzes = [];
            }
        },
        async fetchAllData() {
            this.loading = true;
            this.error = null;
            try {
                await Promise.all([
                    this.fetchUserProfile(),
                    this.fetchUserQuizzes(),
                    this.fetchUserBadges(),
                    this.fetchRecommendedQuizzes()
                ]);
            } catch (error) {
                this.error = 'Error loading profile data';
                console.error('Error:', error);
            } finally {
                this.loading = false;
            }
        },
        cleanupListeners() {
            this.listeners.forEach(([ref, listener]) => {
                off(ref, listener);
            });
            this.listeners = [];
        }
    },
    mounted() {
        if (this.userId) {
            this.fetchAllData();
        }
    },
    beforeUnmount() {
        this.cleanupListeners();
    },
    watch: {
        userId: {
            immediate: true,
            handler(newId) {
                this.cleanupListeners();
                if (newId) {
                    this.fetchAllData();
                } else {
                    this.userData = null;
                    this.userQuizzes = [];
                    this.userBadges = [];
                    this.recommendedQuizzes = [];
                }
            }
        }
    }
};
</script>