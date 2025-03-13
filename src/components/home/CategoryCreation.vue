<template>
    <div class="container mx-auto p-6 max-w-4xl">
        <div class="flex items-center mb-6">
            <button 
                @click="$router.push('/admin')" 
                class="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 
                       px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-lg font-medium">Back to Categories</span>
            </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold text-gray-800 text-center">
                {{ isEditing ? 'Edit Category' : 'Create a New Category' }}
            </h2>

            <!-- Category Details -->
            <div class="space-y-6">
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" v-model.trim="category.title" type="text"
                        class="mt-2 p-3 w-full bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" rows="4" v-model.trim="category.description"
                        class="mt-2 p-3 w-full rounded-lg bg-gray-50 shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required></textarea>
                </div>

                <div>
                    <label for="icon" class="block text-sm font-medium text-gray-700">Icon (URL)</label>
                    <input id="icon" v-model.trim="category.icon" type="text"
                        class="mt-2 p-3 w-full bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Select Quizzes</label>
                    <select v-model="category.quizzes" class="w-full p-3 border rounded-lg bg-gray-50 shadow-sm focus:ring-teal-500 focus:border-teal-500 outline-none" multiple>
                        <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                            {{ quiz.title }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center gap-4">
                <button type="submit"
                    class="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-500 transition duration-300 shadow-md">
                    {{ isEditing ? 'Update Category' : 'Submit Category' }}
                </button>
            </div>
        </form>

        <!-- Success Popup -->
        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black/40">
            <div class="bg-white p-8 rounded-xl shadow-2xl text-center transform scale-95 transition-transform duration-300">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Category Saved Successfully!</h2>
                <p class="text-gray-600 mb-4">Your category has been successfully saved.</p>
                <button @click="redirectToCategories"
                    class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300">
                    OK
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            category: {
                title: '',
                description: '',
                icon: '',
                quizzes: []
            },
            quizzes: [],
            isEditing: false,
            categoryId: null,
            showPopup: false
        };
    },

    async created() {
        await this.fetchQuizzes();
        
        // Check if we're in edit mode
        const categoryId = this.$route.query.id;
        if (categoryId) {
            this.isEditing = true;
            this.categoryId = categoryId;
            await this.fetchCategoryData();
        }
    },

    methods: {
        async fetchQuizzes() {
            try {
                const response = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json');
                const data = await response.json();
                if (data) {
                    this.quizzes = Object.keys(data).map(id => ({
                        id,
                        ...data[id]
                    }));
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        },

        async fetchCategoryData() {
            try {
                const response = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/categories/${this.categoryId}.json`);
                const data = await response.json();
                if (data) {
                    this.category = {
                        title: data.title,
                        description: data.description,
                        icon: data.icon,
                        quizzes: data.quizzes || []
                    };
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        },

        async handleSubmit() {
            try {
                const url = `https://quizzer-platform-default-rtdb.firebaseio.com/categories/${this.isEditing ? this.categoryId : ''}.json`;
                const method = this.isEditing ? 'PATCH' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.category)
                });

                if (response.ok) {
                    this.showPopup = true;
                } else {
                    throw new Error('Failed to save category');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to save category. Please try again.');
            }
        },

        redirectToCategories() {
            this.showPopup = false;
            this.$router.push('/admin/categories'); // Redirect to categories page
        }
    }
};
</script>
