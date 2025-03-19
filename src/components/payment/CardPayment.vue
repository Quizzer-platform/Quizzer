<template>
  <div
    class="p-8 rounded-2xl shadow-lg text-center transition-all duration-300 
           bg-white dark:bg-gray-900 dark:text-white"
  >
    <h2 class="text-2xl font-semibold">Complete Your Payment</h2>

    <!-- ✅ Display the Selected Plan Details -->
    <div
      class="p-4 rounded-lg shadow-md mt-4 transition-all duration-300 
             bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-xl font-semibold text-teal-800 dark:text-teal-400">
        {{ plan.name }}
      </h3>
      <p class="text-gray-600 dark:text-gray-300">{{ plan.description }}</p>
      <p class="text-lg font-bold text-gray-900 dark:text-white mt-2">
        {{ plan.price }}
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        Includes {{ plan.noOfQuizzes }} quizzes
      </p>
    </div>

    <p class="text-gray-600 dark:text-gray-300 mt-2">
      Enter your card details below.
    </p>

    <div
  id="card-element"
  class="p-4 border rounded-lg shadow-sm mt-4 transition-all duration-300
         bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
></div>


    <button
      @click="handlePayment"
      :disabled="loading"
      class="w-full mt-6 py-3 px-6 font-semibold rounded-xl transition-all duration-300 
             text-white bg-teal-700 hover:bg-teal-800 
             disabled:bg-gray-400 disabled:cursor-not-allowed 
             dark:bg-teal-600 dark:hover:bg-teal-700 dark:disabled:bg-gray-600"
    >
      <span v-if="loading" class="animate-spin mr-2">🔄</span>
      {{ loading ? "Processing..." : "Pay Now" }}
    </button>

    <p
      v-if="message"
      class="mt-4 transition-all duration-300"
      :class="success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
    >
      {{ message }}
    </p>
  </div>
</template>
<script>
import { loadStripe } from "@stripe/stripe-js";
import { ref as dbRef, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/firebase";

export default {
  props: {
    plan: Object, // ✅ Receive the plan data as a prop
  },
  data() {
    return {
      stripe: null,
      card: null,
      loading: false,
      message: "",
      success: false,
      orgId: null,
    };
  },
  async mounted() {
    // ✅ Get the logged-in user's organization ID
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = dbRef(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          this.orgId = snapshot.val().organizationId; // ✅ Store the correct org ID
        }
      }
    });

    // ✅ Initialize Stripe
    this.stripe = await loadStripe("pk_test_51R0kXTRu6toYuCYk6mJ5esWZiXlXxwBFUxM02KKVCybK3vAgC4KPPh5aZz82MDlwTkSWm5AXezIABFoK7cWXlT9P00cF9kiclK");
    const elements = this.stripe.elements();
    this.card = elements.create("card", {
    style: {
      base: {
      fontSize: "16px",
      color: "#757575", // Light gray (better contrast in dark mode)
      backgroundColor: "transparent", // Ensures it blends well with the parent container
      "::placeholder": { color: "#9CA3AF" }, // Adjusted for better visibility
      iconColor: "#9CA3AF", // Ensures icons (e.g., card logo) are visible
    },
      dark: {
        color: "#E5E7EB",       // Tailwind gray-100
      backgroundColor: "#1F2937", // Tailwind gray-800
      "::placeholder": {
        color: "#9CA3AF",     // Tailwind gray-400
      },
      iconColor: "#9CA3AF"
      },
    },
    disableLink: true, // ✅ Disable the autofill link
  });

  this.card.mount("#card-element");
  },
  methods: {
    async handlePayment() {
      this.loading = true;
      this.message = "";

      try {
        const response = await fetch("http://localhost:4001/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 5000 }), // Replace with dynamic amount
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create payment");

        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: "card",
          card: this.card,
        });

        if (error) throw new Error(error.message);

        const result = await this.stripe.confirmCardPayment(data.clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.success = true;
          this.message = "✅ Payment successful!";

          // ✅ Save the plan in Firebase after successful payment
          if (this.orgId) {
            await this.savePlanInDatabase();
          }
          // ✅ Redirect to confirmation page
          setTimeout(() => {
  this.$router.push({
    path: "/payment/confirmation",
    query: {
      name: this.plan.name,
      price: this.plan.price,
      description: this.plan.description,
      noOfQuizzes: this.plan.noOfQuizzes,
    },
  });
}, 1000);
        }
      } catch (error) {
        this.success = false;
        this.message = `❌ Error: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    async savePlanInDatabase() {
      try {
        const orgRef = dbRef(database, `organizations/${this.orgId}/plans`);
        const snapshot = await get(orgRef);
        const existingPlans = snapshot.exists() ? snapshot.val() : [];

        // ✅ Append the new plan
        const updatedPlans = [...existingPlans, this.plan];

        // ✅ Update Firebase with the selected plan
        await update(dbRef(database, `organizations/${this.orgId}`), {
          plans: updatedPlans,
        });

        console.log("Plan saved successfully in Firebase.");
      } catch (error) {
        console.error("Error saving plan in Firebase:", error);
      }
    },
  },
};
</script>
