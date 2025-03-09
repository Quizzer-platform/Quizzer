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

        <!-- 🔹 Loading Spinner -->
        <div v-if="loading" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
        </div>

        <!-- Admin Quizzes Section -->
        <h3 v-if="filteredAdminQuizzes.length" class="text-lg font-semibold text-gray-800 mt-6">Admin Created Quizzes</h3>
        <hr v-if="filteredAdminQuizzes.length" class="my-2 border-gray-300" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard v-for="quiz in filteredAdminQuizzes" :key="quiz.id" :quiz="quiz" @edit="editQuiz(quiz)" @delete="confirmDelete(quiz.id, 'admin')" />
        </div>

        <!-- Organization Quizzes Section -->
        <h3 v-if="filteredOrgQuizzes.length" class="text-lg font-semibold text-gray-800 mt-6">Organization Created Quizzes</h3>
        <hr v-if="filteredOrgQuizzes.length" class="my-2 border-gray-300" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard v-for="quiz in filteredOrgQuizzes" :key="quiz.id" :quiz="quiz" @edit="editQuiz(quiz)" @delete="confirmDelete(quiz.id, 'organization')" />
        </div>

        <!-- No Quizzes Message -->
        <div v-if="!loading && filteredAdminQuizzes.length === 0 && filteredOrgQuizzes.length === 0" class="text-center text-gray-500 mt-6">
          No quizzes available.
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
      adminQuizzes: [],
      orgQuizzes: [],
      loading: true,
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
    async fetchQuizzes() {
      try {
        this.loading = true;
        const db = getDatabase();

        // Fetch Admin Quizzes
        const adminRef = ref(db, "adminQuizzes");
        const adminSnap = await get(adminRef);

        if (adminSnap.exists()) {
          const adminData = adminSnap.val();
          this.adminQuizzes = Object.keys(adminData).map((key) => ({
            id: key,
            ...adminData[key],
            createdBy: "admin",
          }));
        } else {
          this.adminQuizzes = [];
        }

        // Fetch Organization Quizzes
        const orgRef = ref(db, "organizationQuizzes");
        const orgSnap = await get(orgRef);

        if (orgSnap.exists()) {
          const orgData = orgSnap.val();
          this.orgQuizzes = Object.keys(orgData).map((key) => ({
            id: key,
            ...orgData[key],
            createdBy: "organization",
          }));
        } else {
          this.orgQuizzes = [];
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
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

    createQuiz() {
      this.$router.push("/admin/createQuiz");
    },

  editQuiz(quiz) {
  // Check if the quiz exists in the adminQuizzes list
  const isAdminQuiz = this.adminQuizzes.some(q => q.id === quiz.id);

  if (isAdminQuiz) {
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

      try {
        const db = getDatabase();
        const quizRef = ref(db, `${this.deleteSource === "admin" ? "adminQuizzes" : "organizationQuizzes"}/${this.quizToDeleteId}`);

        await remove(quizRef);

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
    },
  },

  async mounted() {
    this.fetchQuizzes();
    window.addEventListener("resize", () => {
      this.isSidebarOpen = window.innerWidth >= 768;
    });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
