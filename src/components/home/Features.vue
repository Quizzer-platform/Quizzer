<template>
        <FeatureCard
          v-for="(feature, index) in features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
        />
</template>

<script>
import FeatureCard from "./FeatureCard.vue"; 

export default {
  name: "Features",
  components: {
    FeatureCard,
  },
  data() {
    return {
      features: [
        {
          title: "Skill Evaluation",
          description: "Our platform provides in-depth skill assessments across multiple domains, helping organizations make data-driven hiring decisions.",
        },
        {
          title: "Performance Analytics",
          description: "Track quiz performance with detailed analytics, including scores, time spent, and comparative benchmarking for smarter evaluations.",
        },
        {
          title: "Customizable Quizzes",
          description: "Create quizzes with various question types, difficulty levels, and scoring methods to match your assessment criteria.",
        },
      ],
    };
  },
};
</script>
