<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
            <!-- Add error state display -->
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ error }}
            </div>

            <h1 class="text-center text-2xl font-extrabold text-gray-800 mb-6">📜 {{ quizName }}</h1>
            <p class="text-xl font-extrabold text-black bg-teal-400 p-2 rounded-xl" v-if="isLoading">
                Loading please wait....
            </p>
            <div v-if="!isLoading && questions.length > 0" class="space-y-6">
                <div v-for="(question, index) in questions" :key="index" class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        Question {{ index + 1 }}: {{ question.text }}
                    </h3>
                    <div class="space-y-3">
                        <div v-for="(option, optIndex) in question.options" :key="optIndex"
                            class="p-4 rounded-lg transition-all duration-200"
                            :class="{
                                'bg-green-100 shadow-md transform scale-102': optIndex === correctAnswers[index],
                                'bg-gray-50': optIndex !== correctAnswers[index]
                            }">
                            {{ option }}
                        </div>
                        <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p class="text-green-700 font-semibold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Correct Answer: {{ question.answer }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 text-center">
                <button @click="goToQuizzes"
                    class="bg-teal-600 text-white px-6 py-2 mx-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    Check Other Quizzes
                </button>
                <button @click="goToProfile"
                    class="bg-teal-600 text-white px-6 py-2 mx-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    Back To Profile
                </button>
                <button @click="goToHome"
                    class="bg-teal-600 text-white px-6 py-2 mx-2 rounded-lg shadow-md hover:bg-teal-700 transition hover:cursor-pointer">
                    Back To Home
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
        };
    },

    methods: {
        processQuizData(data) {
            this.quizName = data.title || 'Untitled Quiz';
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
                        this.$router.push('/quizzes');
                    }
                }
            } catch (error) {
                this.error = "Error loading quiz. Please try again.";
                console.error("Error loading quiz:", error);
            } finally {
                this.isLoading = false;
            }
        },
        goToHome() {
            this.$router.push("/");
        },
        goToQuizzes() {
            this.$router.push("/quizzes");
        },
        goToProfile() {
            this.$router.push("/profile/userQuizzes");
        },
    },
    beforeMount() {
        this.loadQuestions();
    },
    beforeUnmount() {
        this.questions = [];
        this.quizName = '';
        this.error = null;
    },
};
</script>