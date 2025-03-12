<template>
  <div class="flex min-h-screen min-w-screen bg-gray-100">
    <!-- Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" />

      <!-- User Details Content -->
      <main class="flex-1 p-6">
        <div v-if="selectedUser" class="bg-white p-6 rounded-lg shadow-md mt-4">
          <div class="flex flex-col space-y-4">
            <!-- User Info -->
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-bold text-teal-700">{{ selectedUser.name }}</h2>
              <p class="mt-1 text-gray-600">Joined: {{ formatDate(selectedUser.createdAt) }}</p>

              <div class="mt-3 text-gray-700">
                <p><span class="font-semibold">Email:</span> {{ selectedUser.email }}</p>
                <p><span class="font-semibold">Phone:</span> {{ selectedUser.phone }}</p>
                <p><span class="font-semibold">Organization:</span> {{ selectedUser.organization }}</p>
              </div>
            </div>

            <!-- User Stats -->
            <div class="flex justify-between items-center bg-teal-50 p-4 rounded-lg">
              <div class="text-center">
                <p class="text-xl font-semibold text-teal-700">{{ selectedUser.quizzesToTake }}</p>
                <p class="text-gray-600">Quizzes To Take</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-semibold text-teal-700">{{ selectedUser.overallScore }}</p>
                <p class="text-gray-600">Overall Score</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Review Section -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800">User's Quiz History</h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-170" v-model="searchQuery" />
          </div>

          <!-- 🔹 Loading Spinner -->
          <div v-if="isLoading" class="flex justify-center my-6">
            <svg class="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>

          <!-- 🔹 No Quizzes Found Message -->
          <div v-else-if="userReview.length === 0" class="text-center text-gray-500 mt-6">
            This user has not taken any quizzes yet.
          </div>

          <!-- Table (Only Show When Data Exists) -->
          <TableStructure 
            v-else
            :headers="['Quiz Code', 'Quiz Name', 'Degree', 'Date']" 
            :rows="filteredReviews.map(r => [r.code, r.quizName, r.degree, formatDate(r.date)])" 
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue";

export default {
  components: {
    OrganizationSidebar,
    OrganizationNavbar,
    TableStructure,
    SearchBar,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768,
      searchQuery: "",
      selectedUser: null, // Holds the user details
      userReview: [], // Holds the user's quizzes
      isLoading: true, // 🔹 Tracks loading state
    };
  },
  computed: {
    filteredReviews() {
      return this.userReview.filter(review =>
        review.quizName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      this.isSidebarOpen = window.innerWidth >= 768;
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    async loadUserDetails() {
      const userId = this.$route.params.id;
      if (!userId) return;

      this.isLoading = true; // 🔹 Start loading

      try {
        const db = getDatabase();

        // 🔹 Fetch User Details
        const userRef = ref(db, `users/${userId}`);
        const userSnap = await get(userRef);
        if (userSnap.exists()) {
          this.selectedUser = userSnap.val();
        } else {
          console.error("User not found");
          this.isLoading = false;
          return;
        }

        // 🔹 Fetch User's Quizzes
        const quizzesRef = ref(db, `user_quizzes/${userId}`);
        const quizzesSnap = await get(quizzesRef);

        if (quizzesSnap.exists()) {
          const quizzesData = quizzesSnap.val();
          this.userReview = Object.entries(quizzesData).map(([key, quiz]) => ({
            code: key,
            quizName: quiz.name || "Unknown Quiz",
            degree: quiz.degree || "N/A",
            date: quiz.date || "Unknown Date",
          }));
        } else {
          this.userReview = []; // No quizzes found
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }

      this.isLoading = false; // 🔹 Stop loading
    },
  },
  watch: {
    "$route.params.id": "loadUserDetails",
  },
  mounted() {
    this.loadUserDetails();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
