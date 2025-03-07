<template>
  <div class="mt-8 mx-6 bg-transparent mb-8">
    <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
      <h2 class="text-xl font-semibold text-teal-900 sm:pl-5">Quizzes Review</h2>
      <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
    </div>

    <!-- Quizzes Table (Now correctly using filtered data) -->
    <TableStructure
      :headers="['QUIZ ID', 'Name of Quiz', 'No. of Questions']"
      :rows="filteredQuizzes.map(quiz => [quiz.id, quiz.name, quiz.questions.length])" 
      :showActions="true"
    />
  </div>
</template>

<script>
import SearchBar from '../layout/Searchbar.vue';
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
  data() {
    return {
      quizzes: [],
      searchQuery: "",
      testOrganizationId: "test-org-123",
    };
  },
  components: {
    SearchBar,
    TableStructure,
  },
  computed: {
    filteredQuizzes() {
      if (!this.searchQuery) return this.quizzes; // If no search query, return all quizzes

      const searchLower = this.searchQuery.toLowerCase();

      return this.quizzes.filter(quiz =>
        quiz.id.toLowerCase().includes(searchLower) ||  // Filter by ID
        quiz.name.toLowerCase().includes(searchLower)   // Filter by Name
      );
    }
  },
  async mounted() {
    await this.fetchQuizzes();
  },
  methods: {
    updateSearchQuery(query) {
      this.searchQuery = query;  // Correctly updating the search query
    },

    async fetchQuizzes() {
      try {
        const response = await fetch(
          `https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json`
        );
        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data = await response.json();
        if (!data) return;

        // Convert object into array and filter by the testOrganizationId
        this.quizzes = Object.entries(data)
          .map(([id, quiz]) => ({
            id,
            name: quiz.title,  // Ensure `name` matches what you're displaying
            questions: quiz.questions || [],
            organizationId: quiz.organizationId,
          }))
          .filter(quiz => quiz.organizationId === this.testOrganizationId);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    },
  },
};
</script>
