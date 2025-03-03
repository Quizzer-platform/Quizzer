<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar (Always visible on large screens, Toggles on small screens) -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar (Always Visible) -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />
      <!-- Main Dashboard Content -->
      <main class="flex-1 p-4">
        <DashboardOverview />
        <QuizzesTable />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import DashboardOverview from "@/components/admin/AdminOverview.vue";
import QuizzesTable from "@/components/admin/AdminQuizList.vue";

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
    DashboardOverview,
    QuizzesTable,
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
