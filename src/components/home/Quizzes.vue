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
                { icon: "📚", title: "HTML", description: "Explore a variety of educational resources." },
                { icon: "💻", title: "CSS", description: "Stay updated with the latest tech trends." },
                { icon: "🎨", title: "JS", description: "Discover creative design inspirations." },
                { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
                { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
                { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
                { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
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
    }
}
</script>