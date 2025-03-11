<template>
    <div class="container mx-auto p-4">
        <form @submit.prevent="submitQuiz" class="space-y-6">
            <!-- Quiz Details -->
            <div class="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">
                    {{ isEditing ? 'Edit Quiz' : 'Create a New Quiz' }}
                </h2>
                <div class="space-y-5">
                    <div>
                        <label for="title" class="block text-sm font-medium text-black">Title</label>
                        <input id="title" v-model.trim="quiz.title" type="text"
                            class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
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
            </div>

            <!-- Questions -->
            <div v-for="(question, index) in quiz.questions" :key="index" class="bg-gray-100 p-6 rounded-lg shadow-md">
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

            <div class="flex justify-center m-2">
                <!-- Add Question Button -->
                <div class="mx-2">
                    <button type="button" @click="addQuestion"
                        class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-400 hover:cursor-pointer">Add
                        Question</button>
                </div>
                <!-- Submit Button -->
                <div class="mx-2">
                    <button type="submit"
                        class="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 hover:cursor-pointer">Submit
                        Quiz</button>
                </div>
            </div>
        </form>
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
    }
};
</script>

<style scoped></style>