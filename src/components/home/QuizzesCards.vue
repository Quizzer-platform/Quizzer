<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="(card, index) in cards" :key="index">
            <div
                class="bg-white p-6 rounded-xl shadow-md m-2 text-center hover:bg-teal-50 hover:shadow-lg transition hover:scale-105">
                <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ card.title }}</h3>
                <p class="text-gray-600 mt-2 text-sm">
                    {{ card.description }}
                </p>
                <button @click="$router.push({ name: 'quizDetails', params: { quizId: card.id } })"
                    class="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg  shadow-md w-full hover:bg-teal-900 cursor-pointer transition">
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
