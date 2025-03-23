<template>
    <div class="mb-6 p-5 bg-gray-50 dark:bg-[#1a1f2e] rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-teal-700 dark:text-teal-400 mb-2">Question {{ index + 1 }}</h2>
        
        <p class="text-xl text-gray-800 dark:text-gray-300 mb-4">{{ question.text }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Select only one:</p>

        <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="mb-3">
            <input type="radio" :id="`q${index}-option${optionIndex}`" :name="`question-${index}`" :value="option"
                :checked="modelValue === option" @change="$emit('update:modelValue', option)" class="hidden peer" />
            <label :for="`q${index}-option${optionIndex}`"
                class="block p-3 bg-white dark:bg-[#23283b] border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition duration-200 ease-in-out 
                hover:bg-gray-100 dark:hover:bg-[#2d3448] 
                peer-checked:bg-teal-100 dark:peer-checked:bg-teal-700 
                peer-checked:border-teal-600 peer-checked:text-teal-900 dark:text-gray-300 dark:peer-checked:text-teal-200">
                {{ option }}
            </label>
        </div>
    </div>
    <!-- Submit button -->
        <button v-if="isLastQuestion" type="button" @click="$emit('submit-quiz')"
            class="w-full bg-teal-600 dark:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:bg-teal-700 dark:hover:bg-teal-800 active:bg-teal-800 dark:active:bg-teal-900 cursor-pointer mt-4">
            Submit Quiz
        </button>
</template>

<script>
export default {
    props: {
        question: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        modelValue: {
            type: [String, Number],
            default: ''
        },
        isLastQuestion: {
            type: Boolean,
            default: false
        },
    },
    emits: ["update:modelValue", "submit-quiz"], // Emit update and submit events
};
</script>
