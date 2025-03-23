<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

        <div class="flex-1 flex flex-col md:ml-64">
            <AdminNavbar @toggleSidebar="toggleSidebar" />

            <div class="flex-1 p-4">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                    <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Organizations</h2>
                    <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateSearchQuery" />
                </div>

                <!-- Show Loading Spinner -->
                <div v-if="loading" class="flex justify-center my-10">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900 dark:border-teal-300">
                    </div>
                </div>

                <!-- Show No Data Message -->
                <div v-else-if="filteredOrganizations.length === 0"
                    class="text-center text-gray-500 dark:text-gray-400">
                    No organizations found.
                </div>

                <!-- Organizations Table -->
                <DynamicTable v-else :headers="['Org. ID', 'Name', 'Admin Email']"
                    :rows="paginatedData.map(org => [org.id, org.name, org.adminEmail])" @view-details="goToDetails"
                    class="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md shadow-md" />

                <!-- Pagination controls -->
                <div v-if="organizations.length > 0" class="flex justify-center gap-2 p-4">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                        Previous
                    </button>
                    <span class="px-4 py-2 text-sm font-medium text-teal-700">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
                        class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                        Next
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import DynamicTable from "@/components/admin/TableStructure.vue";

export default {
    components: {
        AdminSidebar,
        AdminNavbar,
        SearchBar,
        DynamicTable,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            organizations: [],
            searchQuery: "",
            loading: true,
            currentPage: 1,
            perPage: 8
        };
    },
    computed: {
        filteredOrganizations() {
            if (!this.searchQuery) return this.organizations;
            return this.organizations.filter(org =>
                org.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredOrganizations.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredOrganizations.length / this.perPage);
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
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            this.isSidebarOpen = window.innerWidth >= 768;
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
        async fetchOrganizations() {
            this.loading = true;
            try {
                const db = getDatabase();

                // Fetch organizations
                const orgRef = ref(db, "organizations");
                const orgSnap = await get(orgRef);

                // Fetch organization quizzes
                const orgQuizzesRef = ref(db, "organizationQuizzes");
                const orgQuizzesSnap = await get(orgQuizzesRef);

                if (orgSnap.exists()) {
                    const orgData = orgSnap.val();
                    const quizzesData = orgQuizzesSnap.exists() ? orgQuizzesSnap.val() : {};

                    this.organizations = Object.entries(orgData).map(([id, org]) => {
                        // Count quizzes for this organization
                        const orgQuizzes = Object.values(quizzesData).filter(quiz =>
                            quiz.organizationId === id || // Match by organization ID
                            quiz.organizationUId === org.adminUid // Fallback to admin UID
                        );

                        return {
                            id,
                            name: org.name || "Unknown Organization",
                            quizzes: orgQuizzes.length,
                            adminEmail: org.adminEmail || "No Email",
                            adminUid: org.adminUid
                        };
                    });
                } else {
                    this.organizations = [];
                }
            } catch (error) {
                console.error("Error fetching organizations:", error);
                this.organizations = [];
            } finally {
                this.loading = false;
            }
        },
        goToDetails(orgId) {
            this.$router.push(`/admin/organizations/${orgId}`);
        },
    },
    async mounted() {
        window.addEventListener("resize", this.handleResize);
        await this.fetchOrganizations();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>
