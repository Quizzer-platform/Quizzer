<template>
    <div class="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-[#1a202c] dark:text-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <div class="min-h-screen w-full bg-gray-100 dark:bg-[#1a202c] md:ml-54">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white dark:bg-gray-900/60 dark:text-gray-200 rounded-lg shadow-lg p-6">
                        <h1 class="text-2xl font-bold text-teal-800 dark:text-teal-400 mb-6">Your Subscription</h1>
                        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Recent Quizzes...</p>
                        </div>
                        <div v-else-if="subscription" class="mb-8">
                            <div class="bg-teal-50 dark:bg-gray-900/85 rounded-lg p-6 border border-teal-200 dark:border-gray-700">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 class="text-xl font-semibold text-teal-800 dark:text-teal-300">
                                            {{ subscription.plan }} Plan
                                        </h2>
                                        <p class="text-gray-600 dark:text-gray-400">
                                            Status: 
                                            <span :class="subscription.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                                {{ subscription.status }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-bold text-teal-800 dark:text-teal-300">
                                            ${{ subscription.price }}/mo
                                        </p>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">
                                            Next billing date: {{ subscription.nextBillingDate }}
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-2 mb-6">
                                    <h3 class="font-semibold text-gray-800 dark:text-gray-300">Features:</h3>
                                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-400">
                                        <li v-for="feature in subscription.features" :key="feature">
                                            {{ feature }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="flex justify-end space-x-4">
                                    <button @click="cancelSubscription"
                                        class="px-4 py-2 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
                                        Cancel Subscription
                                    </button>
                                    <button @click="upgradePlan"
                                        class="px-4 py-2 bg-teal-600 text-white dark:bg-teal-700 dark:hover:bg-teal-600 rounded transition-colors">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-8">
                            <div class="text-4xl mb-4">✨</div>
                            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">
                                No Active Subscription
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">
                                Upgrade to Premium to unlock all features!
                            </p>
                            <router-link to="/pricing"
                                class="bg-teal-600 text-white dark:bg-teal-700 dark:hover:bg-teal-600 px-6 py-2 rounded-lg transition-colors">
                                View Plans
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as dbRef, onValue, off } from 'firebase/database';
import { database } from '@/firebase';
import UserSidebar from './UserSidebar.vue';

export default {
    name: 'UserSubscription',
    components: {
        UserSidebar
    },
    data() {
        return {
            isMenuOpen: false,
            subscription: null,
            listener: null
        };
    },
    computed: {
        userId() {
            return this.$store.state.user?.uid;
        }
    },
    methods: {
        fetchSubscription() {
            if (!this.userId) return;

            const subscriptionRef = dbRef(database, `userSubscriptions/${this.userId}`);
            this.listener = onValue(subscriptionRef, (snapshot) => {
                this.subscription = snapshot.val();
            }, (error) => {
                console.error('Error fetching subscription:', error);
                this.subscription = null;
            });
        },
        async cancelSubscription() {
            try {
                // Implement subscription cancellation logic
                console.log('Cancelling subscription...');
            } catch (error) {
                console.error('Error cancelling subscription:', error);
            }
        },
        upgradePlan() {
            try {
                // Implement plan upgrade logic
                console.log('Upgrading plan...');
            } catch (error) {
                console.error('Error upgrading plan:', error);
            }
        }
    },
    mounted() {
        this.fetchSubscription();
    },
    beforeUnmount() {
        try {
            if (this.listener) {
                const subscriptionRef = dbRef(database, `userSubscriptions/${this.userId}`);
                off(subscriptionRef);
                this.listener = null;
            }
        } catch (error) {
            console.error('Error cleaning up listeners:', error);
        }
    }
};
</script>