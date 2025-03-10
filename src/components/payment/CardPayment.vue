<template>
  <div class="bg-white p-8 rounded-2xl shadow-lg text-center">
    <h2 class="text-2xl font-semibold">Complete Your Payment</h2>
    <p class="text-gray-600 mt-2">Enter your card details below.</p>

    <div id="card-element" class="p-4 border rounded-lg bg-gray-50 shadow-sm mt-4"></div>

    <button
      @click="handlePayment"
      :disabled="loading"
      class="w-full mt-6 py-3 px-6 text-white font-semibold rounded-xl transition-all duration-300"
      :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800'"
    >
      <span v-if="loading" class="animate-spin mr-2">🔄</span>
      {{ loading ? "Processing..." : "Pay Now" }}
    </button>

    <p v-if="message" :class="success ? 'text-green-600' : 'text-red-600'" class="mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  data() {
    return {
      stripe: null,
      card: null,
      loading: false,
      message: "",
      success: false,
    };
  },
  async mounted() {
    this.stripe = await loadStripe("pk_test_51R0kXTRu6toYuCYk6mJ5esWZiXlXxwBFUxM02KKVCybK3vAgC4KPPh5aZz82MDlwTkSWm5AXezIABFoK7cWXlT9P00cF9kiclK");
    const elements = this.stripe.elements();
    this.card = elements.create("card", {
      style: {
        base: { fontSize: "16px", color: "#333", "::placeholder": { color: "#888" } },
      },
      link: { enabled: false },
      paymentRequestButton: false 
    });
    // this.card.link.enabled = false;
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

      // Redirect to the confirmation page after 2 seconds
      setTimeout(() => {
        this.$router.push("/payment/confirmation");
      }, 1000);
    }
  } catch (error) {
    this.success = false;
    this.message = `❌ Error: ${error.message}`;
  } finally {
    this.loading = false;
  }
}
  },
};
</script>
