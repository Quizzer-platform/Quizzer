<!-- <template>
    <div class="container mx-auto p-4">
        <form @submit.prevent="submitQuiz" class="space-y-6"> -->
            <!-- Quiz Details -->
            <!-- <div class="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Create a New Quiz</h2>
                <div class="space-y-5">
                    <div>
                        <label for="title" class="block text-sm font-medium text-black">Title</label>
                        <input id="title" v-model.trim="quiz.title" type="text"
                            class="mt-2 p-2 block w-full bg-gray-300 rounded-lg  shadow-md" required>
                    </div>
                    <div>
                        <label for="description" class="block text-sm font-medium text-black">Description</label>
                        <textarea id="description" rows="4" v-model.trim="quiz.description"
                            class="mt-2 p-4 block w-full rounded-lg bg-gray-300 shadow-md" required></textarea>
                    </div>
                    <div class="md:w-1/2">
                        <label for="duration" class="block text-sm font-medium text-black">Duration (in minutes)</label>
                        <input id="duration" v-model="quiz.duration" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div class="md:w-1/2">
                        <label for="numberOfQuestions" class="block text-sm font-medium text-black">Number of
                            Questions</label>
                        <input id="numberOfQuestions" v-model="quiz.numberOfQuestions" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div class="md:w-1/2">
                        <label class="block text-sm font-medium text-black">Reveal answers after quiz</label>
                        <select v-model="quiz.revealAnswers"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div class="md:w-1/2">
                        <label for="scorePerQuestion" class="block text-sm font-medium text-black">Score per
                            Question</label>
                        <input id="scorePerQuestion" v-model="quiz.scorePerQuestion" type="number"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                </div>
            </div> -->

            <!-- Questions -->
            <!-- <div v-for="(question, index) in quiz.questions" :key="index" class="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Question {{ index + 1 }}</h3>
                <div class="space-y-4">
                    <div>
                        <label for="question" class="block text-sm font-medium text-black">Question</label>
                        <input id="question" v-model.trim="question.questionHead" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div v-for="(option, optIndex) in question.options" :key="optIndex">
                        <label class="block text-sm font-medium text-black">Option {{ optIndex + 1 }}</label>
                        <input v-model.trim="question.options[optIndex]" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div>
                        <label for="answer" class="block text-sm font-medium text-black">Correct Answer</label>
                        <input id="answer" v-model.trim="question.correctAnswer" type="text"
                            class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                </div>
            </div>

            <div class="flex justify-center m-2"> -->
                <!-- Add Question Button -->
                <!-- <div class="mx-2 ">
                    <button type="button" @click="addQuestion"
                        class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-400 hover:rounded-lg hover:cursor-pointer ">Add
                        Question</button>
                </div> -->
                <!-- Submit Button -->
                <!-- <div class="mx-2 ">
                    <button type="submit"
                        class="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 hover:rounded-lg hover:cursor-pointer ">Submit
                        Quiz</button>
                </div>
            </div>
        </form>
    </div>
</template> -->

<!-- <script>
export default {
    data() {
        return {
            quiz: {
                title: '',
                duration: 10,
                numberOfQuestions: 10,
                description: '',
                revealAnswers: 'no',
                scorePerQuestion: 1,
                questions: [
                    {
                        questionHead: '',
                        options: ['', '', '', ''],
                        correctAnswer: ''
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
            fetch('https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.quiz)
            })
            .then(response => {
                console.log('Response:', response);
            }).catch(error => {
                console.error('Error:', error);
            });
        }
    }
};
</script>

<style scoped></style> -->
<template>
    <div class="container mx-auto p-4">
        <form @submit.prevent="submitQuiz" class="space-y-6">
            <div class="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">
                    {{ isEditing ? 'Edit Quiz' : 'Create a New Quiz' }}
                </h2>
                <div class="space-y-5">
                    <div>
                        <label for="title" class="block text-sm font-medium text-black">Title</label>
                        <input id="title" v-model.trim="quiz.title" type="text" class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
                    </div>
                    <div>
                        <label for="description" class="block text-sm font-medium text-black">Description</label>
                        <textarea id="description" rows="4" v-model.trim="quiz.description" class="mt-2 p-4 block w-full rounded-lg bg-gray-300 shadow-md" required></textarea>
                    </div>
                    <div class="md:w-1/2">
                        <label for="duration" class="block text-sm font-medium text-black">Duration (in minutes)</label>
                        <input id="duration" v-model="quiz.duration" type="number" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div class="md:w-1/2">
                        <label for="numberOfQuestions" class="block text-sm font-medium text-black">Number of Questions</label>
                        <input id="numberOfQuestions" v-model="quiz.numberOfQuestions" type="number" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div class="md:w-1/2">
                        <label for="scorePerQuestion" class="block text-sm font-medium text-black">Score per Question</label>
                        <input id="scorePerQuestion" v-model="quiz.scorePerQuestion" type="number" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div class="md:w-1/2">
                        <label for="category" class="block text-sm font-medium text-black">Category</label>
                        <select id="category" v-model="quiz.category" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md">
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.title }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-for="(question, index) in quiz.questions" :key="index" class="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">Question {{ index + 1 }}</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-black">Question</label>
                        <input v-model.trim="question.questionHead" type="text" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div v-for="(option, optIndex) in question.options" :key="optIndex">
                        <label class="block text-sm font-medium text-black">Option {{ optIndex + 1 }}</label>
                        <input v-model.trim="question.options[optIndex]" type="text" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-black">Correct Answer</label>
                        <input v-model.trim="question.correctAnswer" type="text" class="mt-2 p-2 block w-full rounded-lg bg-gray-300 shadow-md" required>
                    </div>
                </div>
            </div>
            <div class="flex justify-center m-2">
                <button type="button" @click="addQuestion" class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-400 hover:cursor-pointer">Add Question</button>
                <button type="submit" class="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 hover:cursor-pointer">Submit Quiz</button>
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
                category: '',
                questions: [{
                    questionHead: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                }]
            },
            categories: [],
            isEditing: false,
            quizId: null
        };
    },
    created() {
        const quizId = this.$route.params.quizId;
        if (quizId) {
            this.isEditing = true;
            this.quizId = quizId;
            this.fetchQuiz(quizId);
        }
    },
    mounted() {
        this.loadCategories();
    },
    methods: {
        fetchQuiz(quizId) {
            const path = `adminQuizzes/${quizId}`; // Always fetch from adminQuizzes
            fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/${path}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        this.quiz = data;
                    }
                })
                .catch(error => console.error('Error fetching quiz:', error));
        },
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
                .then(response => response.json())
                .then(data => {
                    this.categories = Object.keys(data).map(id => ({ id, title: data[id].title }));
                })
                .catch(error => console.error("Error:", error));
        },
        addQuestion() {
            this.quiz.questions.push({
                questionHead: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
        },
        submitQuiz() {
            if (!this.quiz.category) {
                alert("Please select a category!");
                return;
            }

            // Always save under adminQuizzes
            const basePath = "adminQuizzes";

            let url;
            let method;

            if (this.isEditing) {
                if (!this.quizId) {
                    console.error("Quiz ID is missing for editing.");
                    alert("An error occurred. Quiz ID is missing.");
                    return;
                }
                url = `https://quizzer-platform-default-rtdb.firebaseio.com/${basePath}/${this.quizId}.json`;
                method = "PUT";
            } else {
                url = `https://quizzer-platform-default-rtdb.firebaseio.com/${basePath}.json`;
                method = "POST";
            }

            fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.quiz),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Quiz Saved:", data);
                    alert("Quiz saved successfully!");
                    if (!this.isEditing) {
                        this.resetForm();
                        this.$router.push("/admin/quizzes");
                    }
                })
                .catch((error) => {
                    console.error("Error saving quiz:", error);
                    alert("An error occurred while saving the quiz. Please try again.");
                });
        },
        resetForm() {
            this.quiz = {
                title: "",
                duration: 10,
                numberOfQuestions: 10,
                description: "",
                category: "",
                questions: [
                    {
                        questionHead: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                    },
                ],
            };
        },
    }
};
</script>

<style scoped></style>
<style scoped></style>
