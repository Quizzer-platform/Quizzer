<template >
  <div class=" relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16 ">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-100 to-teal-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
<Navbar>
  <template v-slot:canChange>
            <UserProfileIcon />
        </template>
</Navbar>
    <div class="max-w-2xl mx-auto p-6 shadow-md rounded-lg mt-6">
    <h2 class="text-xl font-semibold mb-4">Payment</h2>
    <!-- <div class="mb-4">
      <label class="flex items-center space-x-2">
        <input type="radio" v-model="selectedMethod" value="card" /> Card
      </label>
      <label class="flex items-center space-x-2">
        <input type="radio" v-model="selectedMethod" value="bank" /> Bank
      </label>
      <label class="flex items-center space-x-2">
        <input type="radio" v-model="selectedMethod" value="transfer" /> Transfer
      </label>
    </div> -->
    
    <CardPayment v-if="selectedMethod === 'card'" :plan="selectedPlan" />
    <BankPayment v-if="selectedMethod === 'bank'" />
    <TransferPayment v-if="selectedMethod === 'transfer'" />
  </div>
  </div>
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import CardPayment from './CardPayment.vue';
import BankPayment from './BankPayment.vue';
import TransferPayment from './TransferPayment.vue';
import UserProfileIcon  from "../layout/UserProfileIcon.vue"
export default {
  components: { CardPayment, BankPayment, TransferPayment ,Navbar,UserProfileIcon },
  data() {
    return {
      selectedMethod: "card", // Default selection
      selectedPlan: null,
    };
  },
  created() {
    // ✅ Retrieve the plan from the route query parameters
    this.selectedPlan = {
      name: this.$route.query.name || "No Plan Selected",
      price: this.$route.query.price || "N/A",
      description: this.$route.query.description || "",
      noOfQuizzes: this.$route.query.noOfQuizzes || "N/A",
    };
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
