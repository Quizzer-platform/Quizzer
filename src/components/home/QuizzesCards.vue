<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mb-10">
        <div v-for="(card, index) in cards" :key="index" class="flex justify-center">
            <div
                class="p-6 rounded-xl shadow-lg w-80 text-center flex flex-col transition duration-300 transform hover:scale-103 h-full 
                bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 
                hover:bg-opacity-90 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700">

                <!-- Title -->
                <h3 class="font-semibold text-xl text-gray-900 dark:text-teal-300 mt-4 tracking-wide">
                    {{ card.title }}
                </h3>

                <!-- Description -->
                <p class="text-gray-700 dark:text-gray-400 mt-3 text-sm leading-relaxed flex-grow px-2">
                <div v-if="!expandedCards[index]" ><span>{{ reduceWordCount(card.description, 100) }}</span><span @click="showFullText(index)"
                        class="cursor-pointer hover:text-teal-300">. . . . </span></div>
                <div v-if="expandedCards[index]"><span>{{ reduceWordCount(card.description, 1000) }}</span></div>
                </p>

                <!-- Button -->
                <button @click="$router.push({ name: 'quizDetails', params: { quizId: card.id } })" class="mt-4 px-5 py-2 cursor-pointer rounded-lg shadow-md w-full transition-all duration-300
                    bg-teal-600 text-white hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-500 
                    hover:shadow-lg hover:shadow-teal-500/50">
                    See More
                </button>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        cards: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            moreText: " . ",
            expandedCards: {}
        }
    },
    methods: {
        reduceWordCount(str, idx) {
            if (idx > str.length) {
                return str;
            }
            return str.substring(0, idx) + this.moreText;
        },
        showFullText(index) {
            // In Vue 3, we can directly set properties on reactive objects
            this.expandedCards[index] = true;
            // Force a re-render to ensure reactivity
            this.expandedCards = {...this.expandedCards};
        }
    }
};
</script>
