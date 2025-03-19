<template>
<Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>
<div class="flex justify-center py-2 pt-20 bg-white dark:bg-[#1a202c] flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 w-full">
     
        <search class="w-full" v-if="showCategories"  @search="updateSearchQuery" />   
    </div>
<div :class="showCategories ? 'min-h-screen' : 'min-h-0'"
class="flex justify-center items-center bg-white text-gray-900 dark:bg-[#1a202c] dark:text-white">
        <!-- Loading State -->
        <div v-if="loading || loadingQuizzes" class="text-center py-8 min-h-screen">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">{{ loading ? 'Loading categories...' : 'Loading quizzes...' }}</p>
        </div>

        <div v-else-if="filteredCategories.length === 0" class="text-center text-gray-500 my-20">
          No Categories found.
        </div>

        <!-- Categories View -->
        <CategriesCards v-else-if="showCategories" :categories="filteredCategories" @view-quizzes="viewCategoryQuizzes" />

        <!-- Quizzes View -->
    <!-- Quizzes View -->
<div v-else class="container mx-auto px-4 lg:px-4">
    <!-- Back Button & Search Bar Container -->
<div class="flex flex-wrap items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">

    <!-- Back Button -->
    <button @click="showCategories = true"
        class="flex items-center cursor-pointer gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md 
               hover:bg-teal-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500">
        Back to Categories
    </button>

    <!-- Search Bar -->
    <div class="relative w-full sm:w-80">
        <search v-model="searchQuery" class="w-full" />
    </div>

</div>

    <!-- Quizzes Section -->
    <div class="flex flex-col justify-center items-center">
        <QuizesCards v-if="selectedCategoryQuizzes.length" :cards="selectedCategoryQuizzes"
            :categoryTitle="selectedCategoryTitle" />
        <div v-else-if="!loadingQuizzes" class="text-center py-8">
            <p class="text-gray-600">No quizzes found in this category.</p>
        </div>
    </div>
</div>


    </div>

    <Footer />
</template>

<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import CategriesCards from "../components/home/CategriesCards.vue";
import search from "../components/layout/Searchbar.vue";
import QuizesCards from "../components/home/QuizzesCards.vue";

export default {
    components: { CategriesCards, QuizesCards, Navbar, Footer, search },
    data() {
        return {
            categories: [],
            selectedCategoryQuizzes: [],
            selectedCategoryTitle: '',
            loading: true,
            loadingQuizzes: false,
            showCategories: true,
            searchQuery: "",
        };
    },
    mounted() {
         this.loadCategories().then(() => {
      // Auto-load category from URL parameter after categories are loaded
      const categoryId = this.$route.query.category;
      if (categoryId) {
        this.viewCategoryQuizzes(categoryId);
      }
    });
    },
    watch: {
    '$route.query.category'(newId) {
      if (newId) {
        // Ensure categories are loaded before trying to view quizzes
        this.loadCategories().then(() => {
          this.viewCategoryQuizzes(newId);
        });
      }
    }
  },
    computed: {
        filteredCategories() {
            if (!this.searchQuery) return this.categories;
            return this.categories.filter(category =>
                category.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                category.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            ).map(category => ({
                ...category,
                icon: category.icon
            }));
        },
    },
    methods: {
        loadCategories() {return fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
        .then(response => response.json())
        .then(data => {
          this.categories = data
            ? Object.keys(data).map(id => ({
                id,
                icon: data[id].icon,
                title: data[id].title,
                description: data[id].description,
                quizzes: data[id].quizzes || []
              }))
            : [];
          return true; // Return a resolved promise
        })
        .catch(error => console.error("Error loading categories:", error))
        .finally(() => (this.loading = false));
        },
        viewCategoryQuizzes(categoryId) {
            this.loadingQuizzes = true;
            this.showCategories = false;

            const selectedCategory = this.categories.find(cat => cat.id === categoryId);
            this.selectedCategoryTitle = selectedCategory?.title || '';

            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json")
                .then(response => response.json())
                .then(data => {
                    if (data && selectedCategory?.quizzes?.length) {
                        this.selectedCategoryQuizzes = selectedCategory.quizzes
                            .map(qid => data[qid] ? { id: qid, ...data[qid] } : null)
                            .filter(q => q); // Remove nulls
                    } else {
                        this.selectedCategoryQuizzes = [];
                    }
                })
                .catch(error => console.error("Error loading quizzes:", error))
                .finally(() => (this.loadingQuizzes = false));
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
    }
};
</script>

<style scoped></style>