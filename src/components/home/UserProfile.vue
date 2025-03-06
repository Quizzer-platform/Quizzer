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
                    <a href="#" class="hover:bg-green-700 p-2 rounded font-bold">Dashboard</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Account Info</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Subscriptions</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Leaderboard</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">All Quizzes</a>
                    <a href="#" class="hover:bg-green-700 p-2 rounded text-gray-300">Your Companies</a>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="bg-green-800 text-white p-10 rounded-lg flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <p class="text-sm">September 4, 2023</p>
                        <h1 class="text-2xl font-bold">Welcome back, John!</h1>
                        <p class="text-sm">Always stay updated in your Quiz portal</p>
                    </div>
                    <div class="w-24 h-24 bg-gray-400 rounded-full mx-10 flex items-center justify-center text-3xl mt-2">
                        👤
                    </div>
                </div>

                <div class="flex flex-wrap gap-6 mt-6">
                    <!-- Left Section -->
                    <div class="flex-1">
                        <h2 class="text-xl font-bold">Recent Quizzes</h2>
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

                        <h2 class="mt-7 text-xl font-bold">Badges</h2>
                        <div class="flex flex-wrap justify-around mt-4">
                            <div v-for="badge in badges" :key="badge.name" class="text-center">
                                <img :src="badge.image" :alt="badge.name" class="w-30 h-30 rounded-full mx-auto border-2 shadow-md" :class="badge.borderColor" />
                                <p class="mt-2 font-bold">{{ badge.name }}</p>
                                <p class="text-sm text-gray-600 truncate">{{ badge.description }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Section -->
                    <div class="w-full md:w-1/3">
                        <h2 class="text-xl font-bold">Recommended Quizzes</h2>
                        <div class="flex flex-wrap gap-4 mt-5 justify-center">
                            <img v-for="quiz in recommendedQuizzes" :key="quiz.id" :src="quiz.image" :alt="quiz.title" class="w-20 h-20 rounded-full shadow-lg" />
                        </div>
    
                        <div class="mt-5 flex justify-between text-xl">
                            <h3 class="font-bold">Go Premium! <span class="text-yellow-600">👑</span></h3>
                            <a href="#" class="text-blue-700 font-semibold">See all</a>
                        </div>
    
                        <div class="mt-5 p-5 bg-white rounded-lg">
                            <h3 class="font-bold">Subscriptions</h3>
                            <p class="text-sm text-gray-700">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure saepe repellendus natus? Eos blanditiis dignissimos reprehenderit, fuga, ex optio quo, odit tenetur ratione minus aliquam? Aspernatur enim tempora ea non!</p>
                            <a href="#" class="text-blue-700 underline">See more</a>
    
                            <h3 class="font-bold mt-6">Today's offer</h3>
                            <p class="text-sm text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste dignissimos id perspiciatis a esse aliquam quam fugit, non exercitationem animi, ratione repellendus ducimus. Ipsum quae fuga commodi, sed qui doloribus?</p>
                            <a href="#" class="text-blue-700 underline">See more</a>
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
