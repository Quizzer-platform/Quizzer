<template>
    <Navbar />
    <search />
    <div class="flex justify-center">
    <Quizzes :cards="cards" />
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
            cards: [
                // { icon: "📚", title: "HTML", description: "Explore a variety of educational resources." },
                // { icon: "💻", title: "CSS", description: "Stay updated with the latest tech trends." },
                // { icon: "🎨", title: "JS", description: "Discover creative design inspirations." },
                // { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
                // { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
                // { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
                // { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
                // { icon: "💻", title: "Technology", description: "Stay updated with the latest tech trends." },
                // { icon: "🎨", title: "Design", description: "Discover creative design inspirations." },
                // { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
                // { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
                // { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
                // { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
                // { icon: "💻", title: "Technology", description: "Stay updated with the latest tech trends." },
                // { icon: "🎨", title: "Design", description: "Discover creative design inspirations." },
                // { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
                // { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
                // { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
            ]
        };
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
                        this.cards.push({ icon: "📚", title: data[id].title, description: data[id].description });
                    }
                    
                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
        },

    },
    mounted() {
        this.loadQuizzes();
    },
}
</script>