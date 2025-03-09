<template>
    <Navbar></Navbar>
    <div class="m-10">
        <h2 class="text-2xl font-semibold text-center">See where you are!</h2>
        <p class="text-gray-500 text-center mb-5">Here is your Leaderboard</p>

        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading leaderboard...</p>
        </div>

        <div v-else>
            <!-- Top 3 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-6">
                <div v-if="topUsers[1]" class="bg-gray-200 p-4 rounded-lg shadow transform hover:scale-105 hover:bg-teal-100 transition-transform">
                    <p class="text-lg font-semibold">🥈 {{ topUsers[1].name }} 
                        <span class="block text-teal-800">{{ topUsers[1].overallScore }}</span>
                    </p>
                </div>
                <div v-if="topUsers[0]" class="bg-gray-200 p-4 rounded-lg shadow transform hover:scale-105 hover:bg-teal-100 transition-transform">
                    <p class="text-lg font-semibold">🥇 {{ topUsers[0].name }}
                        <span class="block text-teal-800">{{ topUsers[0].overallScore }}</span>
                    </p>
                </div>
                <div v-if="topUsers[2]" class="bg-gray-200 p-4 rounded-lg shadow transform hover:scale-105 hover:bg-teal-100 transition-transform">
                    <p class="text-lg font-semibold">🥉 {{ topUsers[2].name }}
                        <span class="block text-teal-800">{{ topUsers[2].overallScore }}</span>
                    </p>
                </div>
            </div>

            <!-- Leaderboard Table -->
            <div class="overflow-x-auto bg-white rounded-lg shadow">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-teal-800 text-white">
                            <th class="p-4">Username</th>
                            <th class="p-4">Rank</th>
                            <th class="p-4">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in remainingUsers" 
                            :key="user.uid"
                            class="border-b hover:bg-teal-100 transition-colors"
                            :class="{'bg-gray-50': index % 2 === 0}">
                            <td class="p-4 font-bold">{{ user.name }}</td>
                            <td class="p-4 font-semibold">{{ index + 4 }}</td>
                            <td class="p-4 font-semibold">{{ user.overallScore }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Footer />
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