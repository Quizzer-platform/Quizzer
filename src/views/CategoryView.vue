<!-- <template>
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
  -->
<!-- <template>
    <div class="container mx-auto p-4">
        <h2 class="text-2xl font-bold mb-4">Categories</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="category in categories" :key="category.id" class="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold">{{ category.title }}</h3>
                <p>{{ category.description }}</p>
                <button @click="viewCategoryQuizzes(category.id)" class="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400">See More</button>
            </div>
        </div>
        
        <div v-if="selectedCategoryQuizzes.length" class="mt-6">
            <h2 class="text-2xl font-bold mb-4">Quizzes in {{ selectedCategoryTitle }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="quiz in selectedCategoryQuizzes" :key="quiz.id" class="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold">{{ quiz.title }}</h3>
                    <p>{{ quiz.description }}</p>
                    <p><strong>Duration:</strong> {{ quiz.duration }} min</p>
                    <p><strong>Questions:</strong> {{ quiz.numberOfQuestions }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: [],
            selectedCategoryQuizzes: [],
            selectedCategoryTitle: ''
        };
    },
    mounted() {
        this.loadCategories();
    },
    methods: {
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
                .then(response => response.json())
                .then(data => {
                    this.categories = Object.keys(data).map(id => ({ id, title: data[id].title, description: data[id].description }));
                })
                .catch(error => console.error("Error loading categories:", error));
        },
        viewCategoryQuizzes(categoryId) {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json")
                .then(response => response.json())
                .then(data => {
                    this.selectedCategoryQuizzes = Object.keys(data)
                        .filter(id => data[id].category === categoryId)
                        .map(id => ({ id, ...data[id] }));
                    this.selectedCategoryTitle = this.categories.find(cat => cat.id === categoryId)?.title || '';
                })
                .catch(error => console.error("Error loading quizzes:", error));
        }
    }
};
</script>  -->
<!-- 
<style scoped></style>  -->


<template>
    <Navbar />
    <search class="" @search="updateSearchQuery" />

    <div class="flex justify-center">
        <!-- Loading State -->
        <div v-if="loading || loadingQuizzes" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">{{ loading ? 'Loading categories...' : 'Loading quizzes...' }}</p>
        </div>

        <!-- Categories View -->
        <CategriesCards v-else-if="showCategories" :categories="filteredCategories" @view-quizzes="viewCategoryQuizzes" />

        <!-- Quizzes View -->
        <div v-else class=" flex flex-col  container mx-auto p-4">
            <div>
                <button @click="showCategories = true"
                    class="m-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-teal-900 transition">
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
            );
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
                            quizzes: data[id].quizzes || [] // ✅ ضفنا quizzes هنا
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