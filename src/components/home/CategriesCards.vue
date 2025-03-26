<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mb-10">
        <div v-for="(category, index) in categories" :key="index" class="flex justify-center">
            <div
                class="p-6 rounded-xl shadow-lg w-80 text-center flex flex-col transition duration-300 transform hover:scale-105 h-full 
                bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 
                hover:bg-opacity-90 dark:hover:from-gray-700 dark:hover:to-gray-800 border border-gray-200 dark:border-gray-700">
                
                <!-- Icon Section -->
                <div
                    class="p-3 w-14 h-14 mx-auto rounded-lg flex items-center justify-center 
                    bg-teal-300 dark:bg-teal-800 shadow-md transition-all duration-300 hover:scale-110">
                    <img :src="category.icon" alt="icon" class="w-8 h-8">
                </div>

                <!-- Title -->
                <h3 class="font-semibold text-xl text-gray-900 dark:text-teal-300 mt-4 tracking-wide">
                    {{ category.title }}
                </h3>

                <!-- Description -->
                <p class="text-gray-700 dark:text-gray-400 mt-3 text-sm leading-relaxed flex-grow px-2">
                    <div v-if="!expandedCards[index]" ><span>{{ reduceWordCount(category.description, 100) }}</span><span @click="showFullText(index)"
                        class="cursor-pointer hover:text-teal-300">. . . . </span></div>
                <div v-if="expandedCards[index]"><span>{{ reduceWordCount(category.description, 1000) }}</span></div>
                </p>

                <!-- Button -->
                <button @click="$emit('view-quizzes', category.id)"
                    class="mt-4 px-5 py-2 cursor-pointer rounded-lg shadow-md w-full transition-all duration-300
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
        categories: {
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
