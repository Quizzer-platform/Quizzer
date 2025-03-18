<template>
    <Navbar />
    <search v-if="showCategories" class="" @search="updateSearchQuery" />

    <div class="flex justify-center items-center">
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
    <div v-else class="container mx-auto px-4 lg:px-8">
        <div class="flex justify-start">
            <button @click="showCategories = true"
                class="m-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-teal-900 transition cursor-pointer">
                Back to Categories
            </button>
        </div>
        <QuizesCards v-if="selectedCategoryQuizzes.length" :cards="selectedCategoryQuizzes"
            :categoryTitle="selectedCategoryTitle" />
        <div v-else-if="!loadingQuizzes" class="text-center py-8">
            <p class="text-gray-600">No quizzes found in this category.</p>
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
        this.loadCategories();
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
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
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