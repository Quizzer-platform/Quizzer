<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed z-50 md:fixed transition-transform duration-300"
      :class="{'-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen}" 
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <!-- Dashboard Overview -->
        <div class="bg-white rounded-lg shadow-md mt-6 mx-4 md:mx-6 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center h-auto lg:h-60">
          <!-- Left Content -->
          <div class="max-w-2xl px-4 md:px-6 lg:px-10 text-center md:text-left">
            <h2 class="text-2xl sm:text-3xl font-bold text-teal-900 mb-3 sm:mb-4">
              Time to Manage Your Quizzes!
            </h2>
            <p class="text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              Manage and track all users, quizzes, and categories easily.
            </p>
            <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer" @click="createQuiz">
                CREATE QUIZ
              </button>
              <button class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer" @click="viewQuiz">
                VIEW / EDIT QUIZ
              </button>
              <button class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer" @click="createCategory">
                CREATE CATEGORY
              </button>
            </div>
          </div>

          <!-- Right Image -->
          <div class="mt-6 md:mt-0 flex justify-center md:justify-end w-full md:w-auto">
            <img src="../../assets/AdminImg.svg" alt="Dashboard Illustration" class="h-36 md:h-40 lg:h-44 xl:h-48 w-auto md:mr-6 lg:mr-10" />
          </div>
        </div>

        <!-- User Review Section -->
        <div class="mt-8">
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
  :showActions="false"
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
