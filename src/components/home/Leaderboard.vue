<template>
    <div class="min-h-screen bg-white dark:bg-[#1a202c]">
<Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>
        <div class="mx-auto max-w-5xl p-6 pt-20 min-h-screen">
            <h2 class="text-2xl font-semibold text-center pt-10 dark:text-teal-500">See where you are!</h2>
            <p class="text-gray-500 dark:text-gray-400 text-center mb-5">Quizzer Leaderboard</p>

            <div v-if="loading" class="text-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 dark:border-teal-500 mx-auto"></div>
                <p class="text-gray-600 dark:text-gray-400 mt-4">Loading leaderboard...</p>
            </div>

            <div v-else>
                <!-- Top 3 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-10">
                    <div v-if="topUsers[1]" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-teal-50 dark:hover:bg-teal-900 transition-transform">
                        <p class="text-lg font-semibold dark:text-gray-100">🥈 {{ topUsers[1].name }} 
                            <span class="block text-teal-800 dark:text-teal-400">{{ topUsers[1].overallScore }}</span>
                        </p>
                    </div>
                    <div v-if="topUsers[0]" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-teal-50 dark:hover:bg-teal-900 transition-transform">
                        <p class="text-lg font-semibold dark:text-gray-100">🥇 {{ topUsers[0].name }}
                            <span class="block text-teal-800 dark:text-teal-400">{{ topUsers[0].overallScore }}</span>
                        </p>
                    </div>
                    <div v-if="topUsers[2]" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-teal-50 dark:hover:bg-teal-900 transition-transform">
                        <p class="text-lg font-semibold dark:text-gray-100">🥉 {{ topUsers[2].name }}
                            <span class="block text-teal-800 dark:text-teal-400">{{ topUsers[2].overallScore }}</span>
                        </p>
                    </div>
                </div>

                <!-- Leaderboard Table -->
                <div class="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                    <table class="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-gradient-to-r from-teal-800 to-teal-600 dark:from-teal-900 dark:to-teal-700 text-white">
                                <th class="p-4 text-left uppercase tracking-wider">Username</th>
                                <th class="p-4 text-left uppercase tracking-wider">Rank</th>
                                <th class="p-4 text-left uppercase tracking-wider">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in remainingUsers" 
                                :key="user.uid"
                                class="border-b border-gray-300 dark:border-gray-700 transition-colors hover:bg-teal-100 dark:hover:bg-gray-700"
                                :class="{'bg-gray-50 dark:bg-gray-900': index % 2 === 0}">
                                <td class="p-4 font-bold text-gray-800 dark:text-gray-300">{{ user.name }}</td>
                                <td class="p-4 font-semibold text-gray-700 dark:text-gray-400">{{ index + 4 }}</td>
                                <td class="p-4 font-semibold text-gray-700 dark:text-gray-400">{{ user.overallScore }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";

export default {
    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            users: [],
            loading: true,
            apiUrl: 'https://quizzer-platform-default-rtdb.firebaseio.com/users.json'
        };
    },
    computed: {
        topUsers() {
            return this.users.slice(0, 3);
        },
        remainingUsers() {
            return this.users.slice(3);
        }
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch(this.apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                if (data) {
                    const allUsers = Object.values(data);
                    this.users = allUsers
                        .filter(user => user.role === 'user')
                        .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchUsers();
    }
};
</script>