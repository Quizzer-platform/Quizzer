<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar (Always visible on large screens, Toggles on small screens) -->
    <AdminSidebar
      :isOpen="isSidebarOpen"
      @toggleSidebar="toggleSidebar"
      class="fixed md:fixed z-50" />
    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Navbar (Always Visible) -->
      <AdminNavbar @toggleSidebar="toggleSidebar" />
      <!-- Main Dashboard Content -->
      <main class="flex-1 p-4">
        <div
          class="bg-white rounded-lg shadow-md mt-6 mx-4 md:mx-6 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center h-auto lg:h-60">
          <!-- Left Content -->
          <div class="max-w-2xl px-4 md:px-6 lg:px-10 text-center md:text-left">
            <h2
              class="text-2xl sm:text-3xl font-bold text-teal-900 mb-3 sm:mb-4">
              Time to Manage Your Quizzes!
            </h2>
            <p class="text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              ay motivation Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmodadipiscing elit, sed do eiusmod.
            </p>
            <div
              class="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                class="bg-teal-900 hover:bg-teal-700 text-white px-8 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                @click="createQuiz">
                CREATE QUIZ
              </button>
              <button
                class="bg-teal-900 hover:bg-teal-700 text-white px-8 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                @click="viewQuiz">
                VIEW / EDIT QUIZ
              </button>
              <button
                class="bg-teal-900 hover:bg-teal-700 text-white px-8 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                @click="createCategory">
               CREATE CATEGORY
              </button>
              <button
                class="bg-teal-900 hover:bg-teal-700 text-white px-8 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                @click="editCategory">
               VIEW / EDIT CATEGORY
              </button>
            </div>
          </div>

          <!-- Right Image -->
          <div class="mt-6 md:mt-0 flex justify-center md:justify-end w-full md:w-auto md:flex-1">
            <img src="../../assets/AdminImg.svg" alt="Dashboard Illustration"
                class="h-36 md:h-40 lg:h-44 xl:h-48 w-auto">
        </div>
        </div>
        <QuizzesTable />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminNavbar from '@/components/admin/AdminNavBar.vue';
import QuizzesTable from '@/components/admin/AdminQuizList.vue';

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
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
    },
    createQuiz() {
      this.$router.push('/admin/createQuiz');
    },
    viewQuiz() {
      this.$router.push('/admin/quizzes');
    },
    createCategory(){
      this.$router.push('/admin/categorycreation');
    },
    editCategory(){
      this.$router.push('/admin/categories');
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>
