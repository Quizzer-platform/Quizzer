
<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(category, index) in categories"
        :key="index" >
      <div class="bg-white p-6 rounded-xl shadow-lg m-2 w-64 text-center">
      <!-- Icon Section -->
      <div class="bg-teal-100 p-3 w-12 h-12 mx-auto rounded-md flex items-center justify-center">
        <span class="text-teal-700 text-lg font-semibold">{{ category.icon }}</span>
      </div>
  
      <!-- Quiz Title -->
      <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ category.title }}</h3>
  
      <!-- Quiz Description -->
      <p class="text-gray-600 mt-2 text-sm">
        {{ category.description }}
      </p>
  
      <!-- Button -->
      <button 
        class="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md w-full hover:bg-teal-900 transition">
        See More
      </button>
    </div></div>
    </div>
  </template>
  
  <script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
};
</script>
