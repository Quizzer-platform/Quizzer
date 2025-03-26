<template>
  <nav 
    class="bg-white shadow-md transition-colors duration-300 p-4 flex justify-start items-center w-full max-w-full 
           dark:bg-[#151a24] dark:text-gray-200"
  >
    <!-- Sidebar Toggle (Only on Small Screens) -->
    <button class="md:hidden text-gray-700 cursor-pointer dark:text-gray-300" @click="$emit('toggleSidebar')">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
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