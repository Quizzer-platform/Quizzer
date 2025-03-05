<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />

      <!-- Organization Details Content -->
      <main class="flex-1 p-6">
        <h2 class="text-xl font-semibold text-teal-900 sm:pl-5">
          Organization Details: {{ selectedOrg ? selectedOrg.name : 'Not Found' }}
        </h2>

        <!-- Organization Info -->
        <div v-if="selectedOrg" class="bg-teal-100 p-6 rounded-lg shadow-md flex items-center mt-4">
          <img :src="selectedOrg.image" alt="Organization Logo" class="w-40 h-40 rounded-full object-cover mr-6">
          <div>
            <h2 class="text-2xl font-bold">{{ selectedOrg.name }}</h2>
            <p class="text-gray-600 mt-2">{{ selectedOrg.description }}</p>
            <p class="mt-2"><strong>Total Bundles:</strong> {{ selectedOrg.bundles }}</p>
            <p><strong>Total Quizzes:</strong> {{ selectedOrg.quizzes }}</p>
          </div>
        </div>

        <!-- Subscriptions Table -->
        <h3 class="text-xl font-bold mt-8 mb-3">Subscriptions</h3>
        <TableStructure 
          :headers="['ID', 'Price', 'Quizzes', 'Due Date']" 
          :rows="subscriptions.map(s => [s.id, s.price, s.quizzes, s.due])" 
        />

        <!-- Created Quizzes Table -->
        <h3 class="text-xl font-bold mt-8 mb-3">Created Quizzes</h3>
        <TableStructure
          :headers="['QUIZ ID', 'Name of Quiz', 'No. takes', 'Date']"
          :rows="quizzes.map(quiz => [quiz.id, quiz.name, quiz.takes, quiz.date])"
          :showActions="true"
        />
      </main>
    </div>
  </div>
</template>

<script>
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
      orgData: [
        { id: 1, name: "Valeo", description: "Description for Valeo", bundles: 10, quizzes: 13, image: "https://placehold.co/200x200/green/white" },
        { id: 2, name: "Huawei", description: "Description for Huawei", bundles: 30, quizzes: 20, image: "https://placehold.co/200x200/green/white" },
        { id: 3, name: "ITI", description: "Description for ITI", bundles: 25, quizzes: 18, image: "https://placehold.co/200x200/green/white" },
        { id: 4, name: "Orange", description: "Description for Orange", bundles: 15, quizzes: 22, image: "https://placehold.co/200x200/green/white" },
      ],
      selectedOrg: null,
      subscriptions: [
        { id: 1, price: "$30", quizzes: 10, due: "30/5/2025" },
        { id: 2, price: "$50", quizzes: 30, due: "5/3/2025" },
      ],
      quizzes: [
        { id: 1, name: "HTML Fundamentals", takes: 10, date: "30/5/2025" },
        { id: 2, name: "CSS Basics", takes: 8, date: "5/3/2025" },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      this.isSidebarOpen = window.innerWidth >= 768;
    },
    loadOrganizationDetails() {
      const orgId = Number(this.$route.params.id);
      this.selectedOrg = this.orgData.find(org => org.id === orgId) || null;
    }
  },
  watch: {
    "$route.params.id": "loadOrganizationDetails",
  },
  mounted() {
    this.loadOrganizationDetails();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
