<template>

    <div class="flex flex-col min-h-screen bg-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <div class="min-h-screen w-full bg-gray-100 md:ml-54">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h1 class="text-2xl font-bold text-teal-800 mb-6">Your Subscription</h1>

                        <div v-if="subscription" class="mb-8">
                            <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 class="text-xl font-semibold text-teal-800">
                                            {{ subscription.plan }} Plan
                                        </h2>
                                        <p class="text-gray-600">
                                            Status: <span
                                                :class="subscription.status === 'active' ? 'text-green-600' : 'text-red-600'">
                                                {{ subscription.status }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-bold text-teal-800">${{ subscription.price }}/mo</p>
                                        <p class="text-sm text-gray-600">Next billing date:
                                            {{ subscription.nextBillingDate }}</p>
                                    </div>
                                </div>

                                <div class="space-y-2 mb-6">
                                    <h3 class="font-semibold">Features:</h3>
                                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                                        <li v-for="feature in subscription.features" :key="feature">
                                            {{ feature }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="flex justify-end space-x-4">
                                    <button @click="cancelSubscription"
                                        class="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors">
                                        Cancel Subscription
                                    </button>
                                    <button @click="upgradePlan"
                                        class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-8">
                            <div class="text-4xl mb-4">✨</div>
                            <h3 class="text-lg font-semibold mb-2">No Active Subscription</h3>
                            <p class="text-gray-600 mb-4">Upgrade to Premium to unlock all features!</p>
                            <router-link to="/pricing"
                                class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
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