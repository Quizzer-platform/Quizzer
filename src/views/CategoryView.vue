<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>

    <div
        class="flex justify-center py-2 pt-20 bg-white dark:bg-[#1a202c] flex-wrap items-center gap-4 px-4 sm:px-6 lg:px-8 w-full">
        <Searchbar class="w-full" v-if="showCategories" @search="updateSearchQuery" />
    </div>

    <div :class="showCategories ? 'min-h-screen' : 'min-h-0'"
        class="flex justify-center items-center bg-white text-gray-900 dark:bg-[#1a202c] dark:text-white">

        <!-- Loading Spinner -->
        <div v-if="loading || loadingQuizzes" class="flex flex-col justify-center items-center min-h-screen">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">{{ loading ? 'Loading categories...' : 'Loading quizzes...' }}</p>
        </div>

        <!-- Loading State
        <div v-if="loading || loadingQuizzes" class="text-center py-8 min-h-screen">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">{{ loading ? 'Loading categories...' : 'Loading quizzes...' }}</p>
        </div> -->

        <div v-else-if="paginatedData.length === 0" class="text-center text-gray-500 my-20">
            No Categories found.
        </div > 

        <div v-else-if="showCategories" class="flex flex-col justify-center items-center">
            <!-- Categories View -->
            <CategriesCards  :categories="paginatedData" @view-quizzes="viewCategoryQuizzes" />
            <!-- Pagination controls -->
            <div v-if="categories.length > 0" class="flex justify-center gap-2 p-4">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                    Previous
                </button>
                <span class="px-4 py-2 text-sm font-medium text-teal-700">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
                    class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                    Next
                </button>
            </div>
        </div>

        <!-- Quizzes View -->
        <div v-else class="container mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Back Button & Search Bar Container -->
            <div class="flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto px-4 py-2">
                <button @click="showCategories = true"
                    class="flex items-center cursor-pointer gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md 
                       hover:bg-teal-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    Back to Categories
                </button>
                <div class="relative w-full sm:w-80">
                    <search v-model="searchQuery" class="w-full" />
                </div>
            </div>

            <!-- Category Details Section -->
            <div v-if="selectedCategory"
                class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center my-6 max-w-5xl mx-auto hover:shadow-lg">
                <div class="flex items-center justify-center gap-4">
                    <img v-if="selectedCategory.icon" :src="selectedCategory.icon" alt="Category Icon"
                        class="w-16 h-16 shadow-lg">
                    <h2 class="text-3xl font-semibold text-teal-800 dark:text-teal-500">{{ selectedCategory.title }}
                    </h2>
                </div>
                <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg px-15">{{ selectedCategory.description }}</p>
            </div>

            <!-- Quizzes Section -->
            <!-- Divider Above the Heading -->
            <hr class="border-gray-400 mb-3 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

            <!-- Elegant Quizzes Review Heading -->
            <div class="flex flex-col justify-center items-center w-full max-w-5xl mx-auto">
                <h2 class="text-2xl sm:text-3xl font-bold text-teal-800 dark:text-teal-300 text-center mt-10 mb-6">
                    Category Quizzes
                </h2>
            </div>

            <!-- Quizzes Cards Section -->
            <div class="flex flex-col justify-center items-center w-full max-w-5xl mx-auto">
                <QuizesCards v-if="selectedCategoryQuizzes.length" :cards="selectedCategoryQuizzes"
                    :categoryTitle="selectedCategory.title" class="w-full" />
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
import QuizesCards from "../components/home/QuizzesCards.vue";
import Searchbar from "@/components/layout/Searchbar.vue";

export default {
    components: { CategriesCards, QuizesCards, Navbar, Footer, Searchbar },
    data() {
        return {
            categories: [],
            selectedCategory: null,
            selectedCategoryQuizzes: [],
            selectedCategoryTitle: '',
            loading: true,
            loadingQuizzes: false,
            showCategories: true,
            searchQuery: "",
            currentPage: 1,
            perPage: 9,
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
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredCategories.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredCategories.length / this.perPage);
        }
    },
    methods: {
        visiblePages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const startPage = Math.max(
                1,
                Math.min(this.currentPage - 2, this.totalPages - 4)
            );
            const endPage = Math.min(startPage + 4, this.totalPages);

            return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            );
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        resetPagination() {
            this.currentPage = 1;
        },
        loadCategories() {
            return fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
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
            this.selectedCategory = selectedCategory || null;

            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/adminQuizzes.json")
                .then(response => response.json())
                .then(data => {
                    if (data && selectedCategory?.quizzes?.length) {
                        this.selectedCategoryQuizzes = selectedCategory.quizzes
                            .map(qid => data[qid] ? { id: qid, ...data[qid] } : null)
                            .filter(q => q);
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