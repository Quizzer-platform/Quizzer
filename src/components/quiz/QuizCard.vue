<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <!-- Icon -->
    <div class="bg-teal-100 p-3 w-12 h-12 mx-auto rounded-md flex items-center justify-center">
      <i :class="icon" class="text-teal-700 text-xl">{{ icon}}</i> 
    </div>
    <h3 class="font-semibold text-lg text-gray-800 mt-4">{{ title }}</h3>
    <p class="text-gray-600 mt-2 text-sm">
      {{ description }}
    </p>
        <button class="mt-4 bg-teal-700 text-white px-12 py-2 rounded-lg shadow-lg hover:bg-teal-900">
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
        default:"icon",
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
