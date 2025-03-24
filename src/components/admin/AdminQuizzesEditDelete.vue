<template>
    <div class="flex min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-[#1a202c]">
    <!-- Sidebar -->
    <AdminSidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" class="fixed md:fixed z-50" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <AdminNavBar @toggleSidebar="toggleSidebar" />

      <div class="flex-1 p-4">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
          <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-400">Edit Quizzes</h2>
          <SearchBar class="w-full sm:w-auto" @search="updateSearchQuery" />
          <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-800 w-1/2 sm:w-auto cursor-pointer" @click="createQuiz">
            ➕ Create Quiz
          </button>
        </div>

        <!-- 🔹 Loading Spinner -->
           <!-- Loading Spinner -->
                    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Quizzes...</p>
                    </div>

        <!-- Admin Quizzes Section -->
        <h3 v-if="filteredAdminQuizzes.length" class="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-6">Admin Created Quizzes</h3>
        <hr v-if="filteredAdminQuizzes.length" class="my-2 border-gray-300 dark:border-gray-700" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard 
            v-for="quiz in paginatedAdminData" 
            :key="quiz.id" 
            :quiz="{
              ...quiz,
              icon: quiz.icon || '@/assets/icon.png'
            }" 
            @edit="editQuiz(quiz)" 
            @delete="confirmDelete(quiz.id, 'admin')" 
          />
        </div>

        <!-- Pagination controls for admin quizzes -->
        <div v-if="adminQuizzes.length > 0" class="flex justify-center gap-2 p-4 mt-2">
              <button @click="prevAdminPage" :disabled="currentAdminPage === 1"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Previous
              </button>
              <span class="px-4 py-2 text-sm font-medium text-teal-700">
                  Page {{ currentAdminPage }} of {{ totalAdminPages }}
              </span>
              <button @click="nextAdminPage" :disabled="currentAdminPage === totalAdminPages || totalAdminPages === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Next
              </button>
          </div>

        <!-- Organization Quizzes Section -->
        <h3 v-if="filteredOrgQuizzes.length" class="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-6">Organization Created Quizzes</h3>
        <hr v-if="filteredOrgQuizzes.length" class="my-2 border-gray-300 dark:border-gray-700" />
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <QuizCard v-for="quiz in paginatedOrgData" :key="quiz.id" :quiz="quiz" @edit="editQuiz(quiz)" @delete="confirmDelete(quiz.id, 'organization')" />
        </div>

        <!-- Pagination controls for org quizzes -->
        <div v-if="orgQuizzes.length > 0" class="flex justify-center gap-2 p-4 mt-2">
              <button @click="prevOrgPage" :disabled="currentOrgPage === 1"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Previous
              </button>
              <span class="px-4 py-2 text-sm font-medium text-teal-700">
                  Page {{ currentOrgPage }} of {{ totalOrgPages }}
              </span>
              <button @click="nextOrgPage" :disabled="currentOrgPage === totalOrgPages || totalOrgPages === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Next
              </button>
          </div>

        <!-- No Quizzes Message -->
        <div v-if="!loading && filteredAdminQuizzes.length === 0 && filteredOrgQuizzes.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-6">
          No quizzes available.
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75 dark:bg-gray-800/90">
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <p class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">Are you sure you want to delete this quiz?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteQuiz" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800">
            Yes, Delete
          </button>
          <button @click="showDeletePopup = false" class="bg-gray-300 text-teal-800 px-4 py-2 rounded-lg dark:bg-gray-600 dark:text-teal-300 dark:hover:bg-gray-500">
            Cancel
          </button>
        </div>
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
      currentAdminPage: 1,
      currentOrgPage: 1,
      perPage: 6
    };
  },

computed: {
  filteredAdminQuizzes() {
    return this.adminQuizzes.filter((quiz) => {
      if (!quiz || !quiz.title) {
        console.warn('Undefined quiz or quiz title in adminQuizzes:', quiz);
        return false;
      }
      return quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  },
  filteredOrgQuizzes() {
    return this.orgQuizzes.filter((quiz) => {
      if (!quiz || !quiz.title) {
        console.warn('Undefined quiz or quiz title in orgQuizzes:', quiz);
        return false;
      }
      return quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  },
  paginatedAdminData() {
      const start = (this.currentAdminPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredAdminQuizzes.slice(start, end);
    },
    totalAdminPages() {
        return Math.ceil(this.filteredAdminQuizzes.length / this.perPage);
    },
    paginatedOrgData() {
          const start = (this.currentOrgPage - 1) * this.perPage;
          const end = start + this.perPage;
          return this.filteredOrgQuizzes.slice(start, end);
      },
    totalOrgPages() {
        return Math.ceil(this.filteredOrgQuizzes.length / this.perPage);
    }
},

  methods: {
    visibleAdminPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const startPage = Math.max(
                1,
                Math.min(this.currentAdminPage - 2, this.totalAdminPages - 4)
            );
            const endPage = Math.min(startPage + 4, this.totalAdminPages);

            return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
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
    visibleOrgPages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const startPage = Math.max(
                1,
                Math.min(this.currentOrgPage - 2, this.totalOrgPages - 4)
            );
            const endPage = Math.min(startPage + 4, this.totalOrgPages);

            return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            );
        },
        nextOrgPage() {
            if (this.currentOrgPage < this.totalOrgPages) {
                this.currentOrgPage++;
            }
        },
        prevOrgPage() {
            if (this.currentOrgPage > 1) {
                this.currentOrgPage--;
            }
        },
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
            icon: adminData[key].icon || '@/assets/icon.png',
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
