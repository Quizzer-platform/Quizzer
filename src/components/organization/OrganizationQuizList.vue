<template>
    <div class="mt-8 mx-6 bg-transparent mb-8">
        <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
            <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Quizzes Review</h2>
            <Searchbar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
        </div>

        <!-- 🔹 Loading Spinner -->
        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quizzes details...</p>
            </div>

        <!-- 🔹 No Quizzes Message -->
        <div v-else-if="quizzes.length === 0" class="text-center bg-gray-100 dark:bg-gray-800 dark:text-gray-300 text-gray-700 p-4 rounded-lg shadow-md">
            <p class="text-lg font-semibold">You haven't created any quizzes yet.</p>
            <button @click="handleCreateQuiz"
                class="text-teal-900 dark:text-teal-300 sm:pl-5 font-semibold hover:underline focus:outline-none cursor-pointer">
                Create your first quiz
            </button>
        </div>

        <!-- Quizzes Table (Hidden While Loading) -->
        <TableStructure v-else :headers="['QUIZ CODE', 'Name of Quiz', 'No. of Questions', 'Duration (mins)']" :rows="paginatedData.map(quiz => [
            quiz.id,
            quiz.name,
            quiz.questions.length,
            quiz.duration
        ])" :showActions="true" @view-details="previewQuiz" />
        <!-- Pagination controls -->
        <div v-if="quizzes.length > 0" class="flex justify-center gap-2 p-4">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                Previous
            </button>
            <span class="px-4 py-2 text-sm font-medium text-teal-700">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
                class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                Next
            </button>
        </div>
        <!-- Subscription Modal -->
        <div v-if="showSubscriptionModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4 dark:bg-gray-900 dark:text-white w-full">
                <h2 class="text-xl font-bold text-red-600 mb-4">Subscription Required</h2>
                <p class="text-gray-600 mb-4 dark:text-gray-300 mt-2 text-sm sm:text-base">{{ subscriptionMessage }}</p>
                <div class="flex justify-center gap-4">
                    <button @click="showSubscriptionModal = false"
                        class="bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition-colors
                        w-full sm:w-auto rounded-md cursor-pointer">
                        Close
                    </button>
                    <router-link to="/pricing"
                        class="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colorsw-full sm:w-auto rounded-md cursor-pointer">
                        View Plans
                    </router-link>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import Searchbar from "@/components/layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
    data() {
        return {
            quizzes: [],
            searchQuery: "",
            organizationId: null,
            loading: true, // 🔹 Add loading state
            showSubscriptionModal: false,
            subscriptionMessage: '',
            currentPage: 1,
            perPage: 8,
        };
    },
    components: {
        Searchbar,
        TableStructure,
    },
    computed: {
        filteredQuizzes() {
            if (!this.searchQuery) return this.quizzes;
            const searchLower = this.searchQuery.toLowerCase();
            return this.quizzes.filter(quiz =>
                quiz.id.toLowerCase().includes(searchLower) ||
                quiz.name.toLowerCase().includes(searchLower)
            );
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredQuizzes.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredQuizzes.length / this.perPage);
        }
    },
    methods: {
        visiblePages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const startPage = Math.max(
                1,
                Math.min(this.currentPage - 2, this.totalPages - 4)
            );
            const endPage = Math.min(startPage + 4, this.totalPages);

            return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            );
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        resetPagination() {
            this.currentPage = 1;
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },

        async fetchOrganizationId() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                this.organizationId = user.uid;
                return;
            }

            // Use onAuthStateChanged only if currentUser is null
            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        this.organizationId = user.uid;
                        resolve(this.organizationId);
                    } else {
                        console.error("User not logged in");
                        reject("No user");
                    }
                });
            });
        },

        async fetchQuizzes() {
            if (!this.organizationId) return;
            try {
                this.loading = true; // 🔹 Show the spinner
                const db = getDatabase();
                const quizzesRef = ref(db, "organizationQuizzes");
                const snapshot = await get(quizzesRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.quizzes = Object.entries(data)
                        .map(([id, quiz]) => ({
                            id,
                            name: quiz.title,
                            questions: quiz.questions || [],
                            duration: quiz.duration || "N/A",
                            organizationUid: quiz.organizationUid, // ✅ Ensure the correct field is used
                        }))
                        .filter(quiz => String(quiz.organizationUid) === String(this.organizationId)); // ✅ Match organizationUid
                } else {
                    this.quizzes = [];
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                this.loading = false; // 🔹 Hide the spinner after fetching
            }
        },
        editQuiz(quizId) {
            console.log("Navigating to Edit Quiz:", quizId);
            this.$router.push({ name: "editQuiz", params: { quizId } });
        },
        async handleCreateQuiz() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    alert("Please log in to create quizzes.");
                    return;
                }

                // ✅ Fetch organization data
                const orgResponse = await fetch(
                    "https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json"
                );
                const orgsData = await orgResponse.json();

                const organizationKey = Object.keys(orgsData || {}).find(
                    (key) => orgsData[key].adminUid === user.uid
                );

                if (!organizationKey) {
                    alert("Organization not found.");
                    return;
                }

                const organization = orgsData[organizationKey];

                // ✅ Calculate allowed quizzes from all plans
                let totalAllowed = 0;
                if (organization.plans) {
                    Object.values(organization.plans).forEach(
                        (plan) => (totalAllowed += Number(plan.noOfQuizzes) || 0)
                    );
                }

                console.log(`Total allowed quizzes: ${totalAllowed}`);

                // ✅ Fetch existing quiz count for this organization
                const quizResponse = await fetch(
                    "https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json"
                );
                const quizData = await quizResponse.json();

                const currentQuizzes = Object.values(quizData || {}).filter(
                    (quiz) => quiz.organizationUid === user.uid
                ).length;

                console.log(`Current quizzes: ${currentQuizzes}/${totalAllowed}`);

                // ❌ Prevent quiz creation if limit is reached
                if (totalAllowed === 0) {
                    this.subscriptionMessage =
                        "You haven't subscribed to a plan yet. Please choose a plan to start creating quizzes.";
                    this.showSubscriptionModal = true;
                    return;
                }

                if (currentQuizzes >= totalAllowed) {
                    this.subscriptionMessage = `You've created ${currentQuizzes}/${totalAllowed} quizzes. Upgrade your plan to add more.`;
                    this.showSubscriptionModal = true;
                    return;
                }

                // ✅ Only navigate if within limit
                this.$router.push("/organization/createQuiz");
            } catch (error) {
                console.error("Error:", error);
                alert("Error checking quota. Please try again.");
            }
        },
        viewQuiz() {
            this.$router.push('/organization/quizzes');
        },
        previewQuiz(quizId) {
            this.$router.push(`/quiz/quizPreview/${quizId}`);
        },
    },
    async mounted() {
        try {
            await this.fetchOrganizationId();
            await this.fetchQuizzes();
        } catch (error) {
            console.error("Error initializing component:", error);
            this.loading = false; // 🔹 Ensure the spinner disappears on failure
        }
    },
};
</script>
