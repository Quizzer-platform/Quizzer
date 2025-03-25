<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <OrganizationSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar"
            class="fixed z-50 md:fixed transition-transform duration-300"
            :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }" />
        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <OrganizationNavbar @toggleSidebar="toggleSidebar" />

            <!-- Main Content -->
            <main class="flex-1 p-4">
                <!-- <DashboardOverview />-->

                <!-- User Review Section -->
                <div class="mt-8">
                    <div class="flex flex-col md:flex-row md:justify-between  gap-2 sm:gap-4 mb-3">
                        <h3 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Users Review</h3>
                        <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateSearchQuery" />
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading users...</p>
                    </div>

                    <!-- No Users Message -->
                    <div v-else-if="users.length === 0" class="text-center text-gray-600 mt-10">
                        <p class="text-lg font-semibold text-teal-800 dark:text-teal-500">Your organization has no users
                            yet.</p>
                    </div>

                    <!-- Table (Hidden While Loading or No Users) -->
                    <TableStructure v-else :headers="['User Id', 'User Name', 'Last Quiz', 'Degree']"
                        :rows="paginatedUserData.map(user => [user.id, user.name, user.lastQuiz, user.degree])"
                        :showActions="true" @view-details="goToUserDetails" />

                    <!-- Pagination controls for users -->
                    <div v-if="users.length > 0" class="flex justify-center gap-2 p-4">
                        <button @click="prevUserPage" :disabled="currentUserPage === 1"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                            Previous
                        </button>
                        <span class="px-4 py-2 text-sm font-medium text-teal-700">
                            Page {{ currentUserPage }} of {{ totalUserPages }}
                        </span>
                        <button @click="nextUserPage"
                            :disabled="currentUserPage === totalUserPages || totalUserPages === 0"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                            Next
                        </button>
                    </div>

                </div>

            </main>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import DashboardOverview from "@/components/organization/OrganizationOverview.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
    components: {
        OrganizationSidebar,
        OrganizationNavbar,
        DashboardOverview,
        SearchBar,
        TableStructure,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            users: [], // Stores fetched users
            organization: null, // Organization name of the logged-in org admin
            loading: true, // Spinner state
            currentUserPage: 1,
            currentAdminPage: 1,
            perUserPage: 8,
            quizData : [],
        };
    },
    computed: {
        filteredUsers() {
            if (!this.searchQuery) return this.users;
            return this.users.filter(user =>
                user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        paginatedUserData() {
            const start = (this.currentUserPage - 1) * this.perUserPage;
            const end = start + this.perUserPage;
            return this.filteredUsers.slice(start, end);
        },
        totalUserPages() {
            return Math.ceil(this.filteredUsers.length / this.perUserPage);
        },
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
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            if (window.innerWidth >= 768) {
                this.isSidebarOpen = true; // Auto-show sidebar on large screens
            }
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
        async fetchOrganization() {
            return new Promise((resolve, reject) => {
                const auth = getAuth();
                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        console.error("User not logged in");
                        reject("No user");
                        return;
                    }

                    const db = getDatabase();
                    const userRef = ref(db, `users/${user.uid}`);
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        this.organization = userData.organization; // Get organization name
                        console.log("Fetched Organization Name:", this.organization);
                        resolve(this.organization);
                    } else {
                        console.error("Organization admin data not found in users collection.");
                        reject("No organization found");
                    }
                });
            });
        },
        async fetchUsers() {
            if (!this.organization) return; // Ensure organization is set
            try {
                this.loading = true; // Show spinner

                const db = getDatabase();
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.users = Object.entries(data)
                        .map(([id, user]) => {
                            // Ensure attemptedQuizzes exists and is an array
                            const attempts = Array.isArray(user.attemptedQuizzes)
                                ? user.attemptedQuizzes.filter(q => typeof q === 'object' && q.title)
                                : [];

                            // Get the last quiz details if available
                            const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;
                            const lastQuiz = lastAttempt ? lastAttempt.title : "No Quiz Taken";
                            
                            // Calculate quiz total based on quiz data
                            const quizTotal = lastAttempt && this.quizData.length > 0 
                                ? this.calculateQuizTotal(lastAttempt.quizId)
                                : 0;
                                
                            const degree = lastAttempt ? `${lastAttempt.quizScore} / ${quizTotal}` : "N/A"; // Store the last quiz score

                            return {
                                id,
                                name: user.name || "Unknown",
                                lastQuiz,
                                degree,  // Now stores the last quiz's score
                                organization: user.organization, // Ensure we use organization name
                                role: user.role // Include role for filtering
                            };
                        })
                        .filter(user =>
                            user.organization === this.organization && // Compare with organization name
                            user.role !== "organization_admin" // Exclude organization admins
                        );

                    console.log("Filtered users:", this.users);
                } else {
                    this.users = [];
                }


            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                this.loading = false; // Hide spinner
            }
        },
        loadQuizzes() {
            fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json`)
                .then(response => response.json())
                .then(data => {
                    this.quizData = Object.entries(data).map(([id, quiz]) => ({
                        id: id,
                        numberOfQuestions: quiz.numberOfQuestions,
                        scorePerQuestion: quiz.scorePerQuestion,
                        totalScore: quiz.numberOfQuestions * quiz.scorePerQuestion
                    }));
                    
                    // After loading quiz data, fetch organization quizzes
                    this.fetchOrganizationQuizzes();
                    
                    // After loading quiz data, refresh user data to include total scores
                    if (this.organization) {
                        this.fetchUsers();
                    }
                })
                .catch(error => {
                    console.error('Error loading quizzes:', error);
                    alert('An error occurred while loading quiz data. Please try again later.');
                })
                .finally(() => {
                    console.log('Quizzes loaded');
                });
        },
        fetchOrganizationQuizzes() {
            if (!this.organization) return; // Ensure organization is set
            
            const db = getDatabase();
            const orgQuizzesRef = ref(db, "organizationQuizzes");
            
            get(orgQuizzesRef)
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        // Filter quizzes for the current organization
                        const orgQuizzes = Object.entries(data)
                            .filter(([id, quiz]) => quiz.organization === this.organization)
                            .map(([id, quiz]) => ({
                                id: id,
                                title: quiz.title || "Untitled Quiz",
                                description: quiz.description || "",
                                numberOfQuestions: quiz.numberOfQuestions || 0,
                                scorePerQuestion: quiz.scorePerQuestion || 1,
                                totalScore: (quiz.numberOfQuestions || 0) * (quiz.scorePerQuestion || 1),
                                createdAt: quiz.createdAt || new Date().toISOString()
                            }));
                            
                        // Merge with existing quiz data
                        this.quizData = [...this.quizData, ...orgQuizzes];
                        console.log("Organization quizzes loaded:", orgQuizzes.length);
                    } else {
                        console.log("No organization quizzes found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching organization quizzes:", error);
                });
        },
        calculateQuizTotal(quizId) {
            // First check if the quiz exists in our combined quiz data
            const quiz = this.quizData.find(q => q.id === quizId);
            if (quiz) {
                return quiz.totalScore;
            }
            
            // If not found, try to calculate it directly from the quiz properties
            // This is a fallback in case the quiz wasn't properly loaded
            const db = getDatabase();
            const adminQuizRef = ref(db, `adminQuizzes/${quizId}`);
            const orgQuizRef = ref(db, `organizationQuizzes/${quizId}`);
            
            // Try admin quizzes first
            get(adminQuizRef).then(snapshot => {
                if (snapshot.exists()) {
                    const quizData = snapshot.val();
                    const totalScore = quizData.numberOfQuestions * quizData.scorePerQuestion;
                    
                    // Add to our quiz data for future reference
                    this.quizData.push({
                        id: quizId,
                        numberOfQuestions: quizData.numberOfQuestions,
                        scorePerQuestion: quizData.scorePerQuestion,
                        totalScore: totalScore
                    });
                    
                    // Refresh users to update the display
                    this.fetchUsers();
                    return totalScore;
                } else {
                    // Try organization quizzes
                    get(orgQuizRef).then(snapshot => {
                        if (snapshot.exists()) {
                            const quizData = snapshot.val();
                            const totalScore = quizData.numberOfQuestions * quizData.scorePerQuestion;
                            
                            // Add to our quiz data for future reference
                            this.quizData.push({
                                id: quizId,
                                numberOfQuestions: quizData.numberOfQuestions,
                                scorePerQuestion: quizData.scorePerQuestion,
                                totalScore: totalScore
                            });
                            
                            // Refresh users to update the display
                            this.fetchUsers();
                            return totalScore;
                        }
                    });
                }
            });
            
            // Return 0 as default if quiz not found immediately
            // The async operations above will update the data later if found
            return 0;
        },
        goToUserDetails(userId) {
            this.$router.push(`/organization/user/${userId}`);
        },
    },
    async mounted() {
        try {
            window.addEventListener("resize", this.handleResize);
            await this.fetchOrganization();
            this.loadQuizzes(); // Load quizzes first
            // fetchUsers will be called after quizzes are loaded
        } catch (error) {
            console.error("Error initializing component:", error);
            this.loading = false; // Hide spinner if an error occurs
        }
    },
};
</script>
