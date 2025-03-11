<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />

      <!-- Organization Details Content -->
      <main class="flex-1 p-6">
        <!-- Show Loading Spinner -->
        <div v-if="loading" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
        </div>

        <!-- Show No Data Message -->
        <div v-else-if="!selectedOrg" class="text-center text-gray-500">
          Organization not found.
        </div>

        <!-- Organization Info (Without Description) -->
        <div v-else class="bg-teal-100 p-6 rounded-lg shadow-md  mt-4 flex   items-center justify-between flex-wrap">
          <!-- <img :src="selectedOrg.image || 'https://placehold.co/200x200/green/white'" 
            alt="Organization Logo" 
            class="w-40 h-40 rounded-full object-cover mr-6"> -->
          
            <div  >
            <div>
              <h2 class="text-2xl font-bold">{{ selectedOrg.name }}</h2>
            <p class="mt-2"><strong>ID:</strong> {{ selectedOrg.id || 0 }}</p>
            </div>
            <p class="mt-2"><strong>Total Bundles:</strong> {{ selectedOrg.bundles || 0 }}</p>
              <p><strong>Total Quizzes:</strong> {{ quizzes.length }}</p></div>

            
          
        </div>

        <!-- Created Quizzes Table -->
        <h3 class="text-xl font-bold mt-8 mb-3">Created Quizzes</h3>

        <!-- Show No Quizzes Message -->
        <div v-if="quizzes.length === 0" class="text-center text-gray-500">
          No quizzes available.
        </div>

        <TableStructure
          v-else
          :headers="['QUIZ ID', 'Name of Quiz', 'No. Questions', 'Duration (mins)']"
          :rows="quizzes.map(quiz => [quiz.id, quiz.name, quiz.numberOfQuestions, quiz.duration])"
          :showActions="true"
          @view-details="editQuiz"
        />
      </main>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
    TableStructure,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768,
      selectedOrg: null,
      quizzes: [],
      loading: true,
    };
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
      console.log("Organization Data:", this.selectedOrg);
    } else {
      console.error("Organization not found");
      this.selectedOrg = null;
      this.loading = false;
      return;
    }

    // Get adminUid from the fetched organization
    const adminUid = this.selectedOrg.adminUid;
    console.log("Admin UID for filtering quizzes:", adminUid);

    // Fetch Organization's Quizzes
    const quizzesRef = ref(db, "organizationQuizzes");
    const quizzesSnap = await get(quizzesRef);

    if (quizzesSnap.exists()) {
      const quizzesData = quizzesSnap.val();
      console.log("Raw Quizzes Data:", quizzesData);

      this.quizzes = Object.keys(quizzesData)
        .map((key) => ({ id: key, ...quizzesData[key] }))
        .filter((quiz) => {
          console.log(`Quiz ${quiz.id} OrgID:`, quiz.organizationId, "Expected:", adminUid);
          return String(quiz.organizationId) === String(adminUid);
        })
        .map(quiz => ({
          id: quiz.id,
          name: quiz.title || "Untitled Quiz",
          numberOfQuestions: quiz.numberOfQuestions || 0,
          duration: quiz.duration || "N/A"
        }));

      console.log("Filtered Quizzes:", this.quizzes);
    } else {
      console.warn("No quizzes found.");
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
