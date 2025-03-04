<template>
    <div class="container mx-auto p-4">
        <form @submit.prevent="submitQuiz" class="space-y-6">
            <!-- Quiz Details -->
            <div class="bg-teal-100 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Create a New Quiz</h2>
                <div class="space-y-5">
                    <div>
                        <label for="title" class="block text-sm font-medium text-black">Title</label>
                        <input id="title" v-model="quiz.title" type="text"
                            class="mt-2 p-2 block w-full bg-teal-300 rounded-lg  shadow-md">
                    </div>
                    <div>
                        <label for="description" class="block text-sm font-medium text-black">Description</label>
                        <textarea id="description" rows="4" v-model="quiz.description"
                        class="mt-2 p-4 block w-full rounded-lg bg-teal-300 shadow-md"></textarea>
                    </div>
                    <div class="md:w-1/2">
                        <label for="duration" class="block text-sm font-medium text-black">Duration (in minutes)</label>
                        <input id="duration" v-model="quiz.duration" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                    <div class="md:w-1/2">
                        <label for="numberOfQuestions" class="block text-sm font-medium text-black">Number of Questions</label>
                        <input id="numberOfQuestions" v-model="quiz.numberOfQuestions" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                    <div class="md:w-1/2">
                        <label class="block text-sm font-medium text-black">Reveal answers after quiz</label>
                        <select v-model="quiz.revealAnswers"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div class="md:w-1/2">
                        <label for="scorePerQuestion" class="block text-sm font-medium text-black">Score per Question</label>
                        <input id="scorePerQuestion" v-model="quiz.scorePerQuestion" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                </div>
            </div>

            <!-- Questions -->
            <div v-for="(question, index) in quiz.questions" :key="index" class="bg-teal-100 p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Question {{ index + 1 }}</h3>
                <div class="space-y-4">
                    <div>
                        <label for="question" class="block text-sm font-medium text-black">Question</label>
                        <input id="question" v-model="question.questionHead" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                    <div v-for="(option, optIndex) in question.options" :key="optIndex">
                        <label class="block text-sm font-medium text-black">Option {{ optIndex + 1 }}</label>
                        <input v-model="question.options[optIndex]" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                    <div>
                        <label for="answer" class="block text-sm font-medium text-black">Correct Answer</label>
                        <input id="answer" v-model="question.correctAnswer" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-teal-300 shadow-md">
                    </div>
                </div>
            </div>

            <div class="flex justify-center m-2">
                <!-- Add Question Button -->
                <div class="mx-2 ">
                    <button type="button" @click="addQuestion" class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-400 hover:rounded-lg hover:cursor-pointer ">Add
                        Question</button>
                </div>
                <!-- Submit Button -->
                <div class="mx-2 ">
                    <button type="submit" class="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 hover:rounded-lg hover:cursor-pointer ">Submit Quiz</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            quiz: {
                title: '',
                duration: 10,
                numberOfQuestions: 10,
                description: '',
                  revealAnswers: 'yes',
                scorePerQuestion: 1,
                questions: [
                    {
                        questionHead: '',
                        options: ['', '', '', ''],
                        correctAnswer:''
                    }
                ]
            }
        };
    },
    methods: {
        addQuestion() {
            this.quiz.questions.push({
                questionHead: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
        },
        submitQuiz() {
            console.log('Quiz Submitted:', this.quiz);
            // Handle form submission
        }
    }
};
</script>

<style scoped></style>