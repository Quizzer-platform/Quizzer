<template>
  <div 
    class="fixed h-screen bg-teal-900 text-white w-64 transition-transform duration-300"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <button class="absolute top-4 right-4 md:hidden text-white text-2xl" @click="toggleSidebar">
      ✖
    </button>

    <h2 class="text-2xl font-bold p-6">QUIZZER</h2>
    <nav class="mt-6">
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/" 
            class="block py-3 px-6 hover:bg-teal-600 transition"
            active-class="bg-teal-700"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link 
            to="/organization" 
            class="block py-3 px-6 hover:bg-teal-600 transition"
            active-class="bg-teal-700"
          >
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link 
            to="/organization/users" 
            class="block py-3 px-6 hover:bg-teal-600 transition"
            active-class="bg-teal-700"
          >
            Users
          </router-link>
        </li>
        <li>
          <router-link 
            to="/organization/quizzes" 
            class="block py-3 px-6 hover:bg-teal-600 transition"
            active-class="bg-teal-700"
          >
            Quizzes
          </router-link>
        </li>
      </ul>
    </nav>
    <!-- <div class="absolute bottom-6 left-6 text-sm text-gray-300">
      <p>Licensed under &copy; CCC</p>
      <router-link to="/donate" class="underline">Donate Us</router-link>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    }
  }
};
</script>
