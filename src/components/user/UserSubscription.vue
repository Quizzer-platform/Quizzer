<template>
    <div class="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-[#1a202c] dark:text-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <div class="min-h-screen w-full bg-gray-100 dark:bg-[#1a202c] md:ml-54">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white dark:bg-gray-900/60 dark:text-gray-200 rounded-lg shadow-lg p-6">
                      <h1 class="text-2xl font-bold text-teal-800 dark:text-teal-400 mb-6 flex flex-col sm:flex-row sm:items-center sm: text-center">
                          Your Subscription
                          <span class="text-lg text-teal-600 dark:text-gray-400 sm:ml-2 sm:inline-block text-center sm:text-left mt-2 sm:mt-0">
                            (Total Allowed Quizzes: {{ quizzesToTake }})
                          </span>
                      </h1>
                        <div v-if="loading" class="flex flex-col justify-center items-center h-60">
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Your Subscriptions...</p>
                        </div>
                        <div v-else-if="filteredSubscriptions.length > 0" class="mb-8">
    <div v-for="(subscription, index) in filteredSubscriptions" :key="index" 
         class="bg-teal-50 dark:bg-gray-900/85 rounded-lg p-6 border border-teal-200 dark:border-gray-700 mb-4">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-semibold text-teal-800 dark:text-teal-300">
            {{ subscription.name }} Plan
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Status: 
            <span class="text-green-600 dark:text-green-400">
              Active
            </span>
          </p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-teal-800 dark:text-teal-300">
            {{ subscription.price }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Quizzes Available: {{ subscription.noOfQuizzes }}
          </p>
        </div>
      </div>

      <div class="space-y-2 mb-6">
        <h3 class="font-semibold text-gray-800 dark:text-gray-300">Features:</h3>
        <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-400">
          <li>Max Questions per Quiz: {{ getMaxQuestions(subscription.name) }}</li>
          <li>Quizzes Available: {{ subscription.noOfQuizzes }}</li>
          <li>{{ subscription.description }}</li>
        </ul>
      </div>

            <!-- <div class="flex justify-end space-x-4">
        <button @click="removePlan(subscription)" 
                class="px-4 py-2 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer transition-colors">
        Remove Plan
        </button>
            </div> -->
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
            subscriptions: [],
            loading: true,
            listener: null,
            quizzesToTake: 0, 
            features: [
            { name: "Max Questions per Quiz", free: "10", starter: "30", pro: "60" },
            ],
        };
    },
    computed: {
        userId() {
            return this.$store.state.user?.uid;
        },
        filteredSubscriptions() {
            return this.subscriptions.slice(1);
        }
    },
    methods: {
         fetchSubscriptions() {
      if (!this.userId) return;

     const userRef = dbRef(database, `users/${this.userId}`);

    this.listener = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Extract subscription plans
            this.subscriptions = userData.plans ? Object.values(userData.plans) : [];
            // Extract quizzesToTake
            this.quizzesToTake = userData.quizzesToTake || 0;
        } else {
          this.subscriptions = [];
          this.quizzesToTake = 0;
        }
        this.loading = false;
      }, (error) => {
        console.error('Error fetching subscriptions:', error);
        this.subscriptions = [];
        this.quizzesToTake = 0;
        this.loading = false;
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
        },
        getMaxQuestions(planName) {
      const planKey = this.getPlanKey(planName);
      const maxQuestionsFeature = this.features.find(f => f.name === "Max Questions per Quiz");
      return maxQuestionsFeature ? maxQuestionsFeature[planKey] : 'N/A';
    },
    // Helper to convert plan names to feature keys
    getPlanKey(planName) {
      const mapping = {
        'free': 'free',
        'starter plan': 'starter',
        'pro plan': 'pro'
      };
      return mapping[planName.toLowerCase()] || 'free';
    },
    },
    mounted() {
        this.fetchSubscriptions();
    },
    beforeUnmount() {
    if (this.listener) {
      const plansRef = dbRef(database, `users/${this.userId}/plans`);
      off(plansRef);
      this.listener = null;
    }
  }
};
</script>
