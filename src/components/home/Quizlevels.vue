    <template>
        <div class="bg-gray-100 p-8">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-2xl font-bold text-teal-700 mb-6">Quiz Levels</h1>
            
            <div v-for="level in quizLevels" :key="level.id" class="bg-teal-50 p-6 rounded-lg shadow-md mb-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-teal-800">{{ level.title }}</h2>
                <a href="#" class="text-teal-600 font-semibold">Start Quiz →</a>
            </div>
            <p class="mt-2 text-gray-700"><strong>Description:</strong> {{ level.description }}</p>
            <p class="mt-2 text-gray-700"><strong>What to Expect:</strong></p>
            <ul class="list-disc list-inside text-gray-700">
                <li v-for="point in level.expectations" :key="point">{{ point }}</li>
            </ul>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    export default {
        data() {
        return {
            quizLevels: [
            {
                id: 1,
                title: "Easy Level",
                description: "The Easy Level quizzes are perfect for beginners or those looking for a basic introduction to the subject.",
                expectations: [
                "Simple, straightforward multiple-choice questions.",
                "Focus on definitions, facts, and introductory concepts.",
                "Ideal for students who want to test their understanding of the fundamentals."
                ]
            },
            {
                id: 2,
                title: "Mid Level",
                description: "The Medium Level quizzes are designed for students who have a basic understanding of the subject and want to apply their knowledge.",
                expectations: [
                "A mix of multiple-choice, short answer, and fill-in-the-blank questions.",
                "Problems that require you to apply concepts in a practical or analytical way.",
                "Moderate difficulty questions that bridge the gap between basic understanding and advanced knowledge."
                ]
            },
            {
                id: 3,
                title: "High Level",
                description: "The High Level quizzes are for students who are comfortable with the fundamentals and ready to challenge themselves.",
                expectations: [
                "Challenging questions that test your knowledge of complex scenarios.",
                "Higher-order thinking and problem-solving skills required.",
                "Ideal for students who want to push their limits and test their mastery."
                ]
            }
            ]
        };
        }
    };
    </script>
    