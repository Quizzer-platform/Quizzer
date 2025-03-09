
<template>
    <div class="flex flex-col items-center md:w-full md:flex-row  md:items-start md:gap-4 max-w-6xl mx-auto p-6">
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
                <div class="bg-teal-200 m-2 p-4 rounded-xl shadow-md hover:bg-teal-100">&#10004;{{ category }}</div>
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
    };
  },

  methods: {
    goToQuiz(quizId) {
      if (quizId) {
        console.log("Navigating to quiz with ID:", quizId);
        this.$router.push({ name: "quizlist", params: { quizId } });
      } else {
        console.error("Error: quizId is undefined!");
      }
    },

    testQuizId() {
      console.log("Current Quiz Object:", this.quiz);
      if (this.quiz.id) {
        this.goToQuiz(this.quiz.id);
      } else {
        console.error("Error: quiz.id is undefined!");
      }
    },

    loadQuizDetails() {
      const quizId = this.$route.params.quizId;
      console.log("Quiz ID from route:", quizId);
      if (!quizId) return;

      fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/quizData/${quizId}.json`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            this.quiz = { ...data, id: quizId }; // ✅ احتفظ بالـ id داخل الكائن
            this.QuizName = data.title;
            this.QuizDescribtion = data.description;
            this.category = data.category;
          }
          console.log("Loaded Quiz Data:", this.quiz);
        })
        .catch(error => {
          console.error("Error loading quiz details:", error);
        });
    },
  },

  mounted() {
    this.loadQuizDetails();
  },
};
</script>

