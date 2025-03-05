<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar (Always visible on large screens, Toggles on small screens) -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar (Always Visible) -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" />
      <!-- Main Dashboard Content -->
      <main class="flex-1 p-4">
        <DashboardOverview />
        <!-- User Review Section -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800">User Review</h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-170" />
            <!-- Search Bar (Aligned) -->
          </div>

          <!-- Table -->
          <TableStructure 
            :headers="['User Id', 'User Name', 'Last Quiz', 'Degree']" 
            :rows="filteredReviews.map(r => [r.id, r.userName, r.lastQuiz, r.degree])" 
            :showActions="true"
            @view-details="goToUserDetails"
            />

        </div>
      </main>
    </div>
  </div>
</template>

<script>
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
        userReview: [
        { id: 1, userName: "Andrew Samir", lastQuiz: "Front-end", degree: "30/5/2025" },
        { id: 2, userName: "Ethar Mohamed", lastQuiz: "Back-end", degree: "5/3/2025" },
        { id: 3, userName: "Shereen Shawky", lastQuiz: "Cyber", degree: "30/5/2025" },
        { id: 4, userName: "Rawan Magdy Ahmed", lastQuiz: "Ai", degree: "5/3/2025" },
      ],
    };
    },
  computed: {
    filteredReviews() {
      return this.userReview.filter(review =>
        review.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      this.isSidebarOpen = window.innerWidth >= 768; 
      },
    goToUserDetails(userId) {
    this.$router.push(`/organization/user/${userId}`); // Navigate to the user details page
  }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>