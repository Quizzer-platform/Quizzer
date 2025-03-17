<template>
    <div class="relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16">
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] 
                  bg-gradient-to-tr from-teal-100 to-teal-200 opacity-40 
                  sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 
                                     85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 
                                     60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 
                                     45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 
                                     17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 
                                     74.1% 44.1%);">
            </div>
        </div>

        <Navbar></Navbar>

        <div class="flex items-center justify-center min-h-[80vh] px-4 py-10  sm:m-0">
            <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <div class="text-green-600">
                    <svg class="w-16 h-16 mx-auto animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" class="stroke-green-600 fill-transparent"></circle>
                        <path d="M9 12l2 2 4-4" class="stroke-green-600"></path>
                    </svg>
                </div>


                <h2 class="text-2xl font-semibold text-gray-900 mt-4">Payment Successful! 🎉</h2>
                <p class="text-gray-600 mt-2">Thank you for your purchase. Your subscription is now active!</p>

                <!-- Plan Details -->
                <div v-if="plan" class="bg-teal-50 border border-teal-300 rounded-lg p-4 mt-6 text-left">
                    <h3 class="text-lg font-semibold text-teal-700">Plan Details</h3>
                    <p class="text-gray-700 mt-1"><strong>Name:</strong> {{ plan.name }}</p>
                    <p class="text-gray-700 mt-1"><strong>Price:</strong> {{ plan.price }}</p>
                    <p class="text-gray-700 mt-1"><strong>Quizzes Included:</strong> {{ plan.noOfQuizzes }}</p>
                    <p class="text-gray-700 mt-1"><strong>Description:</strong> {{ plan.description }}</p>
                </div>

                <!-- Back to Dashboard -->
                <button
                    class="w-full mt-6 bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition-all duration-300"
                    @click="$router.push('/organization')">
                    Go to Dashboard
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "../layout/Navbar.vue";

export default {
    components: { Navbar },
    data() {
        return {
            plan: null,
        };
    },
    created() {
        // ✅ Retrieve the plan details from query parameters
        this.plan = {
            name: this.$route.query.name || "No Plan Selected",
            price: this.$route.query.price || "N/A",
            description: this.$route.query.description || "",
            noOfQuizzes: this.$route.query.noOfQuizzes || "N/A",
        };
    },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>