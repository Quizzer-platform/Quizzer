<template>
    <hr class="border-gray-400 mb-1 w-40 sm:w-60 md:w-80 lg:w-96 xl:w-170 mx-auto" />

  <main class="flex-1 p-6">
        <!-- Subscriptions Table -->
         <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 px-2">
            <h3 class="text-xl font-semibold text-teal-900 sm:pl-5">Subscriptions</h3>
            <SearchBar class="w-full sm:w-auto sm:ml-4 md:ml-150" />
        </div>
        <TableStructure 
          :headers="['ID', 'Price', 'Quizzes', 'Due Date']" 
          :rows="subscriptions.map(s => [s.id, s.price, s.quizzes, s.due])" 
        />
      </main>
</template>

<script>

import TableStructure from "@/components/admin/TableStructure.vue";
import SearchBar from "@/components/layout/Searchbar.vue"
export default {
  components: {
        TableStructure,
        SearchBar,
  },
  data() {
    return {
      subscriptions: [
        { id: 1, price: "$30", quizzes: 10, due: "30/5/2025" },
        { id: 2, price: "$50", quizzes: 30, due: "5/3/2025" },
      ],
    };
  },
};
</script>
