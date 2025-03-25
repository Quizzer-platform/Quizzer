<template>
  <main class="flex-1 p-6">
    <hr class="border-gray-400 mb-1 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

    <!-- Subscriptions Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
      <h3 class="text-xl font-semibold text-teal-900 dark:text-teal-300 sm:pl-5">Subscriptions</h3>
      <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
    </div>
    <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mt-4">Loading subscription details...</p>
            </div>
    <!-- Show message if no subscriptions exist -->
    <!-- No Subscriptions Message -->
<div v-else-if="subscriptions.length === 0" class="text-center bg-gray-100 dark:bg-gray-800 dark:text-gray-300 text-gray-700 p-4 rounded-lg shadow-md">
  <p class="text-lg font-semibold">You have no subscriptions yet.</p>
  <p class="text-sm text-teal-900 dark:text-teal-600 sm:pl-5 font-semibold focus:outline-none">
    Explore our 
    <router-link to="/pricing" class="text-teal-300 font-semibold hover:underline">
      plans
    </router-link> 
    to get started!
  </p>
</div>
    <!-- Subscriptions Table -->
    <TableStructure 
      v-else
      :headers="['Name of Plan', 'Quizzes', 'Price', 'Description']" 
      :rows="filteredSubscriptions
        .filter(s => s.name && s.maxQuizzes && s.price && s.description) 
        .map(s => [s.name, s.maxQuizzes, s.price, s.description])"
      :showActions="false"
    />
     <!-- Pagination controls -->
        <div v-if="subscriptions.length > 0" class="flex justify-center gap-2 p-4">
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
  </main>
</template>

<script>
import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import { ref as dbRef, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/firebase";

export default {
  components: {
    TableStructure,
    SearchBar,
  },
  data() {
    return {
      searchQuery: "",
      subscriptions: [], // ✅ Data fetched dynamically
      orgId: null, // ✅ Logged-in organization ID
      loading: true,
      currentPage: 1,
      perPage: 8
    };
  },
  computed: {
    filteredSubscriptions() {
      if (!this.searchQuery) return this.subscriptions;
      const query = this.searchQuery.toLowerCase();
      return this.subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        sub.maxQuizzes.toString().includes(query) ||
        sub.price.toLowerCase().includes(query) ||
        sub.description.toLowerCase().includes(query)
      );
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredSubscriptions.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredSubscriptions.length / this.perPage);
    }
  },
  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.fetchOrganizationId(user.uid);
      }
    });
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
  resetPagination() {
      this.currentPage = 1;
  },
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    async fetchOrganizationId(userId) {
      this.loading = true;
      try {
        const usersRef = dbRef(database, `users/${userId}`);
        const userSnapshot = await get(usersRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          this.orgId = userData.organizationId;
          if (this.orgId) {
            await this.fetchSubscriptions();
          } else {
            console.warn("Organization ID not found for this user.");
          }
        } else {
          console.warn("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching organization ID:", error);
      } finally { 
        this.loading = false;
      }
    },
    async fetchSubscriptions() {
  if (!this.orgId) return;

  try {
    const orgRef = dbRef(database, `organizations/${this.orgId}`);
    const snapshot = await get(orgRef);
    if (snapshot.exists() && snapshot.val().plans) {
      const plans = snapshot.val().plans.slice(1); // Ignore the first element
      this.subscriptions = plans.map((plan) => ({
        name: plan.name || "No Name",
        maxQuizzes: plan.noOfQuizzes || "N/A",
        price: plan.price ? `${plan.price}` : "EGP 0",
        description: plan.description || "No description available",
      }));
    } else {
      console.warn("No subscriptions found for this organization.");
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
  }
},
  },
};
</script>
