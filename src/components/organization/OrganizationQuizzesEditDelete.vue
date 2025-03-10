<template>
  <div class="flex min-h-screen min-w-screen bg-gray-100">
    <!-- Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50 h-screen"
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
        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center mt-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
    <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-lg font-semibold mb-4">Are you sure you want to delete this quiz?</p>
      <div class="flex justify-center space-x-4">
        <button @click="deleteQuiz" class="bg-red-500 text-white px-4 py-2 rounded-lg">Yes, Delete</button>
        <button @click="showDeletePopup = false" class="bg-gray-300 px-4 py-2 text-teal-800 rounded-lg">Cancel</button>
      </div>
    </div>
  </div>
  </div>

  <!-- Delete Confirmation Popup -->
</template>
<script>
// import { getAuth } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref, get } from "firebase/database";
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import QuizCard from "@/components/quiz/QuizEditDeleteCard.vue";
import SearchBar from "@/components/layout/Searchbar.vue"; 
import { getDatabase, ref, onValue ,get } from "firebase/database";

export default {
  components: { OrganizationSidebar, OrganizationNavbar, QuizCard, SearchBar },

  data() {
    return {
      loading: true,
      isSidebarOpen: window.innerWidth >= 768, 
      searchQuery: "",
      quizzes: [],
      showDeletePopup: false,
      quizToDeleteId: null,
      organizationId: null, // Store organization ID dynamically
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
    async fetchOrganizationId() {
  const auth = getAuth();
  
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User not logged in");
        reject("No user");
        return;
      }

      try {
        this.organizationId = user.uid;  // ✅ Directly use user.uid as organizationId
        console.log("Fetched Organization ID:", this.organizationId);
        resolve(this.organizationId);
      } catch (error) {
        console.error("Error fetching organization ID:", error);
        reject(error);
      }
    });
  });
},
    fetchQuizzes() {
      if (!this.organizationId) return;
      this.loading = true;
   console.log("Fetching quizzes for organization:", this.organizationId); // 🔍 Debugging Log

      const db = getDatabase();
      const quizzesRef = ref(db, "organizationQuizzes");

      // Listen for real-time updates
      onValue(quizzesRef, (snapshot) => {
             console.log("Snapshot exists:", snapshot.exists()); // 🔍 Debugging Log
        if (snapshot.exists()) {
          const data = snapshot.val();
          // console.log("Fetched quizzes:", data); // 🔍 Debugging Log
          this.quizzes = Object.keys(data)
  .map((key) => ({ id: key, ...data[key] }))
  .filter((quiz) => {
    // console.log(`Checking quiz: ${quiz.organizationId}, Expected: ${this.organizationId}`);
    return String(quiz.organizationId) === String(this.organizationId);
  });

// console.log("Filtered quizzes after fix:", this.quizzes);
        } else {
          this.quizzes = [];
        }
        this.loading = false;
      });
    },

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
        const db = getDatabase();
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
    },
  },

  watch: {
    organizationId(newId) {
      console.log("Organization ID changed:", newId);
      this.fetchQuizzes();
    },
  },

  mounted() {
  window.addEventListener("resize", this.handleResize);
  console.log("Component Mounted: Fetching Organization ID");
  this.fetchOrganizationId()
    .then(() => {
      this.fetchQuizzes();
    })
    .catch((err) => console.error("Error fetching organization ID:", err));
},
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};

</script>

