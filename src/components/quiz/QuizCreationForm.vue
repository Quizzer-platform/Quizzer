<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a202c] p-6">
        <div class="container mx-auto max-w-4xl">
            <div class="flex items-center mb-6">
                <button @click="$router.push('/admin')"
                    class="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span class="text-lg font-medium cursor-pointer">Back to Dashboard</span>
                </button>
            </div>

            <form @submit.prevent="submitQuiz"
                class="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg transition-all duration-300">
                <h2 class="text-3xl font-bold text-gray-800 dark:text-teal-300 text-center">
                    {{ isEditing ? 'Edit Quiz' : 'Create a New Quiz' }}
                </h2>

                <!-- Quiz Details -->
                <div class="space-y-6">
                    <div>
                        <label for="title"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input id="title" v-model.trim="quiz.title" type="text"
                            class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            required>
                    </div>

                    <div>
                        <label for="description"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" rows="4" v-model.trim="quiz.description"
                            class="mt-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            required></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="duration"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (in
                                minutes)</label>
                            <input id="duration" v-model="quiz.duration" type="number"
                                class="mt-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required>
                        </div>
                        <div>
                            <label for="numberOfQuestions"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of
                                Questions</label>
                            <input id="numberOfQuestions" v-model="quiz.numberOfQuestions" type="number"
                                class="mt-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required>
                        </div>
                    </div>

                    <div>
                        <label for="scorePerQuestion"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Score per
                            Question</label>
                        <input id="scorePerQuestion" v-model="quiz.scorePerQuestion" type="number"
                            class="mt-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select
                            Category</label>
                        <select v-model="quiz.category"
                            class="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            >
                            <option v-for="category in categories" :key="category.id" :value="category.id" class="my-2">
                                {{ category.title }}
                            </option>
                        </select>
                    </div>

                </div>

                <!-- Questions -->
                <div v-for="(question, index) in quiz.questions" :key="index"
                    class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Question {{ index + 1 }}</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                            <input v-model.trim="question.questionHead" type="text"
                                class="mt-2 p-3 w-full rounded-lg bg-white dark:bg-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required>
                        </div>
                        <div v-for="(option, optIndex) in question.options" :key="optIndex">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Option {{ optIndex
                                + 1 }}</label>
                            <input v-model.trim="question.options[optIndex]" type="text"
                                class="mt-2 p-3 w-full rounded-lg bg-white dark:bg-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correct
                                Answer</label>
                            <input v-model.trim="question.correctAnswer" type="text"
                                class="mt-2 p-3 w-full rounded-lg bg-white dark:bg-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                required>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center gap-4">
                    <button type="button" @click="addQuestion"
                        class="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-500 transition duration-300 shadow-md cursor-pointer">
                        Add Question
                    </button>
                    <button type="submit"
                        class="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-500 transition duration-300 shadow-md cursor-pointer">
                        Submit Quiz
                    </button>
                </div>
            </form>

            <!-- Success Popup -->
            <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black/40">
                <div
                    class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl text-center transform scale-95 transition-transform duration-300">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-teal-300 mb-4">
                        🎉 {{ isEditing ? 'Quiz Updated Successfully!' : 'Quiz Created Successfully!' }}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Your quiz has been successfully {{ isEditing ? 'updated' : 'saved' }}.
                    </p>
                    <button @click="redirectToDashboard"
                        class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300 cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
            <div v-if="showcategoryRequied"
                class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
                <div
                    class="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h3 class="text-lg sm:text-xl font-semibold text-red-600">Plaese select a category</h3>
                    <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                        You cannot create quiz before you add it to category.
                    </p>
                    <p>
                        please add your quiz to one category
                    </p>
                    <button @click="showcategoryRequied = false"
                        class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            quiz: {
                title: '',
                duration: 10,
                numberOfQuestions: 1,
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
            quizId: null,
            showPopup: false,
            showcategoryRequied: false,
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
            this.quiz.numberOfQuestions += 1;
            this.quiz.questions.push({
                questionHead: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
        },
        submitQuiz() {
            if (this.quiz.category=="") {
                this.showcategoryRequied = true;
                return;
            }

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
                    const quizId = this.isEditing ? this.quizId : data.name;
                    this.updateCategoryQuizzes(quizId);
                    if (!this.isEditing) {
                        this.resetForm();
                    }
                    this.showPopup = true; // Show the popup after saving
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
                numberOfQuestions: 1,
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
        redirectToDashboard() {
            this.showPopup = false;
            this.$router.push('/admin'); // Redirect to admin dashboard
        },
        updateCategoryQuizzes(quizId) {
            const categoryId = this.quiz.category;
            const categoryUrl = `https://quizzer-platform-default-rtdb.firebaseio.com/categories/${categoryId}.json`;
            
            fetch(categoryUrl)
                .then(response => response.json())
                .then(categoryData => {
                    const quizzes = categoryData.quizzes || [];
                    if (!quizzes.includes(quizId)) {
                        quizzes.push(quizId);
                        return fetch(categoryUrl, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ quizzes })
                        });
                    }
                })
                .catch(error => console.error('Error updating category:', error));
        }
    }
};
</script>

