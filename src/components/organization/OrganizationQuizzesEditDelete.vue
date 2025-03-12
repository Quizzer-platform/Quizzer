<template>
  <div class="flex min-h-screen bg-gray-100">
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
          <h2 class="text-xl font-semibold text-teal-900">Edit Quizzes</h2>

          <!-- Search Bar -->
          <SearchBar class="w-full sm:w-64" @search="updateSearchQuery" />

          <!-- Create Quiz Button -->
          <button class="bg-teal-700 text-white text-center px-2 sm:px-10 py-2 rounded-md hover:bg-teal-900 cursor-pointer transition-all"  @click="createQuiz">
            ➕ Create Quiz
          </button>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center mt-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>

        <!-- Quiz Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-2 sm:px-4 w-full mx-auto justify-items-center overflow-x-hidden">
          <QuizCard 
            v-for="quiz in filteredQuizzes" 
            :key="quiz.id" 
            :quiz="quiz" 
            @edit="editQuiz" 
            @delete="confirmDelete(quiz.id)"
            class="w-full sm:w-80 max-w-full flex-grow-0"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeletePopup" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600/75">
      <div class="bg-white p-6 rounded-lg shadow-md mx-4 max-w-sm w-full">
        <p class="text-lg font-semibold mb-4">Are you sure you want to delete this quiz?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteQuiz" class="bg-red-500 text-white px-4 py-2 rounded-lg">Yes, Delete</button>
          <button @click="showDeletePopup = false" class="bg-gray-300 px-4 py-2 text-teal-800 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Subscription Modal -->
<div v-if="showSubscriptionModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
  <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
    <h2 class="text-xl font-bold text-red-600 mb-4">Subscription Required</h2>
    <p class="text-gray-700 mb-4">{{ subscriptionMessage }}</p>
    <div class="flex justify-center gap-4">
      <button 
        @click="showSubscriptionModal = false"
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
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