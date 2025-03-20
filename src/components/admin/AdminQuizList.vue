<template>
    <div class="mt-8 mx-6 bg-transparent mb-8">
        <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
            <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Quizzes Review</h2>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
        </div>

        <!-- 🔹 Loading Spinner -->
        <div v-if="loading" class="flex justify-center my-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
        </div>

        <!-- Show No Data Message -->
        <p v-else-if="quizzes.length === 0" class="text-center text-gray-500">No quizzes available</p>

        <!-- Quizzes Table -->
        <TableStructure v-else :headers="['QUIZ ID', 'Name of Quiz', 'No. of Questions', 'Org. Name']" 
            :rows="filteredQuizzes.map(quiz => [
                quiz.id,
                quiz.name,
                quiz.questions,
                quiz.organization
            ])" 
            :showActions="true" 
            @view-details="previewQuiz"
            :userRole="'admin'" />
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import SearchBar from "../layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
    data() {
        return {
            quizzes: [],
            searchQuery: "",
            adminId: null,
            loading: true,
        };
    },
    components: {
        SearchBar,
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
    },
    methods: {
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
