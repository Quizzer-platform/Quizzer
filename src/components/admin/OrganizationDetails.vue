<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar"
            class="fixed md:fixed z-50 h-full shadow-lg" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64 w-full">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />

            <!-- Organization Details Content -->
            <main class="flex-1 p-6 w-full">
                   <!-- Loading Spinner -->
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Organization details...</p>
                    </div>

                <!-- Show No Data Message -->
                <div v-else-if="!selectedOrg" class="text-center text-gray-500 text-lg mt-10">
                    Organization not found.
                </div>

                <!-- Organization Info -->
                <div v-else class="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-6 w-full
                 dark:bg-gray-800/25 dark:text-gray-300 dark:border-gray-700">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
        <!-- Organization Details -->
        <div class="md:w-3/4">
            <h2 class="text-3xl font-bold text-teal-700 dark:text-teal-400">{{ selectedOrg.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1"><strong>ID:</strong> {{ selectedOrg.id || 'N/A' }}</p>
            <p class="text-gray-600 dark:text-gray-400"><strong>Admin Email:</strong> {{ selectedOrg.adminEmail || 'N/A' }}</p>
            <p class="text-gray-600 dark:text-gray-400"><strong>Admin Phone:</strong> {{ selectedOrg.adminPhone || 'N/A' }}</p>
        </div>

        <!-- Total Quizzes Card -->
        <div class="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/4 text-center border border-gray-200
                    dark:bg-gray-800 dark:border-gray-600">
            <div class="flex flex-col items-center">
                <svg class="h-14 w-14 text-teal-600 dark:text-teal-400 mb-3" fill="none" stroke="currentColor"
                     stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12l2 2 4-4M9 17h6m2-10a2 2 0 00-2-2h-4a2 2 0 00-2 2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                </svg>
                <p class="text-4xl font-bold text-teal-700 dark:text-teal-300">{{ selectedOrg.quizzes }}</p>
                <p class="text-gray-600 dark:text-gray-400">Total Quizzes</p>
            </div>
        </div>
    </div>

    <!-- Subscription Plans -->
    <div class="mt-8 w-full">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Subscription Plans</h3>

        <div v-if="selectedOrg.plans && Object.values(selectedOrg.plans).length > 1"
             class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(plan, index) in Object.values(selectedOrg.plans).slice(1)" :key="index"
                 class="bg-teal-50 p-5 rounded-lg shadow-md border border-teal-200
                        dark:bg-gray-800 dark:border-gray-600">
                <h4 class="text-xl font-semibold text-teal-800 dark:text-teal-400">{{ plan.name }}</h4>
                <p class="text-gray-700 dark:text-gray-300">{{ plan.description }}</p>
                <p class="text-teal-900 dark:text-teal-400 font-medium">Price: {{ plan.price }}</p>
                <p class="text-gray-600 dark:text-gray-400">Quizzes Allowed: {{ plan.noOfQuizzes - selectedOrg.quizzes }}</p>
            </div>
        </div>

        <!-- No Additional Plans Message -->
        <p v-else class="text-gray-500 dark:text-gray-400 text-center mt-4">
            This organization has no additional plans yet.
        </p>
    </div>

    <!-- Created Quizzes Section -->
    <div class="mt-8 w-full">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Created Quizzes</h3>
            <!-- Fix: Use v-model directly on searchQuery -->
            <SearchBar class="w-full md:w-auto mt-2 md:mt-0" @search="updateSearchQuery" />
        </div>

        <!-- No Quizzes Message -->
        <div v-if="quizzes.length === 0" class="text-center text-gray-500 dark:text-gray-400 text-lg mt-6">
            No quizzes available.
        </div>

        <!-- Quizzes Table -->
        <TableStructure v-else
            :headers="['QUIZ ID', 'Name of Quiz', 'No. Questions', 'Duration (mins)']"
            :rows="filteredQuizzes.map(quiz => [quiz.id, quiz.name, quiz.numberOfQuestions, quiz.duration])"
            :showActions="false" @view-details="editQuiz" />
    </div>
</div>

            </main>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
            selectedOrg: null,
            quizzes: [],
            loading: true,
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
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            this.isSidebarOpen = window.innerWidth >= 768;
        },
        async fetchOrganizationId() {
            const auth = getAuth();
            return new Promise(async (resolve) => {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        try {
                            const db = getDatabase();
                            const orgsRef = ref(db, "organizations");
                            const snapshot = await get(orgsRef);

                            if (snapshot.exists()) {
                                const organizations = snapshot.val();
                                const organizationKey = Object.keys(organizations).find(
                                    key => organizations[key].adminEmail === user.email
                                );

                                if (organizationKey) {
                                    this.organizationId = organizations[organizationKey].adminUid; // Set correct adminUid
                                    resolve(this.organizationId);
                                } else {
                                    console.error("Organization not found for user:", user.email);
                                    resolve(null);
                                }
                            } else {
                                console.error("No organizations found in database.");
                                resolve(null);
                            }
                        } catch (error) {
                            console.error("Error fetching organization data:", error);
                            resolve(null);
                        }
                    }
                });
            });
        },
        async fetchOrganizationDetails() {
            const orgId = this.$route.params.id;
            if (!orgId) return;

            try {
                this.loading = true;
                const db = getDatabase();

                // Fetch Organization Details
                const orgRef = ref(db, `organizations/${orgId}`);
                const orgSnap = await get(orgRef);

                if (orgSnap.exists()) {
                    this.selectedOrg = orgSnap.val();
                } else {
                    console.error("Organization not found");
                    this.selectedOrg = null;
                    this.loading = false;
                    return;
                }

                const quizzesRef = ref(db, "organizationQuizzes");
                const quizzesSnap = await get(quizzesRef);

                if (quizzesSnap.exists()) {
                    const quizzesData = quizzesSnap.val();
                    this.quizzes = Object.keys(quizzesData)
                        .map((key) => ({ id: key, ...quizzesData[key] }))
                        .filter((quiz) => String(quiz.organizationUid) === String(this.selectedOrg.adminUid)) // Corrected field
                        .map(quiz => ({
                            id: quiz.id,
                            name: quiz.title || "Untitled Quiz", // Use 'title'
                            numberOfQuestions: quiz.questions?.length || 0, // Calculate from array
                            duration: quiz.duration || "N/A"
                        }));
                } else {
                    this.quizzes = [];
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.loading = false;
            }
        },
        fetchQuizzes() {
            if (!this.organizationId) return;
            this.loading = true;

            const db = getDatabase();
            const quizzesRef = ref(db, "organizationQuizzes");

            onValue(quizzesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.quizzes = Object.keys(data)
                        .map((key) => ({ id: key, ...data[key] }))
                        .filter((quiz) => quiz.organizationUid === this.organizationId); // Ensure correct filtering

                } else {
                    this.quizzes = [];
                }
                this.loading = false;
            });
        },
        editQuiz(quizId) {
            this.$router.push({ name: "editQuiz", params: { quizId } });
        }
    },
    watch: {
        "$route.params.id": "fetchOrganizationDetails",
    },
    async mounted() {
        window.addEventListener("resize", this.handleResize);
        await this.fetchOrganizationDetails();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>
