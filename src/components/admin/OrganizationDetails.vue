<template>
  <div class="flex min-h-screen w-full bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar
      :isOpen="isSidebarOpen"
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50 h-full"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64 w-full">
      <!-- Navbar -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />

      <!-- Organization Details Content -->
      <main class="flex-1 p-6 w-full">
        <!-- Show Loading Spinner -->
        <div v-if="loading" class="flex justify-center my-10">
          <svg
            class="animate-spin h-10 w-10 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>

        <!-- Show No Data Message -->
        <div v-else-if="!selectedOrg" class="text-center text-gray-500">
          Organization not found.
        </div>

        <!-- Organization Info -->
        <div v-else class="bg-white p-6 rounded-lg shadow-md mt-4 w-full">
          <div class="flex flex-col space-y-4">
            <!-- Organization Name -->
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-bold text-teal-700">{{ selectedOrg.name }}</h2>
              <p class="mt-1 text-gray-600"><strong>ID:</strong> {{ selectedOrg.id || 'N/A' }}</p>
              <p class="mt-1 text-gray-600"><strong>Admin Email:</strong> {{ selectedOrg.adminEmail || 'N/A' }}</p>
              <p class="mt-1 text-gray-600"><strong>Admin Phone:</strong> {{ selectedOrg.adminPhone || 'N/A' }}</p>
            </div>

            <!-- Stats Section -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-teal-50 p-4 rounded-lg">
              <div class="text-center">
                <p class="text-xl font-semibold text-teal-700">{{ selectedOrg.members || 0 }}</p>
                <p class="text-gray-600">Total Members</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-semibold text-teal-700">{{ quizzes.length }}</p>
                <p class="text-gray-600">Total Quizzes</p>
              </div>
            </div>

            <!-- Subscription Plans -->
<div class="mt-6 w-full">
  <h3 class="text-xl font-bold text-gray-800">Subscription Plans</h3>

  <div v-if="selectedOrg.plans && Object.values(selectedOrg.plans).length > 1" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="(plan, index) in Object.values(selectedOrg.plans).slice(1)" 
      :key="index"
      class="bg-teal-100 p-4 rounded-lg shadow-md"
    >
      <h4 class="text-lg font-semibold text-teal-800">{{ plan.name }}</h4>
      <p class="text-gray-700">{{ plan.description }}</p>
      <p class="text-teal-900 font-medium">Price: {{ plan.price }}</p>
      <p class="text-gray-600">Quizzes Allowed: {{ plan.noOfQuizzes }}</p>
    </div>
  </div>

  <!-- Show this message if there are no plans after the first one -->
  <p v-else class="text-gray-500 text-center mt-3">This organization has no additional plans yet.</p>
</div>


          </div>
        </div>

        <!-- Created Quizzes Section -->
        <div class="mt-8 w-full">
          <div class="flex flex-col md:flex-row justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800">Created Quizzes</h3>
            <SearchBar class="w-full md:w-auto mt-2 md:mt-0" v-model="searchQuery" />
          </div>

          <!-- No Quizzes Message -->
          <div v-if="quizzes.length === 0" class="text-center text-gray-500 mt-6">
            No quizzes available.
          </div>

          <!-- Quizzes Table -->
          <TableStructure
            v-else
            :headers="['QUIZ ID', 'Name of Quiz', 'No. Questions', 'Duration (mins)']"
            :rows="filteredQuizzes.map(quiz => [quiz.id, quiz.name, quiz.numberOfQuestions, quiz.duration])"
            :showActions="true"
            @view-details="editQuiz"
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
import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue";

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
    TableStructure,
    SearchBar,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768,
      searchQuery: "",
      selectedOrg: null,
      quizzes: [],
      loading: true,
    };
  },
  computed: {
    filteredQuizzes() {
      return this.quizzes.filter(quiz =>
        quiz.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    
    async fetchOrganizationDetails() {
      const orgId = this.$route.params.id;
      if (!orgId) return;

      try {
        this.loading = true;
        const db = getDatabase();

        // Fetch Organization Details
        const orgRef = ref(db, `organizations/${orgId}`);
        const orgSnap = await get(orgRef);

        if (orgSnap.exists()) {
          this.selectedOrg = orgSnap.val();
        } else {
          console.error("Organization not found");
          this.selectedOrg = null;
          this.loading = false;
          return;
        }

        // Fetch Organization's Quizzes
        const quizzesRef = ref(db, "organizationQuizzes");
        const quizzesSnap = await get(quizzesRef);

        if (quizzesSnap.exists()) {
          const quizzesData = quizzesSnap.val();
          this.quizzes = Object.keys(quizzesData)
            .map((key) => ({ id: key, ...quizzesData[key] }))
            .filter((quiz) => String(quiz.organizationId) === String(this.selectedOrg.adminUid))
            .map(quiz => ({
              id: quiz.id,
              name: quiz.title || "Untitled Quiz",
              numberOfQuestions: quiz.numberOfQuestions || 0,
              duration: quiz.duration || "N/A"
            }));
        } else {
          this.quizzes = [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    editQuiz(quizId) {
      this.$router.push({ name: "editQuiz", params: { quizId } });
    }
  },
  watch: {
    "$route.params.id": "fetchOrganizationDetails",
  },
  async mounted() {
    window.addEventListener("resize", this.handleResize);
    await this.fetchOrganizationDetails();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
