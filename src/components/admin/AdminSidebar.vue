<template>
  <div 
    class="fixed h-screen bg-teal-900 text-white w-64 transition-colors duration-300
            dark:bg-[#151a24] min-h-screen dark:text-gray-200"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="flex items-center justify-between p-4 ">
    <button class="md:hidden text-white text-xl cursor-pointer" @click="toggleSidebar">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
</button>

    <!-- Updated QUIZZER Text Color -->
    <h2 class="text-2xl font-bold p-6 text-teal-300 dark:text-teal-400">QUIZZER</h2>

    <!-- Toggle Switch -->
    <!-- Dark Mode Button -->
<button @click="toggleDarkMode"
    class="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 cursor-pointer">
    
    <!-- Toggle Knob -->
    <div class="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform duration-300 transform"
        :class="{ 'translate-x-6': isDarkMode, 'translate-x-0': !isDarkMode }">
    </div>

    <!-- Moon Icon (Dark Mode) -->
    <svg v-if="isDarkMode" class="absolute left-1 w-4 h-4 text-yellow-300 transition-all duration-300"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.74 2a10.94 10.94 0 0 0 0 20 9.22 9.22 0 0 1 0-20Z" />
    </svg>

    <!-- Sun Icon (Light Mode) -->
    <svg v-else class="absolute right-1 w-4 h-4 text-yellow-500 transition-all duration-300"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>

</button>

  </div>
    
    <nav class="mt-6">
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin/organizations" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Organizations
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin/users" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Users
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin/quizzes" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Quizzes
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin/categories" 
            class="block py-3 px-6 hover:bg-teal-600 transition dark:hover:bg-teal-800"
            active-class="bg-teal-700 dark:bg-teal-900"
          >
            Categories
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: localStorage.getItem("darkMode") === "true" || false,
    };
  },
  props: {
    isOpen: Boolean,
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode; // Toggle the state
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", this.isDarkMode);
    },
  },
  mounted() {
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        }
    }
};
</script>

<style scoped>
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
</style>