<template>
  <div class="bg-white p-6 rounded-xl shadow-lg m-2 w-64 text-center">
    <!-- Icon Section -->
    <div class="bg-teal-100 p-3 w-12 h-12 mx-auto rounded-md flex items-center justify-center">
      <span class="text-teal-700 text-lg font-semibold">{{ icon }}</span>
    </div>

    <!-- Quiz Title -->
    <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ title }}</h3>

    <!-- Quiz Description -->
    <p class="text-gray-600 mt-2 text-sm">
      {{ description }}
    </p>

    <!-- Button -->
    <button 
      class="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md w-full hover:bg-teal-900 transition">
      See More
    </button>
  </div>
</template>

<script>
export default {
  name: "QuizCard",
  props: {
    icon: {
      type: String,
      required: true,
      default: "📘",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>
