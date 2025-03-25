<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
    <!-- Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50"
    />

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
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800 dark:text-teal-300">
              User's Quiz History
            </h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" v-model="searchQuery" />
          </div>

          <!-- 🔹 Loading Spinner -->
          <div v-if="isLoading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading user details...</p>
            </div>

          <!-- No Quiz History Message -->
                    <div v-else-if="userReview.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6">
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
                    <td class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200 truncate">{{ quiz.name }}</td>
                    <td class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{ quiz.score }}</td>
                    <td class="w-1/3 px-2 md:px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{{ formatDate(quiz.date) }}</td>
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
import SearchBar from "@/components/layout/Searchbar.vue";

export default {
  components: {
    OrganizationSidebar,
    OrganizationNavbar,
    TableStructure,
    SearchBar,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768,
      searchQuery: "",
      selectedUser: null, // Holds the user details
      userReview: [], // Holds the user's quizzes
      isLoading: true, // 🔹 Tracks loading state
    };
  },
  computed: {
    filteredReviews() {
      return this.userReview.filter(review =>
        review.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
                        this.userReview = Object.values(userData.attemptedQuizzes).map(quiz => ({
                            name: quiz.title || 'Untitled Quiz',
                            score: quiz.quizScore || 0,
                            date: quiz.timestamp || new Date().toISOString(),
                            totalQuestions: quiz.totalQuestions || 0
                        }));
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
