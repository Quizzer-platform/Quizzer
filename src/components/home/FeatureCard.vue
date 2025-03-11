<template>
  <div class="p-10 rounded-lg shadow-md hover:shadow-lg hover:bg-teal-50 hover:scale-105 transition duration-300">
    <h3 class="font-bold text-lg text-gray-800">{{ title }}</h3>
    <p class="text-gray-600 mt-3 text-sm">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: "FeatureCard",
  props: {
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

