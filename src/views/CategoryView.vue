<template>
    <Navbar />
    <search />
    <div class="flex justify-center">
    <CategriesCards :categories="categories" />
    </div>
    <Footer />
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import CategriesCards from "../components/home/CategriesCards.vue";
import search from "../components/layout/Searchbar.vue";

export default {
    components: {
      CategriesCards,
        Navbar,
        Footer,
        search
    },

  data() {
    return {
    
      categories: [  
      ]
    };
  },


methods: {
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json", {})
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(data => {
                    console.log('Data:', data);
                    for (const id in data) {
                        this.categories.push({ icon:data[id].icon, title: data[id].title, description: data[id].description });
                    }
                    
                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
        },

    },
    mounted() {
        this.loadCategories();
    },



}
</script>

    