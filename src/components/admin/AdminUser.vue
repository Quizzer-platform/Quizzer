<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />

            <!-- Admin Details Content -->
            <main class="flex-1 p-6">
                <div v-if="selectedUser" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-4">
                    <div class="flex flex-col space-y-4">
                        <!-- User Info -->
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl font-bold text-teal-700 dark:text-teal-400">{{ selectedUser.name }}</h2>
                            <p class="mt-1 text-gray-600 dark:text-gray-300">Joined: {{ formatDate(selectedUser.createdAt) }}</p>
                            <div class="mt-3 text-gray-700 dark:text-gray-300">
                                <p><span class="font-semibold my-1">ID: </span> {{ selectedUser.id }}</p>
                                <p><span class="font-semibold my-1">Email: </span> {{ selectedUser.email }}</p>
                                <p><span class="font-semibold my-1 ">Phone: </span> {{ selectedUser.phone }}</p>
                            </div>
                        </div>

                        <!-- User Stats -->
                        <div class="flex justify-between items-center bg-teal-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700 dark:text-teal-300">
                                    {{ selectedUser.quizzesToTake || 0 }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300">Quizzes To Take</p>
                            </div>
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700 dark:text-teal-300">
                                    {{ selectedUser.overallScore || 0 }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300">Overall Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz History Section -->
                <div class="mt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-3">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">User's Quiz History</h3>
                        <SearchBar class="w-full md:w-auto mt-2 md:mt-0" @search="updateSearchQuery" />
                    </div>

                       <!-- Loading Spinner -->
                    <div v-if="isLoading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading User details...</p>
                    </div>

                    <!-- No Quiz History Message -->
                    <div v-else-if="quizzes.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6">
                        This user has not taken any quizzes yet.
                    </div>

                    <!-- Display Quizzes -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mt-5">
                            <thead class="bg-teal-600 text-white dark:bg-teal-700">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Quiz Name</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Score</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Taken Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="quiz in filteredQuizzes" :key="quiz.name" 
                                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{ quiz.name }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{ quiz.score }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{ formatDate(quiz.date) }}</td>
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
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue";

export default {
    components: {
        AdminSidebar,
        AdminNavbar,
        TableStructure,
        SearchBar,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            selectedUser: null,
            quizzes: [],
            overallScore: 0,
            isLoading: true,
            quizData: [], // Add this to store quiz data
        };
    },
    computed: {
        filteredQuizzes() {
            if (!this.searchQuery) return this.quizzes.slice(1,);
            const query = this.searchQuery.toLowerCase();
            return this.quizzes.slice(1,).filter(quiz =>
                quiz.name.toLowerCase().includes(query)
            );
        },
    },
    methods: { 
        removeFirstQuiz() {
            this.quizzes.splice(0,1);
        },
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
                        id: userId
                    };

                    // Transform attempted quizzes into quiz history
                    if (userData.attemptedQuizzes) {
                        this.quizzes = Object.values(userData.attemptedQuizzes).map(quiz => {
                            const quizTotal = this.calculateQuizTotal(quiz.quizId);
                            return {
                                name: quiz.title || 'Untitled Quiz',
                                score: `${quiz.quizScore || 0} / ${quizTotal}`,
                                date: quiz.timestamp || new Date().toISOString(),
                                totalQuestions: quiz.totalQuestions || 0
                            };
                        });
                    } else {
                        this.quizzes = [];
                    }
                } else {
                    console.error("User not found");
                    this.quizzes = [];
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                this.quizzes = [];
            } finally {
                this.isLoading = false;
            }
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
