<template>
    <Navbar />
    <search class="" @search="updateSearchQuery" />
    <div class="flex flex-col justify-center items-center">
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading quizzes...</p>
        </div>
        <div v-else-if="filteredQuizzes.length === 0" class="text-center text-gray-500 my-20">
          No quizzes found.
        </div>
        <Quizzes v-else :cards="filteredQuizzes" />
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
            loading: true,
            searchQuery: "",
        };
    },
    computed: {
        filteredQuizzes() {
            if (!this.searchQuery) return this.cards;
            return this.cards.filter(quiz =>
                quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                quiz.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    methods: {
        loadQuizzes() {
            this.loading = true;
            fetch('https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json')
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
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
    },
    mounted() {
        this.loadQuizzes();
    }
}
</script>
