<template>
    <div class="flex min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />
        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />
            <!-- Main Content -->
            <main class="flex-1 p-4">
                <!-- User Review Section -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xl font-bold text-gray-800">User Review</h3>
                        <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-170" @search="updateSearchQuery" />
                    </div>

                    <!-- Loading Spinner -->
                    <div v-if="loading" class="flex justify-center my-10">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
                    </div>

                    <!-- Table (Hidden While Loading) -->
                    <TableStructure 
                        v-else 
                        :headers="['User Id', 'User Name', 'Role']"
                        :rows="filteredUsers.map(user => [user.id, user.name, user.role])"
                        :showActions="true"
                        @view-details="goToUserDetails"
                        class="w-full max-w-5xl mx-auto" 
                    />
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
    components: {
        AdminSidebar,
        AdminNavbar,
        SearchBar,
        TableStructure,
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth >= 768,
            searchQuery: "",
            users: [], // Stores fetched users
            loading: true, // Spinner state
        };
    },
    computed: {
        filteredUsers() {
            if (!this.searchQuery) return this.users;
            return this.users.filter(user =>
                user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            if (window.innerWidth >= 768) {
                this.isSidebarOpen = true; // Auto-show sidebar on large screens
            }
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
        },
        async fetchUsers() {
            try {
                this.loading = true; // Show spinner

                const db = getDatabase();
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.users = Object.entries(data).map(([id, user]) => ({
                        id,
                        name: user.name || "Unknown",
                        lastQuiz: user.lastQuiz || "No Quiz Taken",
                        degree: user.degree || "N/A",
                        role: user.role || "user", // Default role if not found
                    }));

                    console.log("Fetched all users:", this.users);
                } else {
                    this.users = [];
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                this.loading = false; // Hide spinner
            }
        },
        goToUserDetails(userId) {
            this.$router.push(`/admin/user/${userId}`);
        },
    },
    async mounted() {
        try {
            window.addEventListener("resize", this.handleResize);
            await this.fetchUsers();
        } catch (error) {
            console.error("Error initializing component:", error);
            this.loading = false; // Hide spinner if an error occurs
        }
    },
};
</script>
