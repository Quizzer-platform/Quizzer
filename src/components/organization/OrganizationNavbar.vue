<template>
  <nav class="bg-white shadow-md p-4 flex justify-between items-center w-full max-w-full">
    <!-- Sidebar Toggle (Only on Small Screens) -->
    <button class="md:hidden text-2xl text-gray-700" @click="$emit('toggleSidebar')">
      ☰
    </button>

    <!-- Title -->
    <h1 class="text-xl font-bold text-gray-800 sm:text-center md:text-left flex-1">Organization Dashboard</h1>

    <!-- Organization Profile -->
    <div class="relative flex items-center pr-2 sm:pr-4">
      <button @click="toggleDropdown" class="flex items-center space-x-2">
        <img :src="user.avatar" alt="User Avatar" class="w-8 h-8 rounded-full border object-cover">
        <span class="hidden md:inline text-gray-700">{{ user.name }}</span>
      </button>
    </div>
  </nav>
</template>


<script>
export default {
  data() {
    return {
      dropdownOpen: false,
      user: {
        name: "Organization",
        avatar: "https://placehold.co/200x200/green/white",
      },
    };
  },
  // methods: {
  //   toggleDropdown() {
  //     this.dropdownOpen = !this.dropdownOpen;
  //   },
  //   logout() {
  //     console.log("Logging out...");
  //   },
  // },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>