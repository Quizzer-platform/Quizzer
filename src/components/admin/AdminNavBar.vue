<template>
  <nav 
    class="bg-white shadow-md transition-colors duration-300 p-4 flex justify-between items-center w-full max-w-full 
           dark:bg-[#151a24] dark:text-gray-200"
  >
    <!-- Sidebar Toggle (Only on Small Screens) -->
    <button 
      class="md:hidden text-2xl text-gray-700 cursor-pointer dark:text-gray-300"
      @click="$emit('toggleSidebar')"
    >
      ☰
    </button>

    <!-- Title -->
    <h1 class="text-xl font-bold text-gray-800 text-center flex-1 dark:text-teal-400">
      Admin Dashboard
    </h1>
  </nav>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>