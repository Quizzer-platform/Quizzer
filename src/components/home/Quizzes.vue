<template>
    <Navbar />
    <search />
    <div class="flex justify-center">
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading quizzes...</p>
        </div>
        <Quizzes v-else :cards="cards" />
    </div>
    <Footer />
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import Quizzes from "./QuizzesCards.vue";
import search from "../layout/Searchbar.vue";

export default {
    components: {
        Quizzes,
        Navbar,
        Footer,
        search
    },
    data() {
        return {
            cards: [],
            loading: true
        };
    },
    methods: {
        loadQuizzes() {
            this.loading = true;
            fetch('https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json')
                .then(response => response.json())
                .then(data => {
                    this.cards = Object.keys(data).map(id => ({
                        id, 
                        title: data[id].title,
                        description: data[id].description
                    }));
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    mounted() {
        this.loadQuizzes();
    }
}
</script>
