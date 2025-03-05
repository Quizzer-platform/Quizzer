<template>
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
                // { text: "What is Vue.js?", options: ["A framework", "A library", "A database", "None of these"] },
                // { text: "What is Tailwind CSS?", options: ["Utility-first CSS", "A component library", "A JavaScript framework", "None of these"] },
                // { text: "Which language does Vue use?", options: ["JavaScript", "Python", "Ruby", "C++"] },
                // { text: "What does v-model do?", options: ["Two-way binding", "One-way binding", "State management", "Styling"] },
                // { text: "Which directive is used for loops in Vue?", options: ["v-for", "v-if", "v-bind", "v-model"] },
            ],
            selectedAnswers: [],
            correctAnswers: [],
            isLoading: false,
        };
    },
    methods: {
        loadQuestions() {
            this.isLoading = true;
            fetch('https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json', {})
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(data => {
                    this.isLoading = false;
                    console.log('Data:', data);
                    const questions = [];
                    const correctAnswers = [];
                    for (const id in data) {
                        for (let i = 0; i < data[id].questions.length; i++) {
                            questions.push({ text: data[id].questions[i].questionHead, options: data[id].questions[i].options });
                            correctAnswers.push(data[id].questions[i].correctAnswer);
                            console.log(data[id].questions[i].correctAnswer)
                            console.log(correctAnswers)
                        }
                        this.quizName = data[id].title;
                    }
                    this.questions = questions;
                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                    this.isLoading = false;
                });
        },
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
            this.calculateScore();
        },
    },
    mounted() {
        this.loadQuestions();
    },
};
</script>
