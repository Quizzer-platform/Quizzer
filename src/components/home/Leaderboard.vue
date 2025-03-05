<template>
    <Navbar>
        <template v-slot:canChange>
            <UserProfileIcon />
        </template>
    </Navbar>
    <div class="m-10">
        <h2 class="text-2xl font-semibold text-center">See where you are!</h2>
        <p class="text-gray-500 text-center">Here is your Leaderboard</p>

        <!-- Dropdown -->
        <div class="flex justify-center my-4">
            <label class="mr-2 text-gray-600">Showing:</label>
            <select class="border rounded px-2 py-1">
                <option>Overall</option>
            </select>
        </div>

        <!-- Top 3 -->
        <div class="grid grid-cols-3 gap-4 text-center mb-6">
            <div class="bg-gray-200 p-4 rounded-lg shadow">
                <p class="text-lg font-semibold">🥈 qhr678</p>
            </div>
            <div class="bg-gray-200 p-4 rounded-lg shadow">
                <p class="text-lg font-semibold">🥇 snehan809</p>
            </div>
            <div class="bg-gray-200 p-4 rounded-lg shadow">
                <p class="text-lg font-semibold">🥉 br7609</p>
            </div>
        </div>

        <!-- Leaderboard Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-300">
                        <th class="p-2">Username</th>
                        <th class="p-2">Rank</th>
                        <th class="p-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-gray-200">
                        <td class="p-2">@sn809</td>
                        <td class="p-2">4</td>
                        <td class="p-2">400</td>
                    </tr>
                    <tr class="text-white">
                        <td class="p-2">@ayushi123</td>
                        <td class="p-2">5</td>
                        <td class="p-2">367</td>
                    </tr>
                    <tr class="bg-gray-200">
                        <td class="p-2">@ruchi4567</td>
                        <td class="p-2">6</td>
                        <td class="p-2">340</td>
                    </tr>
                    <tr class="bg-gray-300">
                        <td class="p-2">@frenny56789</td>
                        <td class="p-2">7</td>
                        <td class="p-2">320</td>
                    </tr>
                    <tr class="bg-gray-200">
                        <td class="p-2">@vijay678</td>
                        <td class="p-2">8</td>
                        <td class="p-2">318</td>
                    </tr>
                    <tr class="bg-gray-300">
                        <td class="p-2">@brinda670988</td>
                        <td class="p-2">9</td>
                        <td class="p-2">310</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Footer />
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import UserProfileIcon from "../layout/UserProfileIcon.vue";
export default {
    components: {
        UserProfileIcon,
        Navbar,
        Footer,

    }
}

</script>

<style scoped></style>