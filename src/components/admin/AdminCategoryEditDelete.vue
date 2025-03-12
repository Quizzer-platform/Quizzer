<template>
    <div class="flex min-h-screen bg-gray-100">
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <div class="flex-1 flex flex-col md:ml-64">
            <AdminNavBar @toggleSidebar="toggleSidebar" />

            <div class="flex-1 p-4">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                    <h2 class="text-xl font-semibold text-teal-900">Edit Categories</h2>
                    <SearchBar class="w-full sm:w-auto" @search="updateSearchQuery" />
                    <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 w-1/2 sm:w-auto cursor-pointer" 
                        @click="createCategory">
                        ➕ Create Category
                    </button>
                </div>

                <div v-if="loading" class="flex justify-center my-10">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <QuizCard 
                        v-for="category in filteredCategories" 
                        :key="category.id" 
                        :quiz="category" 
                        @edit="editCategory(category)" 
                        @delete="confirmDelete(category.id)" 
                    />
                </div>

                <div v-if="!loading && filteredCategories.length === 0" 
                    class="text-center text-gray-500 mt-6">
                    No categories available.
                </div>
            </div>
        </div>

        <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <p class="text-lg font-semibold mb-4">Are you sure you want to delete this category?</p>
                <div class="flex justify-center space-x-4">
                    <button @click="deleteCategory" class="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Yes, Delete
                    </button>
                    <button @click="showDeletePopup = false" class="bg-gray-300 px-4 py-2 text-teal-800 rounded-lg">
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
import SearchBar from "@/components/layout/Searchbar.vue";

export default {
    components: { AdminSidebar, AdminNavBar, QuizCard, SearchBar },

    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            categories: [],
            loading: true,
            showDeletePopup: false,
            categoryToDeleteId: null,
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
    },

    methods: {
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
  