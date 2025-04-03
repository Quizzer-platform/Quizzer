<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <OrganizationSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <OrganizationNavbar @toggleSidebar="toggleSidebar" />

            <!-- User Details Content -->
            <main class="flex-1 p-6">
                <div v-if="selectedUser"
                    class="bg-white dark:bg-[#2d3748] p-6 rounded-lg shadow-md mt-4 transition-colors duration-300">

                    <div class="flex flex-col space-y-4">
                        <!-- User Info -->
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl font-bold text-teal-700 dark:text-teal-300">
                                {{ selectedUser.name }}
                            </h2>
                            <p class="mt-1 text-gray-600 dark:text-gray-400">
                                Joined: {{ formatDate(selectedUser.createdAt) }}
                            </p>

                            <div class="mt-3 text-gray-700 dark:text-gray-300">
                                <p><span class="font-semibold">Email:</span> {{ selectedUser.email }}</p>
                                <p><span class="font-semibold">Phone:</span> {{ selectedUser.phone }}</p>
                                <p><span class="font-semibold">Organization:</span> {{ selectedUser.organization }}</p>
                            </div>
                        </div>

                        <!-- User Stats -->
                        <div class="flex justify-between items-center bg-teal-50 dark:bg-[#1e293b] p-4 rounded-lg">
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700 dark:text-teal-300">
                                    {{ selectedUser.quizzesToTake }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-400">Quizzes To Take</p>
                            </div>
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700 dark:text-teal-300">
                                    {{ selectedUser.overallScore }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-400">Overall Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Review Section -->
                <div class="mt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-3">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-teal-300">
                            User's Quiz History
                        </h3>
                        <Searchbar class="w-full sm:ml-4 md:ml-160"  @search="updateSearchQuery" />
                    </div>

                    <!-- 🔹 Loading Spinner -->
                    <div v-if="isLoading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading user details...</p>
                    </div>

                    <!-- No Quiz History Message -->
                    <div v-else-if="userReview.length === (0 || 1) " class="text-center text-gray-500 dark:text-gray-400 mt-6">
                        This user has not taken any quizzes yet.
                    </div>
                    <!-- <TableStructure v-else 
                    :headers="['Quiz Name', 'Score', 'Taken Date']" 
                    :rows="filteredReviews.map(quiz => [
                            quiz.name,
                            quiz.score,
                            formatDate(quiz.date)
                        ])" class="w-full max-w-5xl mx-auto"></TableStructure> -->
                    <!-- Display Quizzes -->

                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mt-5">
                            <thead class="bg-teal-600 text-white dark:bg-teal-700">
                                <tr>
                                    <th class="w-1/3 px-2 md:px-6 py-3 text-left text-sm font-semibold">Quiz Name</th>
                                    <th class="w-1/3 px-2 md:px-6 py-3 text-left text-sm font-semibold">Score</th>
                                    <th class="w-1/3 px-2 md:px-6 py-3 text-left text-sm font-semibold">Taken Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="quiz in filteredReviews" :key="quiz.name"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td
                                        class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200 truncate">
                                        {{ quiz.name }}</td>
                                    <td class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{
                                        quiz.score }}</td>
                                    <td class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{
                                        formatDate(quiz.date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";
import Searchbar from "@/components/layout/Searchbar.vue";

export default {
    components: {
        OrganizationSidebar,
        OrganizationNavbar,
        TableStructure,
        Searchbar,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            selectedUser: null, // Holds the user details
            userReview: [], // Holds the user's quizzes
            isLoading: true, // 🔹 Tracks loading state
            quizData : [],
        };
    },
    computed: {
        filteredReviews() {
            if (!this.searchQuery) return this.userReview.slice(1,);
            const query = this.searchQuery.toLowerCase();
            return this.userReview.slice(1,).filter(review =>
                review.name.toLowerCase().includes(query)
            );
        },
    },
    methods: {
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            this.isSidebarOpen = window.innerWidth >= 768;
        },
        formatDate(dateString) {
            if (!dateString) return "N/A";
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
        async loadUserDetails() {
            const userId = this.$route.params.id;
            if (!userId) return;

            this.isLoading = true;
            try {
                const db = getDatabase();

                // Load quizzes data first
                await this.loadQuizzes();

                // Fetch User Details
                const userRef = ref(db, `users/${userId}`);
                const userSnap = await get(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.val();
                    this.selectedUser = {
                        ...userData,
                        name: userData.name || 'Unknown User',
                        email: userData.email || 'No email provided',
                        phone: userData.phone || 'No phone provided',
                        createdAt: userData.createdAt || new Date().toISOString(),
                        quizzesToTake: userData.quizzesToTake || 0,
                        overallScore: userData.overallScore || 0,
                        organization: userData.organization || 'No organization'
                    };

                    // Transform attempted quizzes into quiz history
                    if (userData.attemptedQuizzes) {
                        this.userReview = Object.values(userData.attemptedQuizzes).map(quiz => {
                            const quizTotal = this.calculateQuizTotal(quiz.quizId);
                            return {
                                name: quiz.title || 'Untitled Quiz',
                                score: `${quiz.quizScore || 0} / ${quizTotal}`,
                                date: quiz.timestamp || new Date().toISOString(),
                                totalQuestions: quiz.totalQuestions || 0
                            };
                        });
                    } else {
                        this.userReview = [];
                    }
                } else {
                    console.error("User not found");
                    this.userReview = [];
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                this.userReview = [];
            } finally {
                this.isLoading = false;
            }
        },
        loadQuizzes() {
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
                const orgQuizzesRef = ref(db, "organizationQuizzes");
                
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
    },
    watch: {
        "$route.params.id": "loadUserDetails",
    },
    mounted() {
        this.loadUserDetails();
        window.addEventListener("resize", this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>
