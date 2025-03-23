<template>
    <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
        <!-- Sidebar -->
        <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />
        <!-- Main Content -->
        <div class="flex-1 flex flex-col md:ml-64">
            <!-- Navbar -->
            <AdminNavbar @toggleSidebar="toggleSidebar" />
            <!-- Main Content -->
            <main class="flex-1 p-4">
                <!-- User Review Section -->
                <!-- <div class="mt-4"> -->
                <h2 class="text-xl font-bold text-gray-800 dark:text-teal-300 mb-3">System Users</h2>
                <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                    <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Users Review</h2>
                    <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateUserSearchQuery" />
                </div>

                <!-- Loading Spinner -->
                <div v-if="loading" class="flex justify-center my-10">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
                </div>

                <!-- Table (Hidden While Loading) -->
                <TableStructure v-else :headers="['User Id', 'User Name', 'Email']"
                    :rows="paginatedUserData.map(user => [user.id, user.name, user.email])" :showActions="true"
                    @view-details="goToUserDetails" class="w-full max-w-5xl mx-auto" />

                <!-- Pagination controls for users -->
                <div v-if="users.length > 0" class="flex justify-center gap-2 p-4">
                    <button @click="prevUserPage" :disabled="currentUserPage === 1"
                        class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                        Previous
                    </button>
                    <span class="px-4 py-2 text-sm font-medium text-teal-700">
                        Page {{ currentUserPage }} of {{ totalUserPages }}
                    </span>
                    <button @click="nextUserPage" :disabled="currentUserPage === totalUserPages || totalUserPages === 0"
                        class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                        Next
                    </button>
                </div>

                <div class="mt-8">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-teal-300 mb-3">System Administrators</h2>
                    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
                        <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Admins Review</h2>
                        <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" @search="updateAdminSearchQuery" />
                    </div>
                    <!-- Admin Table -->
                    <TableStructure v-if="!loading && paginatedAdminData.length > 0"
                        :headers="['Admin Id', 'Name', 'Email']" :rows="paginatedAdminData.map(admin => [
                            admin.id,
                            admin.name,
                            admin.email
                        ])" :showActions="true" @view-details="goToUserDetails" class="w-full max-w-5xl mx-auto" />
                    <!-- No Admins Message -->
                    <div v-else-if="!loading && admins.length === 0" class="text-center text-gray-500 mt-6">
                        No administrators found.
                    </div>

                    <!-- Pagination controls for admins -->
                    <div v-if="admins.length > 0" class="flex justify-center gap-2 p-4">
                        <button @click="prevAdminPage" :disabled="currentAdminPage === 1"
                            class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                            Previous
                        </button>
                        <span class="px-4 py-2 text-sm font-medium text-teal-700">
                            Page {{ currentAdminPage }} of {{ totalAdminPages }}
                        </span>
                        <button @click="nextAdminPage" :disabled="currentAdminPage === totalAdminPages || totalAdminPages === 0"
                            class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer">
                            Next
                        </button>
                    </div>

                </div>
                <!-- </div> -->
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
            userSearchQuery: "",
            adminSearchQuery: "",
            users: [], // Stores fetched users
            loading: true, // Spinner state
            admins: [], // Add this new property
            currentUserPage: 1,
            currentAdminPage: 1,
            perUserPage: 8,
            perAdminPage: 8,
        };
    },
    computed: {
        filteredUsers() {
            if (!this.userSearchQuery) return this.users;
            const query = this.userSearchQuery.toLowerCase();
            return this.users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        },

        filteredAdmins() {
            if (!this.adminSearchQuery) return this.admins;
            const query = this.adminSearchQuery.toLowerCase();
            return this.admins.filter(admin =>
                admin.name.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query)
            );
        },
        paginatedUserData() {
            const start = (this.currentUserPage - 1) * this.perUserPage;
            const end = start + this.perUserPage;
            return this.filteredUsers.slice(start, end);
        },
        paginatedAdminData() {
            const start = (this.currentAdminPage - 1) * this.perAdminPage;
            const end = start + this.perAdminPage;
            return this.filteredAdmins.slice(start, end);
        },
        totalUserPages() {
            return Math.ceil(this.filteredUsers.length / this.perUserPage);
        },
        totalAdminPages() {
            return Math.ceil(this.filteredAdmins.length / this.perAdminPage);
        }
    },
    methods: {
        visibleUserPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const userStartPage = Math.max(
                1,
                Math.min(this.currentUserPage - 2, this.totalUserPages - 4)
            );
            const userEndPage = Math.min(userStartPage + 4, this.totalUserPages);

            return Array.from(
                { length: userEndPage - userStartPage + 1 },
                (_, i) => userStartPage + i
            );
        },
        nextUserPage() {
            if (this.currentUserPage < this.totalUserPages) {
                this.currentUserPage++;
            }
        },
        prevUserPage() {
            if (this.currentUserPage > 1) {
                this.currentUserPage--;
            }
        },
        visibleAdminPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const adminStartPage = Math.max(
                1,
                Math.min(this.currentAdminPage - 2, this.totalAdminPages - 4)
            );
            const adminEndPage = Math.min(adminStartPage + 4, this.totalAdminPages);

            return Array.from(
                { length: adminEndPage - adminStartPage + 1 },
                (_, i) => adminStartPage + i
            );
        },
        nextAdminPage() {
            if (this.currentAdminPage < this.totalAdminPages) {
                this.currentAdminPage++;
            }
        },
        prevAdminPage() {
            if (this.currentAdminPage > 1) {
                this.currentAdminPage--;
            }
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        handleResize() {
            if (window.innerWidth >= 768) {
                this.isSidebarOpen = true; // Auto-show sidebar on large screens
            }
        },
        updateUserSearchQuery(query) {
            this.userSearchQuery = query;
        },
        updateAdminSearchQuery(query) {
            this.adminSearchQuery = query;
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
