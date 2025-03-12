<template>
    <div class="bg-white p-6 rounded-3xl shadow-md w-full">
        <!-- Quiz Icon -->
        <div class="flex justify-left relative">
            <div class=" rounded-lg flex items-center justify-center">
                <img :src="quiz.icon || '../src/assets/icon.png'" alt="Quiz Icon" class="w-10 h-10">
            </div>
            <!-- Edit & Delete Buttons -->
            <div class="absolute top-0 right-0 flex gap-2">
                <button @click="$emit('edit', quiz)"
                    class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-900 hover:cursor-pointer transition">
                    ✏️
                </button>
                <button @click="$emit('delete', quiz)"
                    class="bg-red-200 text-white p-2 rounded-full hover:bg-red-600 hover:cursor-pointer transition">
                    ❌
                </button>
            </div>
        </div>
        <!-- Quiz Title -->
        <h3 class="font-bold text-lg text-left mt-4">{{ quiz.title }}</h3>

        <!-- Quiz Description -->
        <p class="text-gray-600 text-sm text-left mt-2">
            {{ quiz.description }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        quiz: Object,
    }
};
</script>
