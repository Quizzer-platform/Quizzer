<!-- <template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
            <h1 class="text-center text-2xl font-extrabold text-gray-800 mb-6">📜 {{quizName}}</h1>
            <p class="text-xl font-extrabold text-black bg-red-400 p-2 rounded-xl" v-if="isLoading">Loading please
                wait....</p>
            <form @submit.prevent="submitQuiz" v-if="!isLoading && questions.length > 0">
                <QuestionItem v-for="(question, index) in questions" :key="index" :question="question" :index="index"
                    :modelValue="selectedAnswers[index]"
                    @update:modelValue="(newValue) => selectedAnswers[index] = newValue"
                    :isLastQuestion="index === questions.length - 1" @submit-quiz="submitQuiz" />
            </form>
        </div>
        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-teal-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center w-4xl">
                <h2 class="text-2xl font-bold text-gray-800">Quiz Results:</h2>
                <p class="text-xl text-gray-700 mt-2">Your Score: <span class="font-bold text-green-600">{{ score }}</span> / {{ questions.length }}</p>
                
                <button 
                    @click="goToHome" 
                    class="mt-4 bg-teal-800 hover:bg-teal-900 mb-6 cursor-pointer text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                    Go to Home
                </button>
            </div>
        </div>

    </div>

</template>

<script>
import QuestionItem from "./QuestionItem.vue";

export default {
    components: {
        QuestionItem,
    },
    data() {
        return {
            quizName: '',
            questions: [
                       ],
            selectedAnswers: [],
            correctAnswers: [],
            isLoading: false,
            showPopup: false, 
            score: 0, 
        };
    },
   
        methods: {
    loadQuestions() {
        this.isLoading = true;
        const quizId = this.$route.params.quizId; // احضار معرف الاختبار من الرابط
        fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/quizData/${quizId}.json`)
            .then(response => response.json())
            .then(data => {
                this.isLoading = false;
                if (data) {
                    this.quizName = data.title;
                    this.questions = data.questions.map(q => ({
                        text: q.questionHead,
                        options: q.options
                    }));
                    this.correctAnswers = data.questions.map(q => q.correctAnswer);
                } else {
                    console.error("Quiz not found!");
                }
            })
            .catch(error => {
                console.error("Error loading quiz:", error);
                alert("Error loading quiz. Please try again.");
                this.isLoading = false;
            });
    }
,

        calculateScore(){
            let score = 0;
            for (let i = 0; i < this.questions.length; i++) {
                if (this.selectedAnswers[i] === this.correctAnswers[i]) {
                    score++;
                }
            }
            console.log("Score:", score);
            return score;
        },
       
        submitQuiz() {
            console.log("Selected Answers:", this.selectedAnswers);

            this.score = this.calculateScore(); // ✅ حساب النتيجة
            this.showPopup = true; // ✅ إظهار النافذة المنبثقة
        },
        goToHome() {
            this.$router.push("/"); // ✅ الانتقال إلى الصفحة الرئيسية
        }
    },
    mounted() {
        
       
    console.log("Quiz ID from route:", this.$route.params.quizId); // Debugging
    this.loadQuestions();


    },
};
</script> -->

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8" v-if="!showSubscriptionPopup">
            <h1 class="text-center text-2xl font-extrabold text-gray-800 mb-6">📜 {{ quizName }}</h1>
            <p class="text-xl font-extrabold text-black bg-red-400 p-2 rounded-xl" v-if="isLoading">
                Loading please wait....
            </p>
            <form @submit.prevent="submitQuiz" v-if="!isLoading && questions.length > 0">
                <QuestionItem v-for="(question, index) in questions" 
                    :key="index" 
                    :question="question" 
                    :index="index"
                    :modelValue="selectedAnswers[index]"
                    @update:modelValue="(newValue) => selectedAnswers[index] = newValue"
                    :isLastQuestion="index === questions.length - 1" 
                    @submit-quiz="submitQuiz" />
            </form>
        </div>

        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-teal-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center w-4xl">
                <h2 class="text-2xl font-bold text-gray-800">Quiz Results:</h2>
                <p class="text-xl text-gray-700 mt-2">
                    Your Score: <span class="font-bold text-green-600">{{ score }}</span> / {{ questions.length }}
                </p>
                <button 
                    @click="goToHome" 
                    class="mt-4 bg-teal-800 hover:bg-teal-900 mb-6 cursor-pointer text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                    Go to Home
                </button>
            </div>
        </div>

        <div v-if="showSubscriptionPopup" class="fixed inset-0 flex items-center justify-center bg-teal-700 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 class="text-2xl font-bold text-red-600">❌ Access Denied!</h2>
                <p class="text-lg text-gray-700 mt-2">To take another exam, you should subscribe.</p>
                <button 
                    @click="goToPricing" 
                    class="mt-4 bg-teal-600 hover:bg-teal-800 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                    Go to Pricing Page
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as dbRef, get, update } from 'firebase/database';
import { database } from '@/firebase';
import QuestionItem from "./QuestionItem.vue";

export default {
    components: {
        QuestionItem,
    },
    data() {
        return {
            quizName: '',
            questions: [],
            selectedAnswers: [],
            correctAnswers: [],
            isLoading: false,
            showPopup: false,
            showSubscriptionPopup: false, 
            score: 0,
            userId: this.$store.state.user?.uid,
            quizzesToTake: 0 
        };
    },
    methods: {
        async loadQuestions() {
            this.isLoading = true;
            const quizId = this.$route.params.quizId;
            try {
                const response = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/quizData/${quizId}.json`);
                const data = await response.json();

                if (data) {
                    this.quizName = data.title;
                    this.questions = data.questions.map(q => ({
                        text: q.questionHead,
                        options: q.options
                    }));
                    this.correctAnswers = data.questions.map(q => q.correctAnswer);
                    
                    await this.checkSubscription(); 
                } else {
                    console.error("Quiz not found!");
                }
            } catch (error) {
                console.error("Error loading quiz:", error);
                alert("Error loading quiz. Please try again.");
            } finally {
                this.isLoading = false;
            }
        },

        async checkSubscription() {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    this.quizzesToTake = userData.quizzesToTake || 0;

                    if (this.quizzesToTake === 0) {
                        this.showSubscriptionPopup = true; 
                    } else {
                        await this.decreaseQuizzesToTake(); 
                    }
                }
            } catch (error) {
                console.error("Error checking subscription:", error);
            }
        },

        async decreaseQuizzesToTake() {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.quizzesToTake > 0) {
                        await update(userRef, { quizzesToTake: userData.quizzesToTake - 1 });
                        this.quizzesToTake = userData.quizzesToTake - 1;
                    }
                }
            } catch (error) {
                console.error("Error decreasing quizzesToTake:", error);
            }
        },

        calculateScore() {
            let score = 0;
            for (let i = 0; i < this.questions.length; i++) {
                if (this.selectedAnswers[i] === this.correctAnswers[i]) {
                    score++;
                }
            }
            return score;
        },

        async submitQuiz() {
            console.log("Selected Answers:", this.selectedAnswers);
            this.score = this.calculateScore();
            this.showPopup = true;

            if (this.userId) {
                await this.updateOverallScore(this.score);
            }
        },

        async updateOverallScore(quizScore) {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const updatedScore = (userData.overallScore || 0) + quizScore;

                    await update(userRef, { overallScore: updatedScore });

                    console.log("Updated Overall Score:", updatedScore);
                }
            } catch (error) {
                console.error("Error updating overall score:", error);
            }
        },

        goToHome() {
            this.$router.push("/");
        },

        goToPricing() {
            this.$router.push("/pricing"); 
        }
    },
    mounted() {
        console.log("Quiz ID from route:", this.$route.params.quizId);
        this.loadQuestions();
    },
};
</script>
