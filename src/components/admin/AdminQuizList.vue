<template>
  <div class="mt-8 mx-6 bg-transparent mb-8">
    <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

    <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
      <h2 class="text-xl font-semibold text-teal-900 sm:pl-5">Quizzes Review</h2>
      <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" />
    </div>

    <!-- Quizzes Table -->
    <TableStructure
      :headers="['QUIZ ID', 'Name of Quiz', 'No. takes', 'Org. Name']"
      :rows="quizzes.map(quiz => [quiz.id, quiz.name, quiz.takes, quiz.organization])"
      :showActions="true"
    />
  </div>
</template>

<script>
import SearchBar from '../layout/Searchbar.vue';
import TableStructure from './TableStructure.vue'; // Import the TableStructure component

export default {
  data() {
    return {
      quizzes: [
        { id: 1, name: "HTML Quiz", takes: 333, organization: "Valeo" },
        { id: 2, name: "CSS Quiz", takes: 25, organization: "Ours" },
        { id: 3, name: "React Quiz", takes: 90, organization: "Huawei" },
        { id: 4, name: "HTML Quiz", takes: 33, organization: "Quizzer" },
      ],
    };
  },
  components: {
    SearchBar,
    TableStructure, // Register the TableStructure component
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>