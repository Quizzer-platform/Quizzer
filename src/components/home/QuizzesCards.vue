<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center mb-10">
        <div v-for="(card, index) in cards" :key="index" class="flex justify-center">
            <div
                class="bg-white p-6 rounded-xl shadow-md w-80 text-center flex flex-col hover:shadow-lg transition duration-300 hover:scale-102 hover:bg-teal-50 h-full">
                
                <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ card.title }}</h3>

                <p class="text-gray-600 mt-2 text-sm flex-grow">
                    {{ card.description }}
                </p>

                <button @click="$router.push({ name: 'quizDetails', params: { quizId: card.id } })"
                    class="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md w-full hover:bg-teal-900 cursor-pointer transition">
                    See More
                </button>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["cards", "categoryTitle"],
};
</script>
