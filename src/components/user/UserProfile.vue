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
                            <div v-for="quiz in userQuizzes" :key="quiz.quizId"
                                class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-semibold text-white bg-teal-600 px-3 py-1 rounded-full">
                                        {{ quiz.title }}
                                    </span>
                                    <span class="text-sm font-semibold text-gray-700">
                                        {{ new Date(quiz.timestamp).toLocaleDateString() }}
                                    </span>
                                </div>
                                <h3 class="font-bold text-sm text-gray-800 truncate">
                                    Describtion: {{ quiz.category || 'General' }}
                                </h3>
                                <p class="text-sm text-gray-600 mt-1">
                                    Questions: {{ quiz.totalQuestions }}
                                </p>
                                <p class="mt-2 text-sm font-medium">
                                    Score:
                                    <span
                                        :class="quiz.quizScore >= quiz.totalQuestions / 2 ? 'text-green-600' : 'text-red-600'"
                                        class="font-bold">
                                        {{ quiz.quizScore }} / {{ quiz.totalQuestions }}
                                    </span>
                                </p>
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
                        <div v-if="userBadges.length > 0" class="flex flex-wrap justify-start gap-4 mt-4">
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
                        <div class="w-full my-3">
                            <h2 class="text-xl font-bold my-2">Recommended Quizzes</h2>
                            <div v-if="recommendedQuizzes.length > 0"
                                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div v-for="quiz in recommendedQuizzes" :key="quiz.id"
                                    class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <span
                                            class="text-sm font-semibold text-white bg-teal-600 px-3 py-1 rounded-full">
                                            {{ quiz.title }}
                                        </span>
                                    </div>
                                    <h3 class="font-bold text-sm text-gray-800 truncate">Description: {{ quiz.category
                                    }}</h3>
                                    <p class="text-sm text-gray-600 mt-1">
                                        Questions: {{ quiz.questionsCount }}
                                    </p>
                                    <router-link :to="`/quiz/${quiz.id}`"
                                        class="mt-4 block text-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                                        Take Quiz
                                    </router-link>
                                </div>
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
import { ref as dbRef, get, onValue, off, update } from 'firebase/database';
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

            const quizzesRef = dbRef(database, `users/${this.userId}/attemptedQuizzes`);
            const listener = onValue(quizzesRef, (snapshot) => {
                const quizzes = snapshot.val();
                this.userQuizzes = quizzes
                    ? Object.values(quizzes)
                        .map((q, index) => ({
                            ...q,
                            id: q.quizId || index,
                            totalQuestions: q.totalQuestions || 10,
                            title: q.title || "Quiz",
                            category: q.category || "General"
                        }))
                        .sort((a, b) => this.compareTimestamps(b.timestamp, a.timestamp))
                        .slice(1, 4)
                    : [];
            });

            this.listeners.push([quizzesRef, listener]);
        },
        
        compareTimestamps(timestamp1, timestamp2) {
            // Convert timestamps to Date objects if they're not already
            const date1 = typeof timestamp1 === 'number' ? new Date(timestamp1) : new Date(timestamp1);
            const date2 = typeof timestamp2 === 'number' ? new Date(timestamp2) : new Date(timestamp2);
            
            // Compare dates and return the difference
            return date1.getTime() - date2.getTime();
        },
        async fetchUserBadges() {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            const listener = onValue(userRef, async (snapshot) => {
                const userData = snapshot.val();
                const attemptedQuizzes = userData?.attemptedQuizzes || [];
                const quizCount = attemptedQuizzes.length;
                let badges = [];

                // Junior Quizzer Badge
                if (quizCount >= 4) {
                    badges.push({
                        id: 'junior-quizzer',
                        name: 'Junior Quizzer',
                        description: 'Completed +3 quizzes',
                        imageUrl: '../src/assets/bagde1.PNG',
                        borderColor: 'border-teal-400'
                    });
                }

                // Expert Quizzer Badge
                if (quizCount >= 8) {
                    badges.push({
                        id: 'expert-quizzer',
                        name: 'Expert Quizzer',
                        description: 'Completed +7 quizzes',
                        imageUrl: '../src/assets/badge2.PNG',
                        borderColor: 'border-teal-600'
                    });
                }

                // Master Quizzer Badge
                if (quizCount >= 12) {
                    badges.push({
                        id: 'master-quizzer',
                        name: 'Master Quizzer',
                        description: 'Completed +10 quizzes',
                        imageUrl: '../src/assets/badge2.PNG',
                        borderColor: 'border-teal-800'
                    });
                }

                // Update badges in state
                this.userBadges = badges;

                // Store badges in database
                const badgesRef = dbRef(database, `userBadges/${this.userId}`);
                await update(badgesRef, badges.reduce((acc, badge) => {
                    acc[badge.id] = badge;
                    return acc;
                }, {}));
            });

            this.listeners.push([userRef, listener]);
        },
        async fetchRecommendedQuizzes() {
            if (!this.userId) return;

            try {
                const userRef = dbRef(database, `users/${this.userId}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val();
                const attemptedQuizzes = userData?.attemptedQuizzes || [];

                // Only show recommendations if user has completed 4 or more quizzes
                if (attemptedQuizzes.length >= 4) {
                    const adminQuizzesRef = dbRef(database, 'adminQuizzes');
                    const snapshot = await get(adminQuizzesRef);

                    if (snapshot.exists()) {
                        const allQuizzes = snapshot.val();
                        
                        // Get IDs of attempted quizzes
                        const attemptedQuizIds = attemptedQuizzes.map(quiz => quiz.quizId);
                        
                        // Filter out quizzes that have already been attempted
                        const availableQuizzes = Object.entries(allQuizzes)
                            .filter(([id, _]) => !attemptedQuizIds.includes(id))
                            .map(([id, quiz]) => ({
                                id,
                                title: quiz.title,
                                category: quiz.description || 'General',
                                questionsCount: quiz.questions?.length || 0,
                                imageUrl: quiz.imageUrl || '../src/assets/icon.png',
                                createdAt: quiz.createdAt || Date.now()
                            }));
                        
                        // Randomly select up to 3 quizzes
                        this.recommendedQuizzes = this.getRandomItems(availableQuizzes, 3);
                    }
                } else {
                    this.recommendedQuizzes = []; // Show no recommendations
                }
            } catch (error) {
                console.error('Error fetching recommended quizzes:', error);
                this.recommendedQuizzes = [];
            }
        },
        
        // Helper method to get random items from an array
        getRandomItems(array, count) {
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
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