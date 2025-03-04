<template>
  <div class="flex h-full bg-gray-100">
    <!-- Sidebar (Always visible on large screens, Toggles on small screens) -->
    <AdminSidebar 
      :isOpen="isSidebarOpen" 
      @toggleSidebar="toggleSidebar"
      class="fixed md:relative md:block z-50"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-x-hidden">
      <!-- Navbar -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 p-4 overflow-x-hidden">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
              <h2 class="text-xl font-semibold text-teal-900 sm:pl-5">Organizations</h2>
          <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-160" />
        </div>

        <!-- Organizations Table -->
        <DynamicTable 
          :headers="orgHeaders" 
          :rows="orgData" 
          class="w-full max-w-5xl mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminNavbar from "@/components/admin/AdminNavBar.vue";
import SearchBar from "@/components/layout/Searchbar.vue";
import DynamicTable from "@/components/admin/TableStructure.vue";

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
    SearchBar,
    DynamicTable,
  },
  data() {
    return {
      isSidebarOpen: window.innerWidth >= 768, // Sidebar is open by default on larger screens
      orgHeaders: ["Org. Id", "Name of Org", "No. Quizzes", "Due Date"],
      orgData: [
        [1, "Valeo", 10, "30/5/2025"],
        [2, "Huawei", 30, "5/3/2025"],
        [3, "ITI", 25, "27/7/2025"],
        [4, "Orange", 15, "20/8/2025"],
        [5, "Orange", 15, "20/8/2025"],
        [6, "Orange", 15, "20/8/2025"],
      ],
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

<style scoped>
/* Add custom styles if needed */
</style>