<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#151a24]">
        <div
            class="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <p class="text-md text-red-500 dark:text-red-600 mb-6 text-center">
                {{ error }}
            </p>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-teal-500 mb-2 text-center">Enter Quiz Code</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                Please enter the code provided to access the quiz.
            </p>

            <input v-model="quizCode" type="text" placeholder="Enter quiz code..." class="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg shadow-sm 
               bg-white dark:bg-gray-700 dark:text-white 
               focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200" />

            <button @click="updateURL" class="mt-6 w-full bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold 
               hover:bg-teal-500 transition-all duration-300 shadow-md dark:bg-teal-700 dark:hover:bg-teal-600 cursor-pointer">
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
            error: "",
        };
    },
    methods: {
        updateURL() {
            if (this.quizCode) {
                this.$router.push(`/quizzes/${this.quizCode}`);
            }
            else {
                this.error = "Please enter a valid quiz code.";
            }
        },
    },
};
</script>
