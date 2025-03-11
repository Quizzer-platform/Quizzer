<template>
    <div class="container mx-auto p-4">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Category' : 'Create a New Category' }}</h2>
          <div class="space-y-5">
            <div>
              <label for="title" class="block text-sm font-medium text-black">Title</label>
              <input id="title" v-model.trim="category.title" type="text"
                class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-black">Description</label>
              <textarea id="description" rows="4" v-model.trim="category.description"
                class="mt-2 p-4 block w-full rounded-lg bg-gray-300 shadow-md" required></textarea>
            </div>
            <div>
              <label for="icon" class="block text-sm font-medium text-black">Icon</label>
              <input id="icon" v-model.trim="category.icon" type="text"
                class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-black mb-1">Select Quizzes</label>
              <select v-model="category.quizzes" class="w-full p-2 border rounded-lg bg-gray-300 mt-1" multiple>
                <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                  {{ quiz.title }}
                </option>
              </select>
            </div>
          </div>
        </div>
  
        <div class="flex justify-center m-2">
          <button type="submit" class="bg-teal-600 cursor-pointer text-white p-3 rounded-lg hover:bg-teal-500">
            {{ isEditing ? 'Update Category' : 'Submit Category' }}
          </button>
        </div>
      </form>
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
            categoryId: null
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
                    alert(`Category ${this.isEditing ? 'updated' : 'created'} successfully!`);
                    this.$router.push('/admin/categories');
                } else {
                    throw new Error('Failed to save category');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to save category. Please try again.');
            }
        }
    }
};
</script>
  