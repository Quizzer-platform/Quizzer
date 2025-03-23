<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a202c] p-6">
    <div class="container mx-auto max-w-4xl">
      <div class="flex items-center mb-6">
        <button 
          @click="$router.push('/admin/categories')" 
          class="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg cursor-pointer shadow-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-lg font-medium">Back to Categories</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" 
        class="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg transition-all duration-300"
      >
        <h2 class="text-3xl font-bold text-gray-800 dark:text-teal-300 text-center">
          {{ isEditing ? 'Edit Category' : 'Create a New Category' }}
        </h2>

        <!-- Category Details -->
        <div class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input id="title" v-model.trim="category.title" type="text"
              class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="description" rows="4" v-model.trim="category.description"
              class="mt-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none" required></textarea>
          </div>

          <div>
            <label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Icon</label>
            <select id="icon" v-model="category.icon"
              class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none" required>
              <option value="" disabled>Choose an icon</option>
              <option v-for="icon in icons" :key="icon.value" :value="icon.value">
                {{ icon.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selected Icon Preview</label>
            <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
              <div v-if="category.icon" class="flex items-center justify-center">
                <img :src="category.icon" alt="Selected icon" class="w-12 h-12">
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No icon selected</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Quizzes</label>
            <select v-model="category.quizzes" 
              class="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white shadow-sm border-gray-300 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              multiple>
              <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id" class="my-2">
                {{ quiz.title }}
              </option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center gap-4">
          <button type="submit"
            class="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-500 cursor-pointer transition duration-300 shadow-md">
            {{ isEditing ? 'Update Category' : 'Submit Category' }}
          </button>
        </div>
      </form>

      <!-- Success Popup -->
      <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black/40">
        <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl text-center transform scale-95 transition-transform duration-300">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-teal-300 mb-4">🎉 Category Saved Successfully!</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Your category has been successfully saved.</p>
          <button @click="redirectToCategories"
            class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300 cursor-pointer">
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
            icons: [
                { label: 'Books Icon', value: '../src/assets/icons8-books-100.png' },
                { label: 'Bot Icon', value: '../src/assets/icons8-bot-100.png' },
                { label: 'Language Icon', value: '../src/assets/icons8-language-100.png' },
                { label: 'Math Icon', value: '../src/assets/icons8-math-100.png' },
                { label: 'Microscope Icon', value: '../src/assets/icons8-microscope-100.png' },
                { label: 'Physics Icon', value: '../src/assets/icons8-physics-100.png' },
                { label: 'Programming Icon', value: '../src/assets/icons8-programming-100.png' },
                { label: 'Technology Icon', value: '../src/assets/icons8-technology-100.png' },
                { label: 'Cloud connection Icon', value: '../src/assets/icons8-cloud-connection-100.png' },
                { label: 'Cloud development Icon', value: '../src/assets/icons8-cloud-development-100.png' },
            ],
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
