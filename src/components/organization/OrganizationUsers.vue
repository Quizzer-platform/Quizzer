<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50"
    />
    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" />
      
      <!-- Main Content -->
      <main class="flex-1 p-4">
        <DashboardOverview />

        <!-- User Review Section -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800">User Review</h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-170" @search="updateSearchQuery" />
          </div>

          <!-- Loading Spinner -->
          <div v-if="loading" class="flex justify-center my-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-900"></div>
          </div>

          <!-- Table (Hidden While Loading) -->
          <TableStructure 
            v-else
            :headers="['User Id', 'User Name', 'Last Quiz', 'Degree']" 
            :rows="filteredUsers.map(user => [user.id, user.name, user.lastQuiz, user.degree])" 
            :showActions="true"
            @view-details="goToUserDetails"
          />
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import DashboardOverview from "@/components/organization/OrganizationOverView.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";

export default {
  components: {
    OrganizationSidebar,
    OrganizationNavbar,
    DashboardOverview,
    SearchBar,
    TableStructure,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768, 
      searchQuery: "",
      users: [], // Stores fetched users
      organization: null, // Organization name of the logged-in org admin
      loading: true, // Spinner state
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    async fetchOrganization() {
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            console.error("User not logged in");
            reject("No user");
            return;
          }
          
          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            this.organization = userData.organization; // Get organization name
            console.log("Fetched Organization Name:", this.organization);
            resolve(this.organization);
          } else {
            console.error("Organization admin data not found in users collection.");
            reject("No organization found");
          }
        });
      });
    },
    async fetchUsers() {
  if (!this.organization) return; // Ensure organization is set
  try {
    this.loading = true; // Show spinner

    const db = getDatabase();
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      this.users = Object.entries(data)
        .map(([id, user]) => ({
          id,
          name: user.name || "Unknown",
          lastQuiz: user.lastQuiz || "No Quiz Taken",
          degree: user.degree || "N/A",
          organization: user.organization, // Ensure we use organization name
          role: user.role // Include role for filtering
        }))
        .filter(user => 
          user.organization === this.organization && // Compare with organization name
          user.role !== "organization_admin" // Exclude organization admins
        );

      console.log("Filtered users:", this.users);
    } else {
      this.users = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    this.loading = false; // Hide spinner
  }
},
    goToUserDetails(userId) {
      this.$router.push(`/organization/user/${userId}`);
    },
  },
  async mounted() {
    try {
      await this.fetchOrganization();
      await this.fetchUsers();
    } catch (error) {
      console.error("Error initializing component:", error);
      this.loading = false; // Hide spinner if an error occurs
    }
  },
};
</script>
