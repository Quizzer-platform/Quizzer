 <template>
  <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <!-- <QuizCard -->
      <!-- v-for="(card, index) in cards"
      :key="index"
      :icon="card.icon"
      :title="card.title"
      :description="card.description" -->
  
    <!-- :icon="card.icon" -->
     <!-- :title="card.title"
      :description="card.description" -->
    <div v-for="(card, index) in cards"
      :key="index" >
    <div class="bg-white p-6 rounded-xl shadow-lg m-2 w-64 text-center">
    <!-- Icon Section
    <div class="bg-teal-100 p-3 w-12 h-12 mx-auto rounded-md flex items-center justify-center">
      <span class="text-teal-700 text-lg font-semibold">{{ icon }}</span>
    </div> -->

  
    <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ card.title }}</h3>
    <p class="text-gray-600 mt-2 text-sm">
      {{ card.description }}
    </p> 

    <!-- Button -->
    <button 
      class="mt-4 bg-teal-700  text-white px-5 py-2 rounded-lg shadow-md w-full hover:bg-teal-900 transition">
      See More
    </button>
  </div></div>
  </div>
</template> 

<script> 
// import QuizCard from "../quiz/QuizCard.vue";

 export default {
  name: "Cards",
  // components: {
  //   QuizCard,
  // },
 data() {
    return {
      cards: [],
      
    }
  },
  methods: {
    loadQuizzes() {
            fetch('https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json', {})
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(data => {
                    console.log('Data:', data);
                    for (const id in data) {
                        this.cards.push({ title: data[id].title, description: data[id].description });
                    }

                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
        },
  },mounted() {
    // window.addEventListener("resize", this.handleResize);
    this.loadQuizzes();
  },
  props: 
  
   
    ["cards", "categoryTitle"]

  
};
</script> 

