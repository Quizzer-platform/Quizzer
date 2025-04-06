<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />
        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />
            <!-- Main Content -->
            <main class="flex-1 p-4">
                <!-- User Review Section -->
                <!-- Chart Section with Loading State -->
                <div>
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Preparing chart data...</p>
                    </div>
                    <div v-else-if="userScores.length === 0" class="flex flex-col items-center justify-center h-60">
                        <p class="text-gray-500 dark:text-gray-400 text-center">
                            No quiz data available. Users haven't taken any quizzes yet.
                        </p>
                    </div>
                    <UsersChart v-else :data="userScores" />
                </div>

                <h2 class="text-xl font-bold text-gray-800 dark:text-teal-300 mb-3">System Users</h2>
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                    <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Users Review</h2>
                    <Searchbar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateUserSearchQuery" />
                </div>

                <!-- Loading Spinner -->
            <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Users Data...</p>
            </div>
                <!-- Table (Hidden While Loading) -->
                <TableStructure v-else :headers="['User Id', 'User Name', 'Email']"
                    :rows="paginatedUserData.map(user => [user.id, user.name, user.email])" :showActions="true"
                    @view-details="goToUserDetails" class="w-full max-w-5xl mx-auto" />

                    <!-- No Admins Message -->
                    <div v-if="!loading && filteredUsers.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6 h-50 flex flex-col justify-center items-center">
                        No users found.
                    </div>

                <!-- Pagination controls for users -->
                <div v-if="users.length > 0" class="flex justify-center gap-2 p-4">
                    <button @click="prevUserPage" :disabled="currentUserPage === 1"
                        class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                        Previous
                    </button>
                    <span class="px-4 py-2 text-sm font-medium text-teal-700">
                        Page {{ currentUserPage }} of {{ totalUserPages }}
                    </span>
                    <button @click="nextUserPage" :disabled="currentUserPage === totalUserPages || totalUserPages === 0"
                        class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                        Next
                    </button>
                </div>

                <div class="mt-8">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-teal-300 mb-3">System Administrators</h2>
                    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                        <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Admins Review</h2>
                        <Searchbar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateAdminSearchQuery" />
                    </div>
                    <!-- Loading Spinner -->
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Administrators details...</p>
                    </div>
                    <!-- Admin Table -->
                    <TableStructure v-if="!loading && paginatedAdminData.length > 0"
                        :headers="['Admin Id', 'Name', 'Email']" :rows="paginatedAdminData.map(admin => [
                            admin.id,
                            admin.name,
                            admin.email
                        ])" :showActions="true" @view-details="goToUserDetails" class="w-full max-w-5xl mx-auto" />
                    <!-- No Admins Message -->
                    <div v-else-if="!loading && filteredAdmins.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6 h-50 flex flex-col justify-center items-center">
                        No administrators found.
                    </div>

                    <!-- Pagination controls for admins -->
                    <div v-if="admins.length > 0" class="flex justify-center gap-2 p-4">
                        <button @click="prevAdminPage" :disabled="currentAdminPage === 1"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                            Previous
                        </button>
                        <span class="px-4 py-2 text-sm font-medium text-teal-700">
                            Page {{ currentAdminPage }} of {{ totalAdminPages }}
                        </span>
                        <button @click="nextAdminPage" :disabled="currentAdminPage === totalAdminPages || totalAdminPages === 0"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                            Next
                        </button>
                    </div>

                </div>
                <!-- </div> -->
            </main>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import Searchbar from "@/components/layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";
import UsersChart from "@/components/admin/UsersChart.vue"; // Import the chart component

export default {
    components: {
        AdminSidebar,
        AdminNavbar,
        Searchbar,
        TableStructure,
        UsersChart,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            userSearchQuery: "",
            adminSearchQuery: "",
            users: [], // Stores fetched users
            loading: true, // Spinner state
            admins: [], // Add this new property
            currentUserPage: 1,
            currentAdminPage: 1,
            perUserPage: 8,
            perAdminPage: 8,
            userScores: [],
        };
    },
    computed: {
        filteredUsers() {
            if (!this.userSearchQuery) return this.users;
            const query = this.userSearchQuery.toLowerCase();
            return this.users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        },

        filteredAdmins() {
            if (!this.adminSearchQuery) return this.admins;
            const query = this.adminSearchQuery.toLowerCase();
            return this.admins.filter(admin =>
                admin.name.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query)
            );
        },
        paginatedUserData() {
            const start = (this.currentUserPage - 1) * this.perUserPage;
            const end = start + this.perUserPage;
            return this.filteredUsers.slice(start, end);
        },
        paginatedAdminData() {
            const start = (this.currentAdminPage - 1) * this.perAdminPage;
            const end = start + this.perAdminPage;
            return this.filteredAdmins.slice(start, end);
        },
        totalUserPages() {
            return Math.ceil(this.filteredUsers.length / this.perUserPage);
        },
        totalAdminPages() {
            return Math.ceil(this.filteredAdmins.length / this.perAdminPage);
        }
    },
    methods: {
        visibleUserPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const userStartPage = Math.max(
                1,
                Math.min(this.currentUserPage - 2, this.totalUserPages - 4)
            );
            const userEndPage = Math.min(userStartPage + 4, this.totalUserPages);

            return Array.from(
                { length: userEndPage - userStartPage + 1 },
                (_, i) => userStartPage + i
            );
        },
        nextUserPage() {
            if (this.currentUserPage < this.totalUserPages) {
                this.currentUserPage++;
            }
        },
        prevUserPage() {
            if (this.currentUserPage > 1) {
                this.currentUserPage--;
            }
        },
        visibleAdminPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const adminStartPage = Math.max(
                1,
                Math.min(this.currentAdminPage - 2, this.totalAdminPages - 4)
            );
            const adminEndPage = Math.min(adminStartPage + 4, this.totalAdminPages);

            return Array.from(
                { length: adminEndPage - adminStartPage + 1 },
                (_, i) => adminStartPage + i
            );
        },
        nextAdminPage() {
            if (this.currentAdminPage < this.totalAdminPages) {
                this.currentAdminPage++;
            }
        },
        prevAdminPage() {
            if (this.currentAdminPage > 1) {
                this.currentAdminPage--;
            }
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            if (window.innerWidth >= 768) {
                this.isSidebarOpen = true; // Auto-show sidebar on large screens
            }
        },
        updateUserSearchQuery(query) {
            this.userSearchQuery = query;
        },
        updateAdminSearchQuery(query) {
            this.adminSearchQuery = query;
        },
        // Add this method to prepare chart data
        async prepareChartData() {
          try {
            this.userScores = [];
            
            // Load quiz data first to get quiz details
            const db = getDatabase();
            const adminQuizzesRef = ref(db, "adminQuizzes");
            const orgQuizzesRef = ref(db, "organizationQuizzes");
            
            // Get admin quizzes
            const adminQuizzesSnap = await get(adminQuizzesRef);
            let quizData = {};
            
            if (adminQuizzesSnap.exists()) {
              quizData = adminQuizzesSnap.val();
            }
            
            // Get organization quizzes
            const orgQuizzesSnap = await get(orgQuizzesRef);
            if (orgQuizzesSnap.exists()) {
              quizData = { ...quizData, ...orgQuizzesSnap.val() };
            }
            
            // Process each user's attempted quizzes
            for (const user of this.users) {
              if (user.attemptedQuizzes) {
                // Convert attemptedQuizzes to array if it's an object
                const quizAttempts = Array.isArray(user.attemptedQuizzes) 
                  ? user.attemptedQuizzes 
                  : Object.entries(user.attemptedQuizzes).map(([id, data]) => ({
                      quizId: id,
                      ...data
                    }));
                
                quizAttempts.forEach(attempt => {
                  if (!attempt) return;
                  
                  const quizId = attempt.quizId;
                  const quizDetails = quizData[quizId];
                  
                  // Skip if quiz details not found
                  if (!quizDetails) return;
                  
                  const quizTitle = attempt.title || quizDetails.title || "Unknown Quiz";
                  const score = attempt.quizScore || attempt.score || 0;
                  const total = attempt.totalScore || quizDetails.numberOfQuestions * quizDetails.scorePerQuestion || 10;
                  
                  this.userScores.push({
                    quizTitle,
                    userName: user.name,
                    email: user.email,
                    score: (score / total) * 10, // Normalize to out of 10
                  });
                });
              }
            }
            
            // console.log("Chart data prepared:", this.userScores.length, "entries");
            
          } catch (error) {
            console.error("Error preparing chart data:", error);
          }
        },
        
        // Update the fetchUsers method to call prepareChartData
        async fetchUsers() {
          try {
            this.loading = true;
            const db = getDatabase();
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);
        
            if (snapshot.exists()) {
              const data = snapshot.val();
              this.users = Object.entries(data)
                .filter(([id, user]) => user.role === "user") // Only include users with role "user"
                .map(([id, user]) => ({
                  id,
                  name: user.name || "Unknown User",
                  email: user.email || "No email",
                  role: user.role || "user",
                  attemptedQuizzes: user.attemptedQuizzes || []
                }));
              
              // Prepare chart data after users are loaded
              await this.prepareChartData();
            } else {
              this.users = [];
            }
            this.loading = false;
          } catch (error) {
            console.error("Error fetching users:", error);
            this.loading = false;
          }
        },
        goToUserDetails(userId) {
            this.$router.push(`/admin/user/${userId}`);
        },
        formatDate(timestamp) {
            if (!timestamp) return 'N/A';
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        async fetchAdmins() {
            try {
                const db = getDatabase();
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.admins = Object.entries(data)
                        .filter(([_, user]) => user.role === 'organization_admin')
                        .map(([id, admin]) => ({
                            id,
                            name: admin.name || "Unknown Admin",
                            email: admin.email || "No Email",
                            createdAt: admin.createdAt || null
                        }))
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                } else {
                    this.admins = [];
                }
            } catch (error) {
                console.error("Error fetching admins:", error);
                this.admins = [];
            }
        },
    },
    async mounted() {
        try {
            window.addEventListener("resize", this.handleResize);
            await Promise.all([
                this.fetchUsers(),
                this.fetchAdmins()
            ]);
        } catch (error) {
            console.error("Error initializing component:", error);
        } finally {
            this.loading = false;
        }
    },
};
</script>
