<template>
    <div class="bg-gray-100  dark:bg-[#1a202c] min-h-screen text-gray-900 dark:text-gray-200">
        <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>

        <!-- Search Bar -->
        <Searchbar class="mt-6 pt-20" @search="updateSearchQuery" />

        <div class="flex flex-col justify-center items-center min-h-fit px-6">
        <!-- Loading Spinner -->
        <div v-if="loading" class="flex flex-col justify-center items-center h-80">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quizzes...</p>
        </div>


            <!-- No Data State -->
            <div v-else-if="paginatedData.length === 0"
                class="text-center text-gray-500 dark:text-gray-400 my-20 text-lg flex flex-col justify-center items-center h-80">
                No quizzes found.
            </div>

            <!-- Quizzes List -->
            <Quizzes v-else :cards="paginatedData" />

            <!-- Pagination controls -->
            <div v-if="cards.length > 0" class="flex justify-center gap-2 p-4 mt-2 mb-10">
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
        <Footer />
    </div>
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import Quizzes from "./QuizzesCards.vue";
import Searchbar from "@/components/layout/Searchbar.vue";

export default {
    components: {
        Quizzes,
        Navbar,
        Footer,
        Searchbar
    },
    data() {
        return {
            cards: [],
            loading: true,
            searchQuery: "",
            currentPage: 1,
            perPage: 9
        };
    },
    computed: {
        filteredQuizzes() {
            if (!this.searchQuery) return this.cards;
            const searchLower = this.searchQuery.toLowerCase();
            return this.cards.filter(quiz =>
                quiz.title.toLowerCase().includes(searchLower) ||
                quiz.description.toLowerCase().includes(searchLower)
            );
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredQuizzes.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredQuizzes.length / this.perPage);
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
                window.scrollTo(0, 0);
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                window.scrollTo(0, 0);
            }
        },
        resetPagination() {
            this.currentPage = 1;
        },
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
