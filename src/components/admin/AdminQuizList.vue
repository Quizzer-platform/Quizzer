<template>
  <div class="mt-8 mx-6 bg-transparent mb-8">
    <hr class="border-gray-400 mb-4 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto">
    
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-teal-900">Quizzes Review</h2>
        <input 
        type="text" 
        placeholder="Search" 
        class="p-2 pl-4 w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
    </div>


    <!-- Quizzes Table -->
    <div class="bg-white p-6 rounded-lg shadow-lg mx-auto max-w-5xl">
  <table class="w-full text-left border-collapse overflow-hidden rounded-lg">
    <thead>
      <tr class="bg-teal-900 text-white">
        <th class="p-4 rounded-l-lg">QUIZ ID</th>
        <th class="p-4">Name of Quiz</th>
        <th class="p-4">No. takes</th>
        <th class="p-4">Org. Name</th>
        <th class="p-4 rounded-r-lg"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(quiz) in quizzes" 
          :key="quiz.id" 
          class="bg-teal-700/25 hover:bg-teal-700/50 transition duration-200 ease-in-out">
        <td class="p-3 text-center font-semibold rounded-l-lg">{{ quiz.id }}</td>
        <td class="p-3 text-center">{{ quiz.name }}</td>
        <td class="p-3 text-center">{{ quiz.takes }}</td>
        <td class="p-3 text-center">{{ quiz.organization }}</td>
        <td class="p-3 text-right rounded-r-lg">
          <button class="bg-teal-700 hover:bg-teal-900 text-white px-5 py-2 rounded-md shadow-md transition duration-300">
            More Details
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  </div>
</template>

<script>
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
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
