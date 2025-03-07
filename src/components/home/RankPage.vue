<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>
<template>
     <div class="flex flex-col min-h-screen bg-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <!-- Sidebar Toggle for Small Screens -->
            <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-4 bg-green-900 text-white flex justify-end">
                ☰
            </button>
            
            <!-- Sidebar -->
            <aside :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}" class="w-full md:w-64 bg-green-900 text-white p-6 flex flex-col md:block">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-3xl">
                        👤
                    </div>
                </div>
                <nav class="flex flex-col space-y-4">
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Dashboard</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Account Info</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Subscriptions</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded font-bold">All Quizzes and Rank</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Your Companies</a>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="bg-green-800 text-white p-10 rounded-lg flex flex-col md:flex-row justify-between items-center ">
                    <div class="flex">
                        <img src="https://placehold.co/200x200/green/white" class="w-10 h-10 rounded-full border-2 border-teal-600 me-2" alt="Profile" />
                    <div>
                        <h3 class="font-bold text-white">John Doe</h3>
                        <p class="text-gray-300">john@gmail.com</p>
                    </div>
                    </div>
                    <div class="font-semibold text-white text-xl mt-4 md:mt-0">
                        Rank : 6
                    </div>
                    <div class="font-semibold text-white text-xl mt-4 md:mt-0">
                        Score : 367
                    </div>
                </div>

                <div class="flex flex-wrap gap-6 mt-6">
                    <!-- Left Section -->
                    <div class="flex-1">
                        <h2 class="text-xl font-bold">Completed Quizzes</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            <div v-for="quiz in recentQuizzes" :key="quiz.id" class="bg-white p-4 rounded-lg shadow">
                                <div class="flex items-center justify-between">
                                    <div class="w-16 h-10 bg-green-100 flex items-center justify-center">
                                        {{ quiz.icon }}
                                    </div>
                                    <p class="font-bold text-green-700">Score: {{ quiz.score }}</p>
                                </div>
                                <p class="font-bold mt-2 truncate">{{ quiz.title }}</p>
                                <p class="text-gray-500 mt-2 truncate">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                <div class="flex justify-end mt-6">
                                    <button class="bg-green-600 text-white p-2 rounded hover:bg-green-700">Quiz Details</button>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                    
                </div>
            </main>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            recentQuizzes: [
                { id: 1, icon: "HTML", title: "HTML Fundamentals", score: "37/40" },
                { id: 2, icon: "CSS", title: "CSS Fundamentals", score: "37/40" },
                { id: 3, icon: "JS", title: "JavaScript Basics", score: "35/40" }
            ],
            badges: [
                { name: "Quiz Master", image: "src/assets/bagde1.PNG", borderColor: "border-blue-400", description: "Scored 90%+ on 5 quizzes" },
                { name: "Top Scorer", image: "src/assets/badge2.PNG", borderColor: "border-yellow-400", description: "Achieved highest score in a quiz" }
            ],
            recommendedQuizzes: [
                { id: 1, title: "Quiz 1", image: "src/assets/1_FKD2Uy_Q6r6AviZA2VD4RQ.png" },
                { id: 2, title: "Quiz 2", image: "src/assets/images (2).png" },
                { id: 3, title: "Quiz 3", image: "src/assets/Bootstrap_logo.svg.png" }
            ]
        };
    }
};
</script>
