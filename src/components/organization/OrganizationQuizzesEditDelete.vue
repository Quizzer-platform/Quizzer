<template>
  <div class="flex min-h-screen bg-gray-100">
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

      <!-- Page Content -->
      <div class="flex-1 p-4">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2 text-center sm:text-left">
          <h2 class="text-xl font-semibold text-teal-900">Edit Quizzes</h2>

          <!-- Search Bar -->
          <SearchBar class="w-full sm:w-auto" @search="updateSearchQuery" />

          <!-- Create Quiz Button -->
          <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 w-1/2 sm:w-auto cursor-pointer" @click="createQuiz">
            ➕ Create Quiz
          </button>
        </div>

        <!-- Quiz Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6 mx-auto max-w-6xl px-4 justify-items-center">
          <QuizCard 
            v-for="quiz in filteredQuizzes" 
            :key="quiz.id" 
            :quiz="quiz" 
            @edit="editQuiz" 
            @delete="confirmDelete(quiz.id)"
            class="max-w-xs mx-auto sm:max-w-none"
          />
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
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import QuizCard from "@/components/quiz/QuizEditDeleteCard.vue";
import SearchBar from "@/components/layout/Searchbar.vue"; 

export default {
  components: { OrganizationSidebar, OrganizationNavbar, QuizCard, SearchBar },

  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768, 
      searchQuery: "",
      quizzes: [],
      showDeletePopup: false,
      quizToDeleteId: null,
    };
  },

  computed: {
    filteredQuizzes() {
      return this.quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  methods: {
    async fetchQuizzes() {
      try {
        const organizationId = "test-org-123"; // Replace with authenticated org ID later
        const response = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json');
        const data = await response.json();

        if (data) {
          this.quizzes = Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .filter((quiz) => quiz.organizationId === organizationId);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
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

    createQuiz() {
      this.$router.push('/organization/createQuiz');
    },

    editQuiz(quiz) {
      this.$router.push({ name: "editQuiz", params: { quizId: quiz.id } });
    },

    confirmDelete(id) {
      this.quizToDeleteId = id;
      this.showDeletePopup = true;
    },

    async deleteQuiz() {
      if (!this.quizToDeleteId) return;

      try {
        await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${this.quizToDeleteId}.json`, {
          method: "DELETE",
        });

        // Remove from UI
        this.quizzes = this.quizzes.filter((quiz) => quiz.id !== this.quizToDeleteId);
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }

      // Close popup
      this.showDeletePopup = false;
      this.quizToDeleteId = null;
    }
  },

  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.fetchQuizzes();
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
