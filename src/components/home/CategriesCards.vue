<template>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mb-10">
        <div v-for="(category, index) in categories" :key="index" class="flex justify-center">
            <div
                class="bg-white p-6 rounded-xl shadow-md w-80 text-center flex flex-col hover:shadow-lg transition duration-300 hover:scale-102 hover:bg-teal-50 h-full">
                
                <div class="bg-teal-200 p-3 w-12 h-12 mx-auto rounded-md flex items-center justify-center">
                    <span class="text-teal-700 text-lg font-semibold"><img :src="category.icon" alt="icon"></span>
                </div>

                <h3 class="font-semibold text-lg text-gray-900 mt-4">{{ category.title }}</h3>

                <p class="text-gray-600 mt-2 text-sm leading-relaxed flex-grow">
                    {{ category.description }}
                </p>

                <button @click="$emit('view-quizzes', category.id)"
                    class="mt-4 bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md w-full hover:bg-teal-900 cursor-pointer transition">
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
    }
};
</script>

<style scoped>
</style>
