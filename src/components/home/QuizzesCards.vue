<template>
  <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <QuizCard
      v-for="(card, index) in cards"
      :key="index"
      :icon="card.icon"
      :title="card.title"
      :description="card.description"
    />
  </div>
</template>

<script>
import QuizCard from "../quiz/QuizCard.vue";

export default {
  name: "Cards",
  components: {
    QuizCard,
  },
  props: {
    cards: {
      type: Array,
      required: true,
    },
  },
};
</script>
