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
        class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-900 
               dark:bg-teal-500 dark:hover:bg-teal-700 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" 
                d="M15.232 5.232l3.536 3.536M4 16.242V20h3.758l10.486-10.486-3.536-3.536L4 16.242z" />
        </svg>
    </button>
    
    <button @click="$emit('delete', quiz)"
        class="bg-red-400 text-white p-2 rounded-full hover:bg-red-600 
               dark:bg-red-500 dark:hover:bg-red-700 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" 
                d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
</div>
        </div>

        <!-- Quiz Title -->
        <h3 class="font-bold text-lg text-left mt-4 text-gray-900 dark:text-gray-200">
            {{ quiz.title }}
        </h3>

        <!-- Quiz Description -->
        <p class="text-gray-600 dark:text-gray-400 text-sm text-left mt-2">
            {{ reduceWordCount(quiz.description , 100) }}
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
    },
    methods: {
        reduceWordCount(str, idx) {
            if (idx > str.length) {
                return str;
            }
            return str.substring(0, idx) + " . . . ";
        }
    }
};
</script>
