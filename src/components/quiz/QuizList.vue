<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div class="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8" v-if="!showSubscriptionPopup">
            <!-- Add Timer Box -->
            <div class="mb-6 text-center" v-if="!isLoading && questions.length > 0">
                <div class="bg-teal-100 p-4 rounded-lg inline-block">
                    <span class="text-2xl font-bold text-teal-800">
                        {{ formatTime(timeRemaining) }}
                    </span>
                </div>
            </div>

            <h1 class="text-center text-2xl font-extrabold text-gray-800 mb-6">📜 {{ quizName }}</h1>
            <p class="text-xl font-extrabold text-black bg-red-400 p-2 rounded-xl" v-if="isLoading">
                Loading please wait....
            </p>
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
                <p class="text-xl text-gray-700 mt-2">
                    Your Score: <span class="font-bold text-green-600">{{ score }}</span> / {{ questions.length }}
                </p>
                <button @click="goToHome"
                    class="mt-4 bg-teal-800 hover:bg-teal-900 mb-6 cursor-pointer text-white px-6 py-2 rounded-lg shadow-md transition">
                    Go to Home
                </button>
            </div>
        </div>

        <div v-if="showSubscriptionPopup"
            class="fixed inset-0 flex items-center justify-center bg-teal-700 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 class="text-2xl font-bold text-red-600">❌ Access Denied!</h2>
                <p class="text-lg text-gray-700 mt-2">To take another exam, you should subscribe.</p>
                <button @click="goToPricing"
                    class="mt-4 bg-teal-600 hover:bg-teal-800 text-white px-6 py-2 rounded-lg shadow-md transition">
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
            quizzesToTake: 0,
            // Add timer-related data properties
            timeRemaining: 0,
            timer: null,
            quizDuration: 0
        };
    },
    methods: {
        async loadQuestions() {
            this.isLoading = true;
            const quizId = this.$route.params.quizId;

            try {
                // نجرب نجيب الكويز من adminQuizzes
                const adminQuizRes = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes/${quizId}.json`);
                const adminData = await adminQuizRes.json();
                console.log("Admin Data:", adminData);

                if (adminData && adminData.questions) {
                    this.quizName = adminData.title;
                    this.description = adminData.description;
                    this.questions = adminData.questions.map(q => ({
                        text: q.questionHead,
                        options: q.options
                    }));
                    this.correctAnswers = adminData.questions.map(q => q.correctAnswer);
                    this.quizDuration = adminData.duration || 30; // Default 30 minutes if not set
                    this.startTimer();
                } else {

                    const orgQuizRes = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${quizId}.json`);
                    const orgData = await orgQuizRes.json();
                    console.log("org Data:", orgData);

                    if (orgData && orgData.questions) {
                        this.quizName = orgData.title;
                        this.description = orgData.description;
                        this.questions = orgData.questions.map(q => ({
                            text: q.questionHead,
                            options: q.options
                        }));
                        this.correctAnswers = orgData.questions.map(q => q.correctAnswer);
                        this.quizDuration = orgData.duration || 30; // Default 30 minutes if not set
                        this.startTimer();
                    } else {
                        console.error("Quiz not found in either source!");
                        alert("Quiz not found.");
                        return;
                    }
                }

                await this.checkSubscription();

            } catch (error) {
                console.error("Error loading quiz:", error);
                alert("Error loading quiz. Please try again.");
            } finally {
                this.isLoading = false;
            }
        }
        ,


        async checkSubscription() {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    this.quizzesToTake = userData.quizzesToTake || 0;

                    const attemptedQuizzes = userData.attemptedQuizzes || [];
                    const quizId = this.$route.params.quizId;
                    const alreadyAttempted = attemptedQuizzes.some(q => q.quizId === quizId);

                    if (alreadyAttempted) {
                        alert("You have already taken this quiz!");
                        this.$router.push("/");
                        return;
                    }

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
        async updateOverallScore(quizScore) {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const updatedScore = (userData.overallScore || 0) + quizScore;

                    await update(userRef, { overallScore: updatedScore });
                }
            } catch (error) {
                console.error("Error updating overall score:", error);
            }
        },


        async storeAttemptedQuiz(quizId, quizScore) {
            if (!this.userId) return;

            const userRef = dbRef(database, `users/${this.userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const prevAttempts = userData.attemptedQuizzes || [];

                    const alreadyAttempted = prevAttempts.some(q => q.quizId === quizId);
                    if (alreadyAttempted) return; // prevent duplicate entry


                    const attempt = {
                        quizId,
                        quizScore,
                        title: this.quizName || "Untitled",
                        category: this.description || "General",
                        totalQuestions: this.questions.length || 0,
                        timestamp: new Date().toISOString()
                    };

                    const updatedAttempts = [...prevAttempts, attempt];

                    await update(userRef, {
                        attemptedQuizzes: updatedAttempts
                    });
                }
            } catch (error) {
                console.error("Error storing attempted quiz:", error);
            }
        }
        ,
        startTimer() {
            try {
                if (this.timer) {
                    clearInterval(this.timer); // Clear existing timer if any
                }
                this.timeRemaining = this.quizDuration * 60;
                this.timer = setInterval(() => {
                    if (this.timeRemaining > 0) {
                        this.timeRemaining--;
                    } else {
                        this.handleTimeUp();
                    }
                }, 1000);
            } catch (error) {
                console.error("Error starting timer:", error);
            }
        },

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },

        handleTimeUp() {
            clearInterval(this.timer);
            alert("Time's up! Your quiz will be submitted automatically.");
            this.submitQuiz();
        },

        async submitQuiz() {
            clearInterval(this.timer); // Clear timer when submitting
            this.score = this.calculateScore();
            this.showPopup = true;

            const quizId = this.$route.params.quizId;

            if (this.userId) {
                await this.updateOverallScore(this.score);
                await this.storeAttemptedQuiz(quizId, this.score);
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
        this.loadQuestions();
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
};
</script>