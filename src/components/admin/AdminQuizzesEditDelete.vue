<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar (Hidden by Default on Small Screens) -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-x-hidden">
      <!-- Navbar -->
      <AdminNavBar @toggleSidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 p-4 overflow-x-hidden">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2 text-center sm:text-left">
          <h2 class="text-xl font-semibold text-teal-900">Edit Quizzes</h2>

          <!-- Search Bar (Full Width on Small Screens) -->
          <SearchBar class="w-full sm:w-auto" @search="updateSearchQuery" />

          <!-- Create Quiz Button (Full Width on Small Screens) -->
          <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 w-1/2 sm:w-auto">
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
            @delete="deleteQuiz"
            class="max-w-xs mx-auto sm:max-w-none"
        />
        </div>
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
      isSidebarOpen: window.innerWidth >= 768, // Sidebar is open by default on large screens
      searchQuery: "",
      quizzes: [
        { id: 1, title: "HTML Fundamentals",icon:"ii", description: "Learn the basics of HTML and more about this quiz" },
        { id: 2, title: "CSS Basics", icon:"ii",description: "Understand styling with CSS and more about this quiz" },
        { id: 3, title: "JavaScript Essentials", icon:"ii",description: "Master JavaScript concepts and more about this quiz" },
        { id: 4, title: "Vue.js Introduction",icon:"ii", description: "Get started with Vue.js and more about this quiz" },
      ],
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
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    handleResize() {
      this.isSidebarOpen = window.innerWidth >= 768;
    },

    updateSearchQuery(query) {
      this.searchQuery = query;
    },

    editQuiz(quiz) {
      console.log("Editing quiz:", quiz);
    },

    deleteQuiz(id) {
      this.quizzes = this.quizzes.filter((quiz) => quiz.id !== id);
    },
  },

  mounted() {
    window.addEventListener("resize", this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>