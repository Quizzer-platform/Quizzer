
<template>
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading quiz details...</p>
        </div>
    </div>

    <div v-else class="flex flex-col items-center md:w-full md:flex-row md:items-start md:gap-4 max-w-6xl mx-auto p-6">
        <div class="flex flex-col my-4 p-4 rounded-xl shadow-md bg-gray-100 md:w-[50%] ">
            <div class="flex flex-col items-start bg-gray-100 p-4 rounded-xl shadow-md md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 m-2">{{ QuizName }}</h2>
                </div>
                <div>
                    <button @click="testQuizId" class="bg-teal-700 text-white px-4 py-2 m-2 rounded-lg hover:bg-teal-500 cursor-pointer">
                        Get Start
                    </button>
                </div>
            </div>
            <div class="flex flex-col mt-4 font-semibold m-2 p-4 rounded-xl w-fit">
                <div class="bg-teal-200 m-2 p-4 rounded-xl shadow-md hover:bg-teal-100">
                    &#10004; {{ categoryTitle || 'Category not found' }}
                </div>
                <div class="bg-red-200 m-2 p-4 rounded-xl shadow-md hover:bg-red-100">&#10004; 10 min </div>
                <div class="bg-orange-200 m-2 p-4 rounded-xl shadow-md hover:bg-orange-100">&#10004; low</div>
            </div>
        </div>
        <div class="md:w-[50%]">
            <div class="p-4 rounded-xl shadow-md md:w-full">
                <div class="p-4 bg-gray-100 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Summary of the {{ QuizName }} test</h3>
                    <p class="mt-2">{{ QuizDescribtion }}</p>
                </div>
            </div>
            <div class="mt-4 space-y-2 md:w-full">
                <details class="bg-gray-100 p-4 rounded-lg">
                    <summary class="font-semibold cursor-pointer">About this test</summary>
                    <p class="mt-2">This test is designed to assess your proficiency in {{ QuizName }} concepts.</p>
                </details>
                <details class="bg-gray-100 p-4 rounded-lg">
                    <summary class="font-semibold cursor-pointer">Who Created it</summary>
                    <p class="mt-2">Industry experts and professionals created this test.</p>
                </details>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            quiz: {},
            QuizName: "",
            QuizDescribtion: "",
            category: "",
            categoryTitle: "",
            loading: true
        };
    },

    methods: {
        async loadQuizDetails() {
            const quizId = this.$route.params.quizId;
            if (!quizId) {
                this.loading = false;
                return;
            }

            try {
                const quizResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/quizData/${quizId}.json`);
                const quizData = await quizResponse.json();

                if (quizData) {
                    this.quiz = { ...quizData, id: quizId };
                    this.QuizName = quizData.title;
                    this.QuizDescribtion = quizData.description;
                    this.category = quizData.category;

                    const categoryResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/categories/${quizData.category}.json`);
                    const categoryData = await categoryResponse.json();
                    
                    if (categoryData) {
                        this.categoryTitle = categoryData.title;
                    }
                }
            } catch (error) {
                console.error("Error loading quiz details:", error);
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadQuizDetails();
    }
};
</script>

