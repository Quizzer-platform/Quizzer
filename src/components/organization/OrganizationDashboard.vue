<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-[#1a202c]">
    <!-- Sidebar (Always visible on large screens, Toggles on small screens) -->
    <OrganizationSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50"
    />
    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar (Always Visible) -->
      <OrganizationNavbar @toggleSidebar="toggleSidebar" />
      <!-- Main Dashboard Content -->
      <main class="flex-1 p-4 sm:justify-center dark:bg-[#1a202c]">
        <DashboardOverview />
        <QuizzesTable />
        <SubscriptionTable />
      </main>
    </div>
  </div>
</template>

<script>
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import DashboardOverview from "@/components/organization/OrganizationOverview.vue";
import QuizzesTable from "@/components/organization/OrganizationQuizList.vue";
import SubscriptionTable from "@/components/organization/OrganizationSubscription.vue";

export default {
  components: {
    OrganizationSidebar,
    OrganizationNavbar,
    DashboardOverview,
    QuizzesTable,
    SubscriptionTable,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768, 
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      this.isSidebarOpen = window.innerWidth >= 768; 
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