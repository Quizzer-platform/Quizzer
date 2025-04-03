<template>
    <div class="min-h-screen bg-gray-100 dark:bg-[#1a202c] flex items-center justify-center p-6">
        <div class="max-w-3xl w-full bg-white dark:bg-[#23283b] shadow-lg rounded-lg p-8">
            <!-- Add error state display -->
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>

            <h1 class="text-center text-2xl font-extrabold text-gray-800 dark:text-gray-100 my-4 ">📜 {{ quizName }}
            </h1>
            <h4 class="text-start text-xl font-semibold text-gray-800 dark:text-gray-100 my-4 p-4 rounded-lg transition-all duration-200 
                            block border border-gray-300 dark:border-gray-600
                             dark:peer-checked:text-teal-200">Quiz Code : {{ QuizId }}</h4>
            <h4 class="text-start text-xl font-semibold text-gray-800 dark:text-gray-100 my-4 p-4 rounded-lg transition-all duration-200 
                            block border border-gray-300 dark:border-gray-600
                             dark:peer-checked:text-teal-200">Quiz Describtion : {{ QuizDescribtion }}</h4>
            <h4 class="text-start text-xl font-semibold text-gray-800 dark:text-gray-100 my-4 p-4 rounded-lg transition-all duration-200 
                            block border border-gray-300 dark:border-gray-600 dark:peer-checked:text-teal-200"> Quiz
                Duration : {{ QuizDuration }}</h4>
            <h4 class="text-start text-xl font-semibold text-gray-800 dark:text-gray-100 my-4 p-4 rounded-lg transition-all duration-200 
                            block border border-gray-300 dark:border-gray-600 dark:peer-checked:text-teal-200">Score
                Per Question : {{ scorePerQuestion }}</h4>
            <h4 class="text-start text-xl font-semibold text-gray-800 dark:text-gray-100 mb-10 p-4 rounded-lg transition-all duration-200 
                        block border border-gray-300 dark:border-gray-600 dark:peer-checked:text-teal-200">Number Of
                Question : {{ numberOfQuestions }}</h4>
            <div v-if="isLoading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quiz details...</p>
            </div>
            <div v-if="!isLoading && questions.length > 0" class="space-y-6">
                <div v-for="(question, index) in questions" :key="index"
                    class="bg-whitedark:bg-[#1a1f2e] rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold  text-teal-700 dark:text-teal-400 mb-4">
                        Question {{ index + 1 }}: {{ question.text }}
                    </h3>
                    <div class="space-y-3">
                        <div v-for="(option, optIndex) in question.options" :key="optIndex" class="p-4 rounded-lg transition-all duration-200 
                            block border border-gray-300 dark:border-gray-600
                            dark:text-gray-300 dark:peer-checked:text-teal-200" :class="{
                                'bg-green-100 shadow-md transform scale-102': optIndex === correctAnswers[index], // Correct answer
                                'bg-gray-50 dark:bg-[#23283b]': optIndex !== correctAnswers[index] // Other options take the same style
                            }">
                            {{ option }}
                        </div>

                        <div
                            class="mt-4 p-3 bg-green-100 dark:bg-green-300 border border-green-200 rounded-lg dark:border-green-300">
                            <p class="dark:text-green-900 text-green-700 font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Correct Answer: {{ question.answer }}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <div class="mt-6 text-center">
                <button @click="goToQuizzesList"
                    class="bg-teal-600 text-white px-6 py-2 m-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    All Quizzes
                </button>
                <button @click="goToDashboard"
                    class="bg-teal-600 text-white px-6 py-2 m-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    Back To Dashboard
                </button>
                <button @click="goToEditQuiz(quizId)"
                    class="bg-teal-600 text-white px-6 py-2 m-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    Edit Quiz
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        quizId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            quizName: '',
            questions: [],
            correctAnswers: [],
            isLoading: false,
            error: null,
            userRole: null,
            scorePerQuestion: "",
            QuizDescribtion: "",
            QuizDuration: "",
            numberOfQuestions: "",
            QuizId: ""
        };
    },

    methods: {
        async getUserRole() {
            const user = this.$store.state.user;
            if (!user) {
                this.$router.push('/login');
                return null;
            }

            try {
                const response = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/users/${user.uid}.json`);
                if (!response.ok) throw new Error('Failed to fetch user data');

                const userData = await response.json();
                this.userRole = userData?.role || null;
                if (!this.userRole) {
                    throw new Error('User role not found');
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                // this.error = 'Error fetching user data';
            }
        },

        goToEditQuiz() {
            const quizId = this.$route.params.quizId;
            if (!quizId) return;

            if (this.userRole === 'admin') {
                this.$router.push(`/admin/quizzes/${quizId}`);
            } else {
                this.$router.push(`/organization/quizzes/${quizId}`);
            }
        },

        goToQuizzesList() {
            if (this.userRole === 'admin') {
                this.$router.push('/admin/quizzes');
            } else {
                this.$router.push('/organization/quizzes');
            }
        },

        goToDashboard() {
            if (this.userRole === 'admin') {
                this.$router.push('/admin');
            } else {
                this.$router.push('/organization');
            }
        },
        processQuizData(data) {
            this.quizName = data.title || 'Untitled Quiz';
            this.scorePerQuestion = data.scorePerQuestion || 0;
            this.QuizDescribtion = data.description || '';
            this.QuizDuration = data.duration || '';
            this.numberOfQuestions = data.questions.length || 0;
            this.questions = data.questions.map(q => ({
                text: q.questionHead || '',
                options: q.options || [],
                answer: q.correctAnswer || ''
            }));
            this.correctAnswers = data.questions.map(q => q.correctAnswer || 0);
        },

        async loadQuestions() {
            if (this.isLoading) return;
            this.isLoading = true;
            this.error = null; // Reset error state
            const quizId = this.$route.params.quizId;

            this.QuizId = quizId;
            if (!quizId) {
                this.error = "Quiz ID not found";
                this.$router.push('/quizzes');
                return;
            }

            try {
                const adminQuizRes = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes/${quizId}.json`);
                if (!adminQuizRes.ok) throw new Error('Failed to fetch quiz data');

                const adminData = await adminQuizRes.json();

                if (adminData && adminData.questions) {
                    this.processQuizData(adminData);
                } else {
                    const orgQuizRes = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${quizId}.json`);
                    if (!orgQuizRes.ok) throw new Error('Failed to fetch quiz data');

                    const orgData = await orgQuizRes.json();

                    if (orgData && orgData.questions) {
                        this.processQuizData(orgData);
                    } else {
                        this.error = "Quiz not found";
                    }
                }
            } catch (error) {
                this.error = "Error loading quiz. Please try again.";
                console.error("Error loading quiz:", error);
            } finally {
                this.isLoading = false;
            }
        },
    },
    async beforeMount() {
        await this.loadQuestions();
        await this.getUserRole();
    },
    beforeUnmount() {
        this.questions = [];
        this.quizName = '';
        this.error = null;
    },
};
</script>