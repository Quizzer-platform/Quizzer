<template>
    <div class="mt-8 mx-6 bg-transparent mb-8">
        <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
            <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Quizzes Review</h2>
            <Searchbar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quizzes...</p>
        </div>

        <!-- Show No Data Message -->
        <p v-else-if="filteredQuizzes.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6 h-50 flex flex-col justify-center items-center">No quizzes found</p>

        <!-- Quizzes Table -->
        <TableStructure v-else :headers="['QUIZ Code', 'Name of Quiz', 'No. of Questions', 'Org. Name']" :rows="paginatedData.map(quiz => [
            quiz.id,
            quiz.name,
            quiz.questions,
            quiz.organization
        ])" :showActions="true" @view-details="previewQuiz" :userRole="'admin'" />

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

    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import TableStructure from "@/components/admin/TableStructure.vue";
import Searchbar from "@/components/layout/Searchbar.vue";

export default {
    data() {
        return {
            quizzes: [],
            searchQuery: "",
            adminId: null,
            loading: true,
            currentPage: 1,
            perPage: 8
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
        editQuiz(quizId) {
            const quiz = this.quizzes.find(q => q.id === quizId);
            if (!quiz) return;

            if (quiz.organization === "Quizzer Platform") {
                this.$router.push({ name: "adminEditQuiz", params: { quizId } });
            } else {
                this.$router.push({ name: "editQuiz", params: { quizId } });
            }
        },
        async fetchAdminId() {
            return new Promise((resolve, reject) => {
                const auth = getAuth();
                onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        console.error("User not logged in");
                        reject("No user");
                        return;
                    }
                    this.adminId = user.uid;
                    resolve(this.adminId);
                });
            });
        },

        async fetchQuizzes() {
            try {
                this.loading = true;
                const db = getDatabase();

                // Fetch Admin Quizzes
                const adminQuizzesRef = ref(db, "adminQuizzes");
                const adminSnapshot = await get(adminQuizzesRef);
                let adminQuizzes = [];

                if (adminSnapshot.exists()) {
                    const adminData = adminSnapshot.val();
                    adminQuizzes = Object.entries(adminData).map(([id, quiz]) => ({
                        id,
                        name: quiz.title || "Untitled Quiz",
                        questions: quiz.numberOfQuestions || 0,
                        duration: quiz.duration || "N/A",
                        organization: "Quizzer", // Admin-created quizzes
                    }));
                }

                // Fetch Organization Quizzes
                const orgQuizzesRef = ref(db, "organizationQuizzes");
                const orgSnapshot = await get(orgQuizzesRef);
                let orgQuizzes = [];

                if (orgSnapshot.exists()) {
                    const orgData = orgSnapshot.val();
                    const quizzesWithOrgIds = Object.entries(orgData).map(([id, quiz]) => ({
                        id,
                        name: quiz.title || "Untitled Quiz",
                        questions: quiz.numberOfQuestions || 0,
                        duration: quiz.duration || "N/A",
                        organizationId: quiz.organizationUid, // We need to fetch the org name
                    }));

                    // Fetch Organization Names from Users Collection
                    const usersRef = ref(db, "users");
                    const usersSnapshot = await get(usersRef);
                    let orgNames = {};

                    if (usersSnapshot.exists()) {
                        const usersData = usersSnapshot.val();
                        orgNames = Object.fromEntries(
                            Object.entries(usersData).map(([uid, user]) => [uid, user.name || "Unknown Organization"])
                        );
                    }

                    // Assign Organization Names
                    orgQuizzes = quizzesWithOrgIds.map(quiz => ({
                        ...quiz,
                        organization: orgNames[quiz.organizationId] || "Unknown Organization",
                    }));
                }

                // Merge Both Quiz Lists
                this.quizzes = [...adminQuizzes, ...orgQuizzes];

            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                this.loading = false;
            }
        },
        previewQuiz(quizId) {
            this.$router.push(`/quiz/quizPreview/${quizId}`);
        },
    },
    async mounted() {
        try {
            await this.fetchAdminId();
            await this.fetchQuizzes();
        } catch (error) {
            console.error("Error initializing component:", error);
            this.loading = false;
        }
    },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
