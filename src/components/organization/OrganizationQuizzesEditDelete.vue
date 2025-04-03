<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
    <!-- Fixed Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50 h-screen w-64 overflow-y-auto" 
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64 min-h-screen">
      <!-- Navbar -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" class="sticky top-0 z-40" />

      <!-- Page Content -->
      <div class="flex-1 p-4">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2 text-center sm:text-left">
          <h2 class="text-xl font-semibold text-teal-900 dark:text-teal-400">Edit Quizzes</h2>

          <!-- Search Bar -->
          <SearchBar class="w-full sm:w-64" @search="updateSearchQuery" />

          <!-- Create Quiz Button -->
          <button class="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-800 w-1/2 sm:w-auto cursor-pointer"  @click="createQuiz">
            ➕ Create Quiz
          </button>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading quizzes...</p>
            </div>
        <!-- Quiz Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          <QuizCard 
            v-for="quiz in paginatedData" 
            :key="quiz.id" 
            :quiz="quiz" 
            @edit="editQuiz" 
            @delete="confirmDelete(quiz.id)"
          />
        </div>
        <!-- Pagination controls for org quizzes -->
        <div v-if="quizzes.length > 0" class="flex justify-center gap-2 p-4 mt-2">
              <button @click="prevPage" :disabled="currentPage === 1"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Previous
              </button>
              <span class="px-4 py-2 text-sm font-medium text-teal-700">
                  Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-md hover:bg-teal-500 disabled:opacity-50 cursor-pointer">
                  Next
              </button>
          </div>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75">
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mx-4 max-w-sm w-full">
        <p class="text-lg font-semibold text-center dark:text-white mb-4">Are you sure you want to delete this quiz?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteQuiz" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer">Yes, Delete</button>
          <button @click="showDeletePopup = false" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 text-teal-800 rounded-lg cursor-pointer">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Subscription Modal -->
<div v-if="showSubscriptionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
  <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center w-xl">
    <h2 class="text-xl font-bold text-red-700 mb-4">Subscription Required</h2>
    <p class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">{{ subscriptionMessage }}</p>
    <div class="flex justify-center gap-4">
      <button 
        @click="showSubscriptionModal = false"
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors cursor-pointer"
      >
        Close
      </button>
      <router-link 
        to="/pricing" 
        class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
      >
        View Plans
      </router-link>
    </div>
  </div>
</div>
  </div>
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
      showSubscriptionModal: false,
      subscriptionMessage: '',
      currentPage: 1,
      perPage: 6
    };
  },

  computed: {
    filteredQuizzes() {
      return this.quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedData() {
          const start = (this.currentPage - 1) * this.perPage;
          const end = start + this.perPage;
          return this.filteredQuizzes.slice(start, end);
      },
    totalPages() {
        return Math.ceil(this.filteredQuizzes.length / this.perPage);
    }
  },

  methods: {
    visiblePages() {
            // Create an array of page numbers to display, similar to front-end implementation
            // This shows a maximum of 5 pages at a time
            const startPage = Math.max(
                1,
                Math.min(this.currentPage - 2, this.totalPages - 4)
            );
            const endPage = Math.min(startPage + 4, this.totalPages);

            return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            );
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    async fetchOrganizationId() {
  const auth = getAuth();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.organizationId = user.uid;
        resolve(user.uid);
      }
    });
  });
},
    fetchQuizzes() {
  if (!this.organizationId) return;
  this.loading = true;

  const db = getDatabase();
  const quizzesRef = ref(db, "organizationQuizzes");

  onValue(quizzesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      this.quizzes = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((quiz) => 
          quiz.organizationUid === this.organizationId // Changed from organizationId to organizationUid
        );
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

    async createQuiz() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Please login to create quizzes');
      return;
    }

    // Fetch ALL organizations
    const orgResponse = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json');
    const orgsData = await orgResponse.json();
    
    // Find organization manually
    const organizationKey = Object.keys(orgsData || {}).find(
      key => orgsData[key].adminUid === user.uid
    );

    if (!organizationKey) {
      alert('Organization not found');
      return;
    }

    const organization = orgsData[organizationKey];

    // ✅ Calculate total allowed quizzes by summing all plan quotas
    let totalAllowed = 0;
    if (organization.plans) {
      Object.values(organization.plans).forEach(plan => {
        totalAllowed += Number(plan.noOfQuizzes) || 0;
      });
    }

    console.log(`Total allowed quizzes: ${totalAllowed}`);

    // ✅ Fetch the actual quiz count directly from Firebase
    const quizResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json`);
    const quizData = await quizResponse.json();

    // ✅ Filter quizzes that belong to this organization
    const currentQuizzes = Object.values(quizData || {}).filter(
      quiz => quiz.organizationUid === user.uid
    ).length;

    console.log(`Current quizzes: ${currentQuizzes}, Allowed: ${totalAllowed}`);

    // ❌ Prevent quiz creation if limit is reached
    if (totalAllowed === 0) {
    this.subscriptionMessage = `You haven't subscribed to a plan yet. Please choose a plan to start creating quizzes.`;
    this.showSubscriptionModal = true;
    return;
}

if (currentQuizzes >= totalAllowed) {
    this.subscriptionMessage = `You've created ${currentQuizzes}/${totalAllowed} allowed quizzes. Upgrade your plan to add more.`;
    this.showSubscriptionModal = true;
    return;
}

    // ✅ Only navigate if within limit
    this.$router.push('/organization/createQuiz');
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error checking quota. Please try again.');
  }
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
    // 1. Delete from organizationQuizzes
    await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes/${this.quizToDeleteId}.json`, {
      method: "DELETE",
    });

    // 2. Find organization key using adminUid
    const orgsResponse = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json');
    const orgsData = await orgsResponse.json();
    
    const organizationKey = Object.keys(orgsData).find(
      key => orgsData[key].adminUid === this.organizationId
    );

    if (!organizationKey) {
      throw new Error("Organization not found!");
    }

    // 3. Update organization metadata
    const orgRef = `organizations/${organizationKey}`;
    const currentData = orgsData[organizationKey];
    
    const updatedData = {
      quizzes: Math.max((currentData.quizzes || 0) - 1, 0), // Ensure never goes negative
      quizList: (currentData.quizList || []).filter(id => id !== this.quizToDeleteId)
    };

    await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/${orgRef}.json`, {
      method: 'PATCH',
      body: JSON.stringify(updatedData)
    });

    // 4. Update UI
    this.quizzes = this.quizzes.filter(quiz => quiz.id !== this.quizToDeleteId);
    
  } catch (error) {
    console.error("Error deleting quiz:", error);
    alert("Failed to delete quiz. Please try again.");
  }

  // 5. Reset state
  this.showDeletePopup = false;
  this.quizToDeleteId = null;
}
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

<style>
/* Add this CSS to your component or global styles */
@media (max-width: 767px) {
  .fixed.h-screen {
    position: fixed;
    height: 100vh !important;
    overflow-y: auto;
  }
}
/* Add smooth transition for modal */
.fixed {
  transition: opacity 0.3s ease;
}
</style>