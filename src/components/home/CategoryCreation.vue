<template>
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
                 
                 
              </div>
          </div>
          
          <div class="flex justify-center m-2">
              <button type="submit" class="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 hover:cursor-pointer">Submit Category</button>
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

<style scoped></style>
