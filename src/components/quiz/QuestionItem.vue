<template>
    <div class="mb-6 p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Question {{ index + 1 }}</h2>
        <p class="text-xl text-gray-700 mb-4">{{ question.text }}</p>
        <p class="text-sm text-gray-500 mb-2">Select only one:</p>

        <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="mb-3">
            <input type="radio" :id="`q${index}-option${optionIndex}`" :name="`question-${index}`" :value="option"
                :checked="modelValue === option" @change="$emit('update:modelValue', option)" class="hidden peer" />
            <label :for="`q${index}-option${optionIndex}`"
                class="block p-3 bg-white border border-gray-300 rounded-lg cursor-pointer transition duration-200 ease-in-out hover:bg-gray-100 peer-checked:bg-green-100 peer-checked:border-green-600 peer-checked:text-green-700">
                {{ option }}
            </label>
        </div>

        <!-- Submit button only appears on the last question -->
        <button v-if="isLastQuestion" type="button" @click="$emit('submit-quiz')"
            class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:bg-green-700 active:bg-green-800 cursor-pointer mt-4">
            Submit Quiz
        </button>
    </div>
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
