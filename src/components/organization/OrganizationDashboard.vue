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
        <QuizzesTable />
        <SubscriptionTable />
      </main>
    </div>
  </div>
</template>

<script>
import OrganizationSidebar from "@/components/organization/OrganizationSidebar.vue";
import OrganizationNavbar from "@/components/organization/OrganizationNavbar.vue";
import DashboardOverview from "@/components/organization/OrganizationOverView.vue";
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