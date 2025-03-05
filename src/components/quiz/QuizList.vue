<template>
<div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
    <h1 class="text-center text-2xl font-extrabold text-gray-800 mb-6">📜 Quiz Name</h1>

    <form @submit.prevent="submitQuiz">
        <QuestionItem
        v-for="(question, index) in questions"
        :key="index"
        :question="question"
        :index="index"
        :modelValue="selectedAnswers[index]"
        @update:modelValue="(newValue) => selectedAnswers[index] = newValue"
        :isLastQuestion="index === questions.length - 1"
        @submit-quiz="submitQuiz"
        />
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
    questions: [
        { text: "What is Vue.js?", options: ["A framework", "A library", "A database", "None of these"] },
        { text: "What is Tailwind CSS?", options: ["Utility-first CSS", "A component library", "A JavaScript framework", "None of these"] },
        { text: "Which language does Vue use?", options: ["JavaScript", "Python", "Ruby", "C++"] },
        { text: "What does v-model do?", options: ["Two-way binding", "One-way binding", "State management", "Styling"] },
        { text: "Which directive is used for loops in Vue?", options: ["v-for", "v-if", "v-bind", "v-model"] },
    ],
    selectedAnswers: {}, 
    };
},
methods: {
    submitQuiz() {
    console.log("Selected Answers:", this.selectedAnswers);
    },
},
};
</script>
