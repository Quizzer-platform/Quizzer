<!-- <template>
  <div class="container mx-auto p-4">
      <form @submit.prevent="submitCategory" class="space-y-6">
          <div class="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-4">Create a New Category</h2>
              <div class="space-y-5">
                  <div>
                      <label for="title" class="block text-sm font-medium text-black">Title</label>
                      <input id="title" v-model.trim="category.title" type="text" class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
                  </div>
                  <div>
                      <label for="description" class="block text-sm font-medium text-black">Description</label>
                      <textarea id="description" rows="4" v-model.trim="category.description" class="mt-2 p-4 block w-full rounded-lg bg-gray-300 shadow-md" required></textarea>
                  </div>
                  <div>
                      <label for="title" class="block text-sm font-medium text-black">Icon</label>
                      <input id="title" v-model.trim="category.icon" type="text" class="mt-2 p-2 block w-full bg-gray-300 rounded-lg shadow-md" required>
                  </div>
                  <div class="mb-4">
                        <label class="block text-gray-700">Quizzes</label>
                        <select v-model="user.organization" class="w-full p-2 border rounded-lg">
                            <option value="guest">Guest User</option>
                            <option v-for="org in organizations" :key="org.id" :value="org.name">
                                {{ org.name }}
                            </option>
                        </select>
                    </div>
                 
              </div>
          </div>
          
          <div class="flex justify-center m-2">
              <button type="submit" class="bg-teal-600 cursor-pointer text-white p-3 rounded-lg hover:bg-teal-500 hover:cursor-pointer">Submit Category</button>
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
              icon:''
          },
      };
  },
 
  methods: {
    async fetchOrganizations() {
            try {
                const response = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json');
                const data = await response.json();
                if (data) {
                    this.organizations = Object.keys(data).map(id => ({
                        id,
                        ...data[id]
                    }));
                }
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        },
    submitCategory() {
         
          fetch('https://quizzer-platform-default-rtdb.firebaseio.com/categories.json', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.category)
          })
          .then(response => console.log('category saved:', response))
          .catch(error => console.error('Error:', error));
      }
  }
};
</script>

<style scoped></style> -->
<template>
    <div class="container mx-auto p-4">
      <form @submit.prevent="submitCategory" class="space-y-6">
        <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Create a New Category</h2>
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
  
            <!-- اختيار الكويزز -->
            <div>
              <label class="block text-sm font-medium text-black mb-1">Select Quizzes</label>
              <select 
  v-model="category.quizzes" 
  class="w-full p-2 border rounded-lg bg-gray-300 mt-1"
>
  <option 
    v-for="quiz in quizzes" 
    :key="quiz.id" 
    :value="quiz.id"
  >
    {{ quiz.title }}
  </option>
</select>

            </div>
          </div>
        </div>
  
        <div class="flex justify-center m-2">
          <button type="submit"
            class="bg-teal-600 cursor-pointer text-white p-3 rounded-lg hover:bg-teal-500 hover:cursor-pointer">
            Submit Category
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
          quizzes: [] // هنا بنخزن الـ quiz IDs
        },
        quizzes: [] // عشان نعرض الكويزز في الـ select
      };
    },
    mounted() {
      this.fetchQuizzes();
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
      async submitCategory() {
        try {
          const response = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/categories.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.category)
          });
  
          const result = await response.json();
          console.log('Category saved:', result);
          alert("Category created successfully!");
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped></style>
  