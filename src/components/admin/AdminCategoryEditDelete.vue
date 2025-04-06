<template>
    <div class="flex min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-[#1a202c]">
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <div class="flex-1 flex flex-col md:ml-64">
            <AdminNavBar @toggleSidebar="toggleSidebar" />

            <div class="flex-1 p-4">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                    <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-400">Edit Categories</h2>
                    <Searchbar class="w-full sm:w-auto" @search="updateSearchQuery" />
                    <button
                        class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-800 w-1/2 sm:w-auto cursor-pointer"
                        @click="createCategory">
                        ➕ Create Category
                    </button>
                </div>

                   <!-- Loading Spinner -->
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Categories...</p>
                    </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <QuizCard v-for="category in paginatedData" :key="category.id" :quiz="{
                        id: category.id,
                        title: category.title,
                        description: category.description,
                        quizType: 'category' // This triggers category icon
                    }" @edit="editCategory(category)" @delete="confirmDelete(category.id)" />
                </div>

                <div v-if="!loading && filteredCategories.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6 h-50 flex flex-col justify-center items-center">
                    No categories available.
                </div>

                <!-- Pagination controls -->
                <div v-if="categories.length > 0" class="flex justify-center gap-2 p-4 mt-2">
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
        </div>

        <!-- Delete Confirmation Popup -->
        <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75 dark:bg-gray-800/90">
            <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <p class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">Are you sure you want to delete this category?</p>
                <div class="flex justify-center space-x-4">
                    <button @click="deleteCategory" class="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800">
                        Yes, Delete
                    </button>
                    <button @click="showDeletePopup = false" class="bg-gray-300 px-4 py-2 text-teal-800 rounded-lg cursor-pointer dark:bg-gray-600 dark:text-teal-300 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get, remove } from "firebase/database";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavBar from "@/components/admin/AdminNavBar.vue";
import QuizCard from "@/components/quiz/QuizEditDeleteCard.vue";
import Searchbar from "@/components/layout/Searchbar.vue";
// import categoryIcon from '@/assets/categoryIcon.png';

export default {
    components: { AdminSidebar, AdminNavBar, QuizCard, Searchbar },

    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            categories: [],
            loading: true,
            showDeletePopup: false,
            categoryToDeleteId: null,
            currentPage: 1,
            perPage: 6
        };
    },

    computed: {
        filteredCategories() {
            return this.categories.filter((category) => {
                if (!category || !category.title) {
                    console.warn('Undefined category or category title:', category);
                    return false;
                }
                return category.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    category.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
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
        async fetchCategories() {
            try {
                this.loading = true;
                const db = getDatabase();
                const categoriesRef = ref(db, "categories");
                const snapshot = await get(categoriesRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.categories = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key]
                    }));
                } else {
                    this.categories = [];
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                this.loading = false;
            }
        },

        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },

        updateSearchQuery(query) {
            this.searchQuery = query;
        },

        createCategory() {
            this.$router.push("/admin/categorycreation");
        },

        editCategory(category) {
            this.$router.push({
                path: '/admin/categorycreation',
                query: { edit: 'true', id: category.id }
            });
        },

        confirmDelete(id) {
            this.categoryToDeleteId = id;
            this.showDeletePopup = true;
        },

        async deleteCategory() {
            if (!this.categoryToDeleteId) return;

            try {
                const db = getDatabase();
                const categoryRef = ref(db, `categories/${this.categoryToDeleteId}`);
                await remove(categoryRef);
                this.categories = this.categories.filter(
                    (category) => category.id !== this.categoryToDeleteId
                );
            } catch (error) {
                console.error("Error deleting category:", error);
            }

            this.showDeletePopup = false;
            this.categoryToDeleteId = null;
        },
    },

    mounted() {
        this.fetchCategories();
        window.addEventListener("resize", () => {
            this.isSidebarOpen = window.innerWidth >= 768;
        });
    },

    beforeUnmount() {
        window.removeEventListener("resize", () => {
            this.isSidebarOpen = window.innerWidth >= 768;
        });
    },
};
</script>