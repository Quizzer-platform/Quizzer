<template>
    <div class="container mx-auto p-6 max-w-4xl">
        <div class="flex items-center mb-6">
            <button 
                @click="$router.push('/organization')" 
                class="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 
                       px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-lg font-medium">Back to Dashboard</span>
            </button>
        </div>

        <form @submit.prevent="submitQuiz" class="space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold text-gray-800 text-center">
                {{ isEditing ? 'Edit Quiz' : 'Create a New Quiz' }}
            </h2>

            <!-- Quiz Details -->
            <div class="space-y-6">
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" v-model.trim="quiz.title" type="text"
                        class="mt-2 p-3 w-full bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" rows="4" v-model.trim="quiz.description"
                        class="mt-2 p-3 w-full rounded-lg bg-gray-50 shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="duration" class="block text-sm font-medium text-gray-700">Duration (in minutes)</label>
                        <input id="duration" v-model="quiz.duration" type="number"
                            class="mt-2 p-3 w-full rounded-lg bg-gray-50 shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                    <div>
                        <label for="numberOfQuestions" class="block text-sm font-medium text-gray-700">Number of Questions</label>
                        <input id="numberOfQuestions" v-model="quiz.numberOfQuestions" type="number"
                            class="mt-2 p-3 w-full rounded-lg bg-gray-50 shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="scorePerQuestion" class="block text-sm font-medium text-gray-700">Score per Question</label>
                        <input id="scorePerQuestion" v-model="quiz.scorePerQuestion" type="number"
                            class="mt-2 p-3 w-full rounded-lg bg-gray-50 shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                </div>
            </div>

            <!-- Questions -->
            <div v-for="(question, index) in quiz.questions" :key="index" class="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Question {{ index + 1 }}</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Question</label>
                        <input v-model.trim="question.questionHead" type="text"
                            class="mt-2 p-3 w-full rounded-lg bg-white shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                    <div v-for="(option, optIndex) in question.options" :key="optIndex">
                        <label class="block text-sm font-medium text-gray-700">Option {{ optIndex + 1 }}</label>
                        <input v-model.trim="question.options[optIndex]" type="text"
                            class="mt-2 p-3 w-full rounded-lg bg-white shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Correct Answer</label>
                        <input v-model.trim="question.correctAnswer" type="text"
                            class="mt-2 p-3 w-full rounded-lg bg-white shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                    </div>
                </div>
            </div>

            <div class="flex justify-center gap-4">
                <button type="button" @click="addQuestion"
                    class="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-500 transition duration-300 shadow-md">
                    Add Question
                </button>
                <button type="submit"
                    class="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-500 transition duration-300 shadow-md">
                    Submit Quiz
                </button>
            </div>
        </form>

        <!-- Elegant Popup -->
        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black/40">
            <div class="bg-white p-8 rounded-xl shadow-2xl text-center transform scale-95 transition-transform duration-300">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Quiz Created Successfully!</h2>
                <p class="text-gray-600 mb-4">Your quiz has been successfully saved.</p>
                <button @click="redirectToDashboard"
                    class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300">
                    OK
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth } from 'firebase/auth';

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
            },
            isEditing: false,
            quizId: null,
            showPopup: false,
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
    methods: {
        addQuestion() {
            this.quiz.questions.push({
                questionHead: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
        },
        fetchQuiz(quizId) {
            fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${quizId}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        this.quiz = data;
                    }
                })
                .catch(error => console.error('Error fetching quiz:', error));
        },
        async submitQuiz() {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            const organizationUid = user.uid; // The UID of the logged-in organization
            const updatedQuiz = { ...this.quiz, organizationUid };

            // Determine Firebase URL and HTTP method
            const url = this.isEditing
                ? `https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${this.quizId}.json`
                : `https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json`;
            const method = this.isEditing ? 'PATCH' : 'POST';

            try {
                this.showPopup = true;
                // Send quiz data to Firebase
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedQuiz),
                });
                const responseData = await response.json();

                if (!this.isEditing) {
                    await this.incrementOrganizationQuizzes(organizationUid);
                }
                console.log(`Quiz ${this.isEditing ? 'Updated' : 'Created'} successfully`);
            } catch (error) {
                console.error(`Error ${this.isEditing ? 'updating' : 'creating'} quiz:`, error);
            }
        },

        async incrementOrganizationQuizzes(organizationUid) {
            try {
                // Step 1: Find the organization with the matching adminUid
                const orgsUrl = `https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json`;
                const response = await fetch(orgsUrl);
                const orgsData = await response.json();

                let organizationKey = null;
                let currentQuizCount = 0;

                // Loop through organizations to find the one matching adminUid
                for (const key in orgsData) {
                    if (orgsData[key].adminUid === organizationUid) {
                        organizationKey = key;
                        currentQuizCount = orgsData[key].quizzes || 0; // Default to 0
                        break;
                    }
                }

                if (!organizationKey) {
                    console.error("Organization not found for this admin UID!");
                    return;
                }

                const updatedQuizCount = currentQuizCount + 1; // Increment count
                const updateUrl = `https://quizzer-platform-default-rtdb.firebaseio.com/organizations/${organizationKey}.json`;

                // Step 2: Update the quiz count in Firebase
                await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quizzes: updatedQuizCount }),
                });

                console.log(`Organization's quiz count updated to: ${updatedQuizCount}`);
            } catch (error) {
                console.error('Error updating organization quiz count:', error);
            }
        },

        async updateOrganizationQuizzes(organizationId, quizId) {
            try {
                const orgUrl = `https://quizzer-platform-default-rtdb.firebaseio.com/organizations/${organizationId}/quizzes.json`;

                // Fetch the current quizzes list
                const response = await fetch(orgUrl);
                let quizzes = await response.json();
                quizzes = quizzes ? quizzes : []; // Ensure it's an array

                // Add the new quiz ID
                quizzes.push(quizId);

                // Update Firebase with the new list
                await fetch(orgUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(quizzes),
                });

                console.log('Organization quizzes updated successfully:', quizzes);
            } catch (error) {
                console.error('Error updating organization quizzes:', error);
            }
        },
        redirectToDashboard() {
    this.showPopup = false;
    this.$router.push('/organization'); // Redirect back to the dashboard
},
    }
};
</script>

<style scoped></style>