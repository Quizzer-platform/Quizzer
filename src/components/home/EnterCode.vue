<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-teal-600">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Enter Quiz Code</h2>
      
      <input 
        v-model="quizCode" 
        type="text" 
        placeholder="Enter quiz code..." 
        class="border p-2 rounded-lg w-full mb-4"
      />
      
      <button 
        @click="updateURL" 
        class="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 cursor-pointer"
      >
        OK
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
  computed: {
    currentUrl() {
      return window.location.href;  
    },
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
