<template>
  <div 
    class="fixed h-screen bg-teal-900 text-white w-64 transition-colors duration-300 cursor-pointer 
            dark:bg-[#151a24] min-h-screen dark:text-gray-200"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="flex items-center justify-evenly md:justify-between p-4">
        <button class="md:hidden text-white text-xl" @click="toggleSidebar">
          ✖
        </button>
        <!-- Updated QUIZZER Text Color -->
        <h2 class="text-2xl font-bold p-6 text-teal-300 dark:text-teal-400">QUIZZER</h2>
        <button @click="toggleDarkMode" class="p-1 rounded-full text-sm bg-teal-700 dark:bg-gray-700 cursor-pointer flex items-center justify-center w-8 h-8">
                    <span v-if="isDarkMode">🌙</span>
                    <span v-else>☀️</span>
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
          isDarkMode: localStorage.getItem("darkMode") === "true", // Load saved preference
    }
  },
  props: {
    isOpen: Boolean,
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
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