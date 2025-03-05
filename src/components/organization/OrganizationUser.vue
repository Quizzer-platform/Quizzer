<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" />

      <!-- User Details Content -->
      <main class="flex-1 p-6">
        <!-- User Info --> 
        <!-- User Info -->
<div v-if="selectedUser" class="bg-teal-100 p-6 rounded-lg shadow-md mt-4">
  <div class="flex flex-col md:flex-row items-center md:justify-between">
    
    <!-- Profile Image & Basic Info (Stacked on Small Screens) -->
    <div class="flex flex-col items-center md:flex-row">
      <img 
        :src="selectedUser.image" 
        alt="User Profile" 
        class="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
      />
      
      <div class="text-center md:text-left">
        <h2 class="text-2xl font-bold">{{ selectedUser.name }}</h2>
        <p class="mt-1">Joined at: {{ selectedUser.joinedDate }}</p>

        <div class="mt-3 text-sm">
          <p class="font-semibold">Contact Info</p>
          <p>Email: {{ selectedUser.email }}</p>
          <p>Phone: {{ selectedUser.phone }}</p>
        </div>
      </div>
    </div>

    <!-- User Stats (Centered on Small Screens) -->
    <div class="mt-4 md:mt-0 text-center md:text-right">
      <p class="font-semibold">Rank: {{ selectedUser.rank }}</p>
      <p>Total No of Quizzes: {{ selectedUser.totalQuizzes }}</p>
    </div>
  </div>
</div>


        <!-- User Review Section -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-gray-800">User Review</h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-170" />
            <!-- Search Bar (Aligned) -->
          </div>

          <!-- Table -->
          <TableStructure 
            :headers="['Quiz Code', 'Quiz Name', 'Degree', 'Date']" 
            :rows="filteredReviews.map(r => [r.code, r.quizName, r.degree, r.date])" 
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue"

export default {
  components: {
    OrganizationSidebar,
    OrganizationNavbar,
    TableStructure,
    SearchBar,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768,
      searchQuery: "",
      userData: [
        {
          id: 1,
          name: "Andrew Samir",
          joinedDate: "September 4, 2023",
          email: "andrew@gmail.com",
          phone: "01234567891",
          rank: 1200,
          totalQuizzes: 10,
          image: "https://placehold.co/100x100/green/white"
        },
        {
          id: 2,
          name: "John Doe",
          joinedDate: "June 10, 2022",
          email: "johndoe@gmail.com",
          phone: "01234567892",
          rank: 950,
          totalQuizzes: 8,
          image: "https://placehold.co/100x100/green/white"
        }
      ],
      selectedUser: null,
      userReview: [
        { code: 158216, quizName: "Front-end", degree: "35/40", date: "30/5/2025" },
        { code: 158216, quizName: "Back-end", degree: "35/40", date: "5/3/2025" },
        { code: 158216, quizName: "Cyber", degree: "35/40", date: "30/5/2025" },
        { code: 158216, quizName: "AI", degree: "35/40", date: "5/3/2025" },
      ],
    };
  },
  computed: {
    filteredReviews() {
      return this.userReview.filter(review =>
        review.quizName.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    loadUserDetails() {
      const userId = Number(this.$route.params.id);
      this.selectedUser = this.userData.find(user => user.id === userId) || null;
    }
  },
  watch: {
    "$route.params.id": "loadUserDetails",
  },
  mounted() {
    this.loadUserDetails();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
