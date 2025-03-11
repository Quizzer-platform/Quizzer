<template>
  <main class="flex-1 p-6">
    <hr class="border-gray-400 mb-1 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />
    
    <!-- Subscriptions Table -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
      <h3 class="text-xl font-semibold text-teal-900 sm:pl-5">Subscriptions</h3>
      <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" @search="updateSearchQuery" />
    </div>
    
    <TableStructure 
  :headers="['Name of Plan', 'Quizzes', 'Price', 'Description']" 
  :rows="filteredSubscriptions
    .filter(s => s.name && s.maxQuizzes && s.price && s.description) 
    .map(s => [s.name, s.maxQuizzes, s.price, s.description])"
  :showActions="false"
/>

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
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    async fetchOrganizationId(userId) {
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
