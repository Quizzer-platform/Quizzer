
<template>
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading quiz details...</p>
        </div>
    </div>

    <div v-else class="flex flex-col items-center md:w-full md:flex-row md:items-start md:gap-4 max-w-6xl mx-auto p-6">
        <div class="flex flex-col my-4 p-4 rounded-xl shadow-md bg-gray-100 md:w-[50%]">
            <div class="flex flex-col items-start bg-gray-100 p-4 rounded-xl shadow-md md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 m-2">{{ QuizName }}</h2>
                </div>
                <div>
                    <button 
                        @click="handleStartQuiz" 
                        class="bg-teal-700 text-white px-4 py-2 m-2 rounded-lg hover:bg-teal-500 cursor-pointer"
                    >
                        Get Start
                    </button>
                </div>
            </div>
            <div class="flex flex-col mt-4 font-semibold m-2 p-4 rounded-xl w-fit">
                <div class="bg-teal-200 m-2 p-4 rounded-xl shadow-md hover:bg-teal-100">
                    &#10004; {{ categoryTitle || 'Category not found' }}
                </div>
                <div class="bg-red-200 m-2 p-4 rounded-xl shadow-md hover:bg-red-100">&#10004; 10 min</div>
                <div class="bg-orange-200 m-2 p-4 rounded-xl shadow-md hover:bg-orange-100">&#10004; low</div>
            </div>
        </div>

        <div class="md:w-[50%]">
            <div class="p-4 rounded-xl shadow-md md:w-full">
                <div class="p-4 bg-gray-100 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Summary of the {{ QuizName }} test</h3>
                    <p class="mt-2">{{ QuizDescribtion }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Access Restriction -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 class="text-lg sm:text-xl font-semibold text-red-600">Quizzes Are Meant for Users Only</h3>
            <p class="text-gray-600 mt-2 text-sm sm:text-base">
                You cannot join this quiz because you are an {{ userRole }} {{ organizationName ? `from ${organizationName}` : '' }}.
            </p>
            <button 
                @click="showModal = false" 
                class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            >
                OK
            </button>
        </div>
    </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

export default {
    data() {
        return {
            quiz: {},
            QuizName: "",
            QuizDescribtion: "",
            category: "",
            categoryTitle: "",
            loading: true,
            showModal: false,  
            userRole: "",
            organizationName: "", 
        };
    },

    methods: {
        async fetchUserRole() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    this.userRole = userData.role;  // role: 'admin', 'organization', or 'user'
                    this.organizationName = userData.organization || ""; // Fetch organization name if available
                }
            }
        },

        handleStartQuiz() {
            if (this.userRole === "admin" || this.userRole === "organization_admin") {
                this.showModal = true;  // Show modal if restricted
            } else {
                this.$router.push(`/quizzes/${this.quiz.id}`);
            }
        },

        async loadQuizDetails() {
            const quizId = this.$route.params.quizId;
            if (!quizId) {
                this.loading = false;
                return;
            }

            try {
                const quizResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes/${quizId}.json`);
                const quizData = await quizResponse.json();

                if (quizData) {
                    this.quiz = { ...quizData, id: quizId };
                    this.QuizName = quizData.title;
                    this.QuizDescribtion = quizData.description;
                    this.category = quizData.category;

                    const categoriesResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/categories.json`);
                    const categoriesData = await categoriesResponse.json();

                    if (categoriesData) {
                        const matchedCategory = Object.entries(categoriesData).find(
                            ([_, cat]) => cat.quizzes && cat.quizzes.includes(quizId)
                        );

                        if (matchedCategory) {
                            this.categoryTitle = matchedCategory[1].title;
                        } else {
                            this.categoryTitle = "Category not found";
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading quiz details:", error);
            } finally {
                this.loading = false;
            }
        }
    },

    async mounted() {
        await this.fetchUserRole();  // Fetch user role before loading quiz details
        this.loadQuizDetails();
    }
};
</script>
