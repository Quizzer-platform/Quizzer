<template>
  <div class="mt-8 mx-6 bg-transparent mb-8">
    <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
      <h2 class="text-xl font-semibold text-teal-900 sm:pl-5">Quizzes Review</h2>
      <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
    </div>

    <!-- 🔹 Loading Spinner -->
    <div v-if="loading" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
    </div>

    <!-- Quizzes Table (Hidden While Loading) -->
    <TableStructure
      v-else
      :headers="['QUIZ ID', 'Name of Quiz', 'No. of Questions', 'Duration (mins)']"
      :rows="filteredQuizzes.map(quiz => [
        quiz.id,
        quiz.name,
        quiz.questions.length,
        quiz.duration 
      ])"
      :showActions="true"
      @view-details="editQuiz"
    />
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import SearchBar from "../layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
  data() {
    return {
      quizzes: [],
      searchQuery: "",
      organizationId: null,
      loading: true, // 🔹 Add loading state
    };
  },
  components: {
    SearchBar,
    TableStructure,
  },
  computed: {
    filteredQuizzes() {
      if (!this.searchQuery) return this.quizzes;
      const searchLower = this.searchQuery.toLowerCase();
      return this.quizzes.filter(quiz =>
        quiz.id.toLowerCase().includes(searchLower) ||  
        quiz.name.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    updateSearchQuery(query) {
      this.searchQuery = query;
    },

    async fetchOrganizationId() {
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            console.error("User not logged in");
            reject("No user");
            return;
          }
          this.organizationId = user.uid;
          resolve(this.organizationId);
        });
      });
    },

    async fetchQuizzes() {
      if (!this.organizationId) return;
      try {
        this.loading = true; // 🔹 Show the spinner
        const db = getDatabase();
        const quizzesRef = ref(db, "organizationQuizzes");
        const snapshot = await get(quizzesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          this.quizzes = Object.entries(data)
            .map(([id, quiz]) => ({
              id,
              name: quiz.title,  
              questions: quiz.questions || [],
              duration: quiz.duration || "N/A",
              organizationId: quiz.organizationId,
            }))
            .filter(quiz => String(quiz.organizationId) === String(this.organizationId));
        } else {
          this.quizzes = [];
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        this.loading = false; // 🔹 Hide the spinner after fetching
      }
    },

    editQuiz(quizId) {
      console.log("Navigating to Edit Quiz:", quizId);
      this.$router.push({ name: "editQuiz", params: { quizId } });
    },
  },
  async mounted() {
    try {
      await this.fetchOrganizationId();
      await this.fetchQuizzes();
    } catch (error) {
      console.error("Error initializing component:", error);
      this.loading = false; // 🔹 Ensure the spinner disappears on failure
    }
  },
};
</script>
