<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 class="text-2xl font-semibold text-gray-800 mb-2 text-center">Enter Quiz Code</h2>
      <p class="text-sm text-gray-500 mb-6 text-center">Please enter the code provided to access the quiz.</p>

      <input 
        v-model="quizCode" 
        type="text" 
        placeholder="Enter quiz code..." 
        class="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200"
      />
      
      <button 
        @click="updateURL" 
        class="mt-6 w-full bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-300 shadow-md"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quizCode: this.$route.params.code || "", 
    };
  },
  methods: {
    updateURL() {
      if (this.quizCode) {
        this.$router.push(`/quizzes/${this.quizCode}`); 
      }
    },
  },
};
</script>
