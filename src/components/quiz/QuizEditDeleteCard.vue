<template>
    <div class="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md w-full">
        <!-- Quiz Icon -->
        <div class="flex justify-left relative">
            <div class="rounded-lg flex items-center justify-center">
                <img :src="quizIcon" alt="Quiz Icon" class="w-10 h-10">
            </div>
            <!-- Edit & Delete Buttons -->
            <div class="absolute top-0 right-0 flex gap-2">
                <button @click="$emit('edit', quiz)"
                    class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-900 dark:bg-teal-500 dark:hover:bg-teal-700 transition cursor-pointer">
                    ✏️
                </button>
                <button @click="$emit('delete', quiz)"
                    class="bg-red-200 text-white p-2 rounded-full hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-700 transition cursor-pointer">
                    ❌
                </button>
            </div>
        </div>

        <!-- Quiz Title -->
        <h3 class="font-bold text-lg text-left mt-4 text-gray-900 dark:text-gray-200">
            {{ quiz.title }}
        </h3>

        <!-- Quiz Description -->
        <p class="text-gray-600 dark:text-gray-400 text-sm text-left mt-2">
            {{ quiz.description }}
        </p>
    </div>
</template>

<script>
import defaultIcon from '@/assets/icon.png';
import categoryIcon from '@/assets/categoryIcon.png';

export default {
    props: {
        quiz: Object,
    },
    computed: {
        quizIcon() {
            return this.quiz.quizType === 'category' ? categoryIcon : defaultIcon;
        }
    }
};
</script>
