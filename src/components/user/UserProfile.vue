<template>
    <div class="flex flex-col min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <div class="flex flex-1 flex-col md:flex-row">
            <!-- Sidebar Toggle for Small Screens -->
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <main class="flex-1 p-6 md:ml-54">
                <div
                    class="bg-teal-800 dark:bg-teal-900 text-white p-10 rounded-lg flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-200">{{ currentDate }}</p>
                        <h1 class="text-3xl font-bold my-3">Welcome back, {{ userData?.name || 'User' }}!</h1>
                        <p class="text-sm text-gray-300">Always stay updated in your Quiz portal</p>
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
                    <div class="flex-1">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Recent Quizzes</h2>
                        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Recent Quizzes...</p>
                        </div>
                        <div v-else-if="userQuizzes.length > 0"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            <div v-for="quiz in userQuizzes" :key="quiz.id"
                                class="bg-white dark:bg-gray-900/85 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <span
                                        class="text-sm font-semibold text-white bg-teal-600 dark:bg-teal-700 px-3 py-1 rounded-full">
                                        {{ quiz.title }}
                                    </span>
                                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                        {{ new Date(quiz.timestamp).toLocaleDateString() }}
                                    </span>
                                </div>
                                <h3 class="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                                    Description: {{ quiz.category || 'General' }}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Questions: {{ quiz.totalQuestions }}
                                </p>
                                <p class="mt-2 text-sm font-medium dark:text-gray-200">
                                    Score:
                                    <span
                                        :class="quiz.quizScore >= quiz.totalScore / 2 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                                        class="font-bold">
                                        {{ quiz.quizScore }} / {{ quiz.totalScore }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div v-else class="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                            <div class="text-4xl mb-4">📚</div>
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Quizzes Completed Yet</h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">Start your learning journey by taking your first quiz!</p>
                            <router-link to="/quizzes"
                                class="inline-block bg-teal-600 dark:bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-900 transition-colors">
                                Browse Quizzes
                            </router-link>
                        </div>

                        <!-- Badges Section -->
                        <h2 class="mt-7 text-xl font-bold text-gray-800 dark:text-gray-200">Badges</h2>
                        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                            <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Badges...</p>
                        </div>
                        <div v-else-if="userBadges.length > 0" class="flex flex-wrap justify-start gap-4 mt-4">
                            <div v-for="badge in userBadges" :key="badge.id"
                                class="text-center p-4 bg-white dark:bg-gray-900/85 rounded-lg shadow hover:shadow-lg transition-shadow w-full sm:w-48">
                                <!-- Replace image with SVG -->
                                <!-- Replace the badge container div with this improved version -->
                                <div class="w-20 h-20 mx-auto flex items-center justify-center rounded-full border-2 shadow-md badge-container"
                                    :class="badge.borderColor">
                                    <!-- Elegant background gradient -->
                                    <div class="absolute inset-0 rounded-full elegant-bg"></div>
                                    <!-- Subtle shine effect -->
                                    <div class="absolute inset-0 elegant-shine"></div>
                                    
                                    <!-- Junior Quizzer Badge SVG - Graduation cap design -->
                                    <svg v-if="badge.id === 'junior-quizzer'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-14 h-14 text-teal-500 relative z-10">
                                        <path fill="currentColor" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                                    </svg>
                                    
                                    <!-- Expert Quizzer Badge SVG - Trophy design -->
                                    <svg v-else-if="badge.id === 'expert-quizzer'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-14 h-14 text-teal-600 relative z-10">
                                        <path fill="currentColor" d="M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.1C8.8 19.3 8 20.4 8 21.7V22H16V21.7C16 20.4 15.2 19.3 13 19.1V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M20 11H18V4H20V11Z" />
                                    </svg>
                                    
                                    <!-- Master Quizzer Badge SVG - Medal design -->
                                    <svg v-else-if="badge.id === 'master-quizzer'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-14 h-14 text-teal-800 relative z-10">
                                        <path fill="currentColor" d="M20,2H4V4L9.81,8.36C6.14,9.57 4.14,13.53 5.35,17.2C6.56,20.87 10.5,22.87 14.19,21.66C17.86,20.45 19.86,16.5 18.65,12.82C17.95,10.71 16.3,9.05 14.19,8.36L20,4V2M14.94,19.5L12,17.78L9.06,19.5L9.84,16.17L7.25,13.93L10.66,13.64L12,10.5L13.34,13.64L16.75,13.93L14.16,16.17L14.94,19.5Z" />
                                    </svg>
                                    
                                    <!-- Default Badge SVG (fallback) - Star design -->
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-14 h-14 text-teal-700 relative z-10">
                                        <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                                    </svg>
                                </div>
                                <p class="mt-2 font-bold text-gray-800 dark:text-gray-200">{{ badge.name }}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{{ badge.description }}</p>
                            </div>
                        </div>
                        <div v-else class="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                            <div class="text-4xl mb-4">🏆</div>
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Badges Yet</h3>
                            <p class="text-gray-600 dark:text-gray-400">Complete quizzes and achieve high scores to earn badges!</p>
                        </div>
                        <!-- Right Section - Recommended Quizzes -->
                        <div class="w-full my-3">
                            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 my-2">Recommended Quizzes</h2>
                            <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Recommendations...</p>
                            </div>
                            <div v-else-if="recommendedQuizzes.length > 0"
                                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <div v-for="quiz in recommendedQuizzes" :key="quiz.id"
                                    class="bg-white dark:bg-gray-900/85  p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <span
                                            class="text-sm font-semibold text-white bg-teal-600 dark:bg-teal-700 px-3 py-1 rounded-full">
                                            {{ quiz.title }}
                                        </span>
                                    </div>
                                    <h3 class="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        Description: {{ quiz.category }}
                                    </h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Questions: {{ quiz.questionsCount }}
                                    </p>
                                    <router-link :to="`/quiz/${quiz.id}`"
                                        class="mt-4 block text-center bg-teal-600 dark:bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-900 transition-colors">
                                        Take Quiz
                                    </router-link>
                                </div>
                            </div>
                            <div v-else class="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                                <div class="text-4xl mb-4">🎯</div>
                                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Recommendations Yet</h3>
                                <p class="text-gray-600 dark:text-gray-400 mb-4">Complete more quizzes to get personalized recommendations!</p>
                                <router-link to="/quizzes"
                                    class="inline-block bg-teal-600 dark:bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-900 transition-colors">
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
import { ref as dbRef, get, onValue, off, update, getDatabase } from 'firebase/database';
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
            loading: false,
            quizData: [] // Add this to store quiz data
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
                        } else {
                            console.warn("No organization quizzes found");
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
        
        compareTimestamps(timestamp1, timestamp2) {
            // Convert timestamps to Date objects if they're not already
            const date1 = typeof timestamp1 === 'number' ? new Date(timestamp1) : new Date(timestamp1);
            const date2 = typeof timestamp2 === 'number' ? new Date(timestamp2) : new Date(timestamp2);
            
            // Compare dates and return the difference
            return date1.getTime() - date2.getTime();
        },
        async fetchUserQuizzes() {
            if (!this.userId) return;

            // First load quiz data
            await this.loadQuizzes();

            const quizzesRef = dbRef(database, `users/${this.userId}/attemptedQuizzes`);
            const listener = onValue(quizzesRef, (snapshot) => {
                const quizzes = snapshot.val();
                this.userQuizzes = quizzes
                    ? Object.values(quizzes)
                        .map((q, index) => {
                            const quizTotal = this.calculateQuizTotal(q.quizId);
                            return {
                                ...q,
                                id: q.quizId || index,
                                totalQuestions: q.totalQuestions || 10,
                                title: q.title || "Quiz",
                                category: q.category || "General",
                                totalScore: quizTotal // Add the total score
                            };
                        })
                        .sort((a, b) => this.compareTimestamps(b.timestamp, a.timestamp))
                        .slice(1, 4)
                    : [];
            });

            this.listeners.push([quizzesRef, listener]);
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
                        borderColor: 'border-teal-400'
                    });
                }

                // Expert Quizzer Badge
                if (quizCount >= 8) {
                    badges.push({
                        id: 'expert-quizzer',
                        name: 'Expert Quizzer',
                        description: 'Completed +7 quizzes',
                        borderColor: 'border-teal-600'
                    });
                }

                // Master Quizzer Badge
                if (quizCount >= 12) {
                    badges.push({
                        id: 'master-quizzer',
                        name: 'Master Quizzer',
                        description: 'Completed +10 quizzes',
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
                // Load quizzes first
                await this.loadQuizzes();
                
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

<style scoped>
.badge-container {
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.badge-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.elegant-bg {
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(240, 240, 240, 0.8) 50%,
    rgba(230, 230, 230, 0.7) 100%
  );
  z-index: 1;
}

.elegant-shine {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 2;
  opacity: 0.7;
  animation: subtle-rotate 8s linear infinite;
}

@keyframes subtle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.badge-container svg {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease, filter 0.3s ease;
}

.badge-container:hover svg {
  transform: scale(1.05);
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.25));
}

/* Add subtle text styling for badge names */
.badge-container + p {
  font-weight: 600;
  background: linear-gradient(to right, #0d9488, #115e59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
</style>
