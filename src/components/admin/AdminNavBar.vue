<template>
  <nav class="bg-white shadow-md p-4 flex justify-between items-center">
    <!-- Sidebar Toggle (Only on Small Screens) -->
    <button class="md:hidden text-2xl text-gray-700" @click="$emit('toggleSidebar')">
      ☰
    </button>

    <!-- Title -->
    <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>

    <!-- User Profile -->
    <div class="relative">
      <button @click="toggleDropdown" class="flex items-center space-x-2">
        <img :src="user.avatar" alt="User Avatar" class="w-8 h-8 rounded-full border">
        <span class="hidden md:inline text-gray-700">{{ user.name }}</span>
      </button>

      <!-- Dropdown Menu -->
      <!-- <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
        <ul class="py-2">
          <li>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
          </li>
          <li>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </li>
        </ul>
      </div> -->
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false,
      user: {
        name: "Admin",
        avatar: "https://via.placeholder.com/40",
      },
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    logout() {
      console.log("Logging out...");
    },
  },
};
</script>
