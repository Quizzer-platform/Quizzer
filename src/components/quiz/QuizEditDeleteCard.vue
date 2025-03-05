<template>
  <div class="relative bg-white p-6 rounded-3xl shadow-md w-full">
    <!-- Quiz Icon -->
    <div class="flex justify-left">
      <div class="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
        <img :src="quiz.icon" alt="Quiz Icon" class="w-10 h-10">
      </div>
    </div>

    <!-- Edit & Delete Buttons -->
    <div class="absolute top-6 right-3 flex gap-2">
      <button @click="$emit('edit', quiz)" class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-900 transition">
        ✏️
      </button>
      <button @click="$emit('delete', quiz)" class="bg-red-200 text-white p-2 rounded-full hover:bg-red-600 transition">
        ❌
      </button>
    </div>

    <!-- Quiz Title -->
    <h3 class="font-bold text-lg text-left mt-4">{{ quiz.title }}</h3>

    <!-- Quiz Description -->
    <p class="text-gray-600 text-sm text-left mt-2">
      {{ quiz.description }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    quiz: Object,
  }
};
</script>
