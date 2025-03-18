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
                    <TableStructure v-else :headers="['User Id', 'User Name', 'Email']"
                        :rows="filteredUsers.map(user => [user.id, user.name, user.email])" :showActions="true"
                        @view-details="goToUserDetails" class="w-full max-w-5xl mx-auto" />

                    <div class="mt-8">
                        <h3 class="text-xl font-bold text-gray-800 mb-3">System Administrators</h3>
                        <!-- Admin Table -->
                        <TableStructure v-if="!loading && filteredAdmins.length > 0"
                            :headers="['Admin Id', 'Name', 'Email']" :rows="filteredAdmins.map(admin => [
                                admin.id,
                                admin.name,
                                admin.email
                            ])" :showActions="true" @view-details="goToUserDetails"
                            class="w-full max-w-5xl mx-auto" />
                        <!-- No Admins Message -->
                        <div v-else-if="!loading && admins.length === 0" class="text-center text-gray-500 mt-6">
                            No administrators found.
                        </div>
                    </div>
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
            admins: [], // Add this new property
        };
    },
    computed: {
        filteredUsers() {
            if (!this.searchQuery) return this.users;
            const query = this.searchQuery.toLowerCase();
            return this.users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        },

        filteredAdmins() {
            if (!this.searchQuery) return this.admins;
            const query = this.searchQuery.toLowerCase();
            return this.admins.filter(admin =>
                admin.name.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query)
            );
        }
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
                    this.users = Object.entries(data)
                        .filter(([_, user]) => user.role === 'user') // Exclude admin users
                        .map(([id, user]) => ({
                            id,
                            name: user.name || "Unknown User",
                            email: user.email || "No Email",
                            role: user.role || "user",
                            createdAt: user.createdAt || null
                        }))
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // Sort by creation date

                } else {
                    this.users = [];
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                this.users = [];
            } finally {
                this.loading = false; // Hide spinner
            }
        },
        goToUserDetails(userId) {
            this.$router.push(`/admin/user/${userId}`);
        },
        formatDate(timestamp) {
            if (!timestamp) return 'N/A';
            return new Date(timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        async fetchAdmins() {
            try {
                const db = getDatabase();
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.admins = Object.entries(data)
                        .filter(([_, user]) => user.role === 'organization_admin')
                        .map(([id, admin]) => ({
                            id,
                            name: admin.name || "Unknown Admin",
                            email: admin.email || "No Email",
                            createdAt: admin.createdAt || null
                        }))
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                } else {
                    this.admins = [];
                }
            } catch (error) {
                console.error("Error fetching admins:", error);
                this.admins = [];
            }
        },
    },
    async mounted() {
        try {
            window.addEventListener("resize", this.handleResize);
            await Promise.all([
                this.fetchUsers(),
                this.fetchAdmins()
            ]);
        } catch (error) {
            console.error("Error initializing component:", error);
        } finally {
            this.loading = false;
        }
    },
};
</script>
