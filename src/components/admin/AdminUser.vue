<template>
    <div class="flex min-h-screen  bg-gray-100">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />

            <!-- Admin Details Content -->
            <main class="flex-1 p-6">
                <div v-if="selectedUser" class="bg-white p-6 rounded-lg shadow-md mt-4">
                    <div class="flex flex-col space-y-4">
                        <!-- User Info -->
                        <div class="text-center md:text-left">
                            <h2 class="text-2xl font-bold text-teal-700">{{ selectedUser.name }}</h2>
                            <p class="mt-1 text-gray-600">Joined: {{ formatDate(selectedUser.createdAt) }}</p>
                            <div class="mt-3 text-gray-700">
                                <p><span class="font-semibold my-1">Email:</span> {{ selectedUser.email }}</p>
                                <p><span class="font-semibold my-1 ">Phone:</span> {{ selectedUser.phone }}</p>
                            </div>
                        </div>

                        <!-- User Stats -->
                        <div class="flex justify-between items-center bg-teal-50 p-4 rounded-lg">
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700">{{ selectedUser.quizzesToTake || 0 }}</p>
                                <p class="text-gray-600">Quizzes To Take</p>
                            </div>
                            <div class="text-center">
                                <p class="text-xl font-semibold text-teal-700">{{ selectedUser.overallScore || 0 }}</p>
                                <p class="text-gray-600">Overall Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz History Section -->
                <div class="mt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-3">
                        <h3 class="text-xl font-bold text-gray-800">User's Quiz History</h3>
                        <SearchBar class="w-full md:w-auto mt-2 md:mt-0" v-model="searchQuery" />
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoading" class="flex justify-center my-6">
                        <svg class="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    </div>

                    <!-- No Quiz History Message -->
                    <div v-else-if="quizzes.length === 0" class="text-center text-gray-500 mt-6">
                        This user has not taken any quizzes yet.
                    </div>

                    <!-- Display Quizzes -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-md mt-5">
                            <thead class="bg-teal-600 text-white">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Quiz Name</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Score</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold">Date Taken</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="quiz in filteredQuizzes" :key="quiz.name" 
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900">{{ quiz.name }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{{ quiz.score }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(quiz.date) }}</td>
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
        };
    },
    computed: {
        filteredQuizzes() {
            return this.quizzes.filter(quiz =>
                quiz.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    methods: {
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
                        overallScore: userData.overallScore || 0
                    };

                    // Transform attempted quizzes into quiz history
                    if (userData.attemptedQuizzes) {
                        this.quizzes = Object.values(userData.attemptedQuizzes).map(quiz => ({
                            name: quiz.title || 'Untitled Quiz',
                            score: quiz.quizScore || 0,
                            date: quiz.timestamp || new Date().toISOString(),
                            totalQuestions: quiz.totalQuestions || 0
                        }));
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
