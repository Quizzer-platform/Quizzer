<template>
    <nav :class="['transition-colors duration-300 shadow-md', isSticky ? 'sticky-nav' : 'bg-transparent']" id="navbar">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-xl font-bold text-teal-600">Quizzer</h1>
          <ul class="hidden md:flex space-x-6">
            <li v-for="item in menuItems" :key="item">
              <a href="#" class="hover:text-teal-600">{{ item }}</a>
            </li>
          </ul>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 m-5">
              <button  class="hover:text-teal-600">login</button>
            </div>
           
            <button @click="toggleMenu" class="md:hidden text-gray-600 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-if="mobileMenuOpen" class="md:hidden flex flex-col items-center space-y-4 pb-4">
        <a v-for="item in menuItems" :key="item" href="#" class="hover:text-teal-600">{{ item }}</a>
      </div>
    </nav>
  </template>
  
  <script>
  
  export default {
   
    data() {
      return {
        mobileMenuOpen: false,
        isSticky: false,
        menuItems: ['Home', 'Services', 'Leaderboard', 'About Us', 'Contact Us', 'Pricing']
      };
    },
    methods: {
      toggleMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      },
      handleScroll() {
        this.isSticky = window.scrollY > 10;
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  };
  </script>
  
  <style scoped>
  .sticky-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #063c38;
    color: #f4f7f6;
    transition: background-color 0.1s ease-in-out;
    z-index: 1000;
  }
  </style>
  