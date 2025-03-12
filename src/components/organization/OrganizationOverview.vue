<template>
    <div
        class="bg-white rounded-lg shadow-md mt-6 mx-4 md:mx-6 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center h-auto lg:h-60">
        <!-- Left Content -->
        <div class="max-w-2xl px-4 md:px-6 lg:px-10 text-center md:text-left">
            <h2 class="text-2xl sm:text-3xl font-bold text-teal-900 mb-3 sm:mb-4">Time to Manage Your Quizzes!</h2>
            <p class="text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                ay motivation Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmodadipiscing elit, sed do eiusmod.
            </p>
            <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                    class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                    @click="createQuiz">CREATE QUIZ</button>
                <button
                    class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer"
                    @click="viewQuiz">VIEW
                    / EDIT QUIZ</button>
                <button  @click="$router.push('/notifyuser')" class="bg-teal-900 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 rounded-md shadow-md cursor-pointer">CONTACT USER</button>
            </div>
        </div>

        <div class="mt-6 md:mt-0 flex justify-center md:justify-end w-full md:w-auto md:flex-1">
            <img src="../../assets/AdminImg.svg" alt="Dashboard Illustration"
                class="h-36 md:h-40 lg:h-44 xl:h-48 w-auto">
        </div>
            <!-- Subscription Modal -->
         <div v-if="showSubscriptionModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
            <h2 class="text-xl font-bold text-red-600 mb-4">Subscription Required</h2>
            <p class="text-gray-700 mb-4">{{ subscriptionMessage }}</p>
            <div class="flex justify-center gap-4">
                <button 
                    @click="showSubscriptionModal = false"
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
                <router-link 
                    to="/pricing" 
                    class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
                >
                    View Plans
                </router-link>
            </div>
        </div>
    </div>
    </div>

</template>

<script>
import { getAuth } from "firebase/auth";

export default {
    data() {
        return {
            showSubscriptionModal: false,
            subscriptionMessage: '',
        };
    },

    methods: {
        async createQuiz() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    alert('Please login to create quizzes');
                    return;
                }

                // Fetch all organizations
                const orgResponse = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json');
                const orgsData = await orgResponse.json();
                
                // Find organization manually
                const organizationKey = Object.keys(orgsData || {}).find(
                    key => orgsData[key].adminUid === user.uid
                );

                if (!organizationKey) {
                    alert('Organization not found');
                    return;
                }

                const organization = orgsData[organizationKey];

                // ✅ Calculate total allowed quizzes by summing all plan quotas
                let totalAllowed = 0;
                if (organization.plans) {
                    Object.values(organization.plans).forEach(plan => {
                        totalAllowed += Number(plan.noOfQuizzes) || 0;
                    });
                }

                console.log(`Total allowed quizzes: ${totalAllowed}`);

                // ✅ Fetch the actual quiz count directly from Firebase
                const quizResponse = await fetch(`https://quizzer-platform-default-rtdb.firebaseio.com/organizationQuizzes.json`);
                const quizData = await quizResponse.json();

                // ✅ Filter quizzes that belong to this organization
                const currentQuizzes = Object.values(quizData || {}).filter(
                    quiz => quiz.organizationUid === user.uid
                ).length;

                console.log(`Current quizzes: ${currentQuizzes}, Allowed: ${totalAllowed}`);

                // ❌ Prevent quiz creation if limit is reached
                if (totalAllowed === 0) {
    this.subscriptionMessage = `You haven't subscribed to a plan yet. Please choose a plan to start creating quizzes.`;
    this.showSubscriptionModal = true;
    return;
}

if (currentQuizzes >= totalAllowed) {
    this.subscriptionMessage = `You've created ${currentQuizzes}/${totalAllowed} allowed quizzes. Upgrade your plan to add more.`;
    this.showSubscriptionModal = true;
    return;
}

                // ✅ Only navigate if within limit
                this.$router.push('/organization/createQuiz');
                
            } catch (error) {
                console.error('Error:', error);
                alert('Error checking quota. Please try again.');
            }
        },

        viewQuiz() {
            this.$router.push('/organization/quizzes');
        }
    }
};
</script>
