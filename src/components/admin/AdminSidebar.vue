<template>
  <div 
    class="fixed md:relative h-screen bg-teal-900 text-white w-64 transition-transform duration-300"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <button class="absolute top-4 right-4 md:hidden text-white text-2xl" @click="toggleSidebar">
      ✖<i>icon</i>
    </button>

    <h2 class="text-2xl font-bold p-6">QUIZZER</h2>
    <nav class="mt-6">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" class="block py-3 px-6 hover:bg-teal-600 transition">
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="absolute bottom-6 left-6 text-sm text-gray-300">
      <p>Licensed under &copy; CCC</p>
      <router-link to="/donate" class="underline">Donate Us</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  data() {
    return {
      menuItems: [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Organizations", path: "/organizations" },
        { name: "Quizzes", path: "/quizzes" }
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    }
  }
};
</script>


