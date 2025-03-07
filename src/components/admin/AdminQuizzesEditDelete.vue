<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <AdminNavBar @toggleSidebar="toggleSidebar" />

      <div class="flex-1 p-4">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
          <h2 class="text-xl font-semibold text-teal-900">Edit Quizzes</h2>
          <SearchBar class="w-full sm:w-auto" @search="updateSearchQuery" />
          <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 w-1/2 sm:w-auto cursor-pointer" @click="createQuiz">
            ➕ Create Quiz
          </button>
        </div>

        <!-- Admin Quizzes Section -->
        <h3 class="text-lg font-semibold text-gray-800 mt-6">Admin Created Quizzes</h3>
        <hr class="my-2 border-gray-300" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard v-for="quiz in filteredAdminQuizzes" :key="quiz.id" :quiz="quiz" @edit="editQuiz(quiz)" @delete="confirmDelete(quiz.id, 'admin')" />
        </div>

        <!-- Organization Quizzes Section -->
        <h3 class="text-lg font-semibold text-gray-800 mt-6">Organization Created Quizzes</h3>
        <hr class="my-2 border-gray-300" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard v-for="quiz in filteredOrgQuizzes" :key="quiz.id" :quiz="quiz" @edit="editQuiz(quiz)" @delete="confirmDelete(quiz.id, 'organization')" />
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Popup -->
  <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-lg font-semibold mb-4">Are you sure you want to delete this quiz?</p>
      <div class="flex justify-center space-x-4">
        <button @click="deleteQuiz" class="bg-red-500 text-white px-4 py-2 rounded-lg">Yes, Delete</button>
        <button @click="showDeletePopup = false" class="bg-gray-300 px-4 py-2 text-teal-800 rounded-lg">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
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
      adminQuizzes: [],
      orgQuizzes: [],
      showDeletePopup: false,
      quizToDeleteId: null,
      deleteSource: null, // 'admin' or 'organization'
    };
  },

  computed: {
    filteredAdminQuizzes() {
      return this.adminQuizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredOrgQuizzes() {
      return this.orgQuizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  methods: {
    // Fetch admin-created quizzes
    async fetchAdminQuizzes() {
  try {
    const response = await fetch("https://quizzer-platform-default-rtdb.firebaseio.com/quizData.json");
    const data = await response.json();
    if (data) {
      this.adminQuizzes = Object.keys(data).map((key) => ({
        id: key, // Firebase ID
        ...data[key], // Quiz Data
        createdBy: "admin", // Manually add this
      }));
    } else {
      this.adminQuizzes = []; // Ensure it's an empty array if no data
    }
  } catch (error) {
    console.error("Error fetching admin quizzes:", error);
  }
},
    // Fetch organization-created quizzes
    async fetchOrgQuizzes() {
  try {
    const response = await fetch("https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json");
    const data = await response.json();
    if (data) {
      this.orgQuizzes = Object.keys(data).map((key) => ({
        id: key, // Firebase ID
        ...data[key], // Quiz Data
        createdBy: "organization", // Manually add this
      }));
    } else {
      this.orgQuizzes = []; // Ensure it's an empty array if no data
    }
  } catch (error) {
    console.error("Error fetching organization quizzes:", error);
  }
},
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    updateSearchQuery(query) {
      this.searchQuery = query;
    },

    createQuiz() {
      this.$router.push("/admin/createQuiz");
    },

    editQuiz(quiz) {
  if (quiz.createdBy === "admin") {
    this.$router.push({ name: "adminEditQuiz", params: { quizId: quiz.id } });
  } else {
    this.$router.push({ name: "editQuiz", params: { quizId: quiz.id } });
  }
},

    confirmDelete(id, source) {
      this.quizToDeleteId = id;
      this.deleteSource = source;
      this.showDeletePopup = true;
    },

    async deleteQuiz() {
      if (!this.quizToDeleteId || !this.deleteSource) return;

      const url = this.deleteSource === "admin"
        ? `https://quizzer-platform-default-rtdb.firebaseio.com/quizData/${this.quizToDeleteId}.json`
        : `https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${this.quizToDeleteId}.json`;

      try {
        await fetch(url, { method: "DELETE" });

        if (this.deleteSource === "admin") {
          this.adminQuizzes = this.adminQuizzes.filter((quiz) => quiz.id !== this.quizToDeleteId);
        } else {
          this.orgQuizzes = this.orgQuizzes.filter((quiz) => quiz.id !== this.quizToDeleteId);
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }

      this.showDeletePopup = false;
      this.quizToDeleteId = null;
      this.deleteSource = null;
    }
  },

  mounted() {
    this.fetchAdminQuizzes();
    this.fetchOrgQuizzes();
    window.addEventListener("resize", () => {
      this.isSidebarOpen = window.innerWidth >= 768;
    });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>


<style scoped>
/* Add custom styles if needed */
</style>
