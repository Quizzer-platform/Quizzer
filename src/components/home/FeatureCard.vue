<template>
  <div class="bg-teal-50 p-6 rounded-lg shadow-md">
    <h3 class="font-semibold text-lg text-gray-800">{{ title }}</h3>
    <p class="text-gray-600 mt-2 text-sm">
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

