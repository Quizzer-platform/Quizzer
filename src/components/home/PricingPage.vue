<template>
  <div class="relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16">
    <Navbar />

    <div class="flex flex-col items-center justify-center m-7">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 text-center m-7">
  Choose the <span class="text-teal-600">Perfect Plan</span> for Your 
  {{ orgId ? "Organization" : "Quizzes" }}
</h2>


      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div 
  v-for="plan in plans" 
  :key="plan.name" 
  class="relative border rounded-xl p-8 shadow-lg bg-white hover:shadow-2xl hover:scale-105 hover:bg-teal-50 transition-all duration-300"
  :class="{
    'border-teal-700': plan.name === 'Pro Plan',
    'border-teal-500': plan.name === 'Starter Plan',
    'border-gray-300': plan.name === 'Free'
  }"
>

<div class="absolute top-0 left-0 w-full h-12 rounded-t-xl"></div>

          <h3 class="text-2xl text-center font-semibold text-gray-800 mt-6">{{ plan.name }}</h3>
          <p class="text-gray-500 text-center mt-2">{{ plan.description }}</p>

          <!-- Price Display -->
          <p class="text-3xl font-bold text-center text-gray-900 mt-4">{{ plan.price }}</p>

          <button 
            class="mt-6 w-full bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 transition-all duration-300 shadow-md cursor-pointer"
            @click="selectPlan(plan)"
          >
            Get Started
          </button>

          <hr class="my-4 border-gray-300">

          <!-- Plan Benefits -->
          <ul class="text-left text-gray-700 space-y-2">
            <li>✔ {{ plan.noOfQuizzes }} quizzes available</li>
            <!-- <li>✔ {{ plan.maxQuestionsPerQuiz }} questions per quiz</li>
            <li>✔ {{ plan.reports }} reports access</li>
            <li>✔ {{ plan.users }} users allowed</li> -->
          </ul>
        </div>
      </div>
      <!-- Popup Modal for Organizations -->
<div v-if="showModal" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
    <h3 class="text-lg sm:text-xl font-semibold text-red-600">
      This Plan is for Individual Users Only
    </h3>
    <p class="text-gray-600 mt-2 text-sm sm:text-base">
      The Free plan lets users take 5 quizzes before subscribing. Organizations need a paid plan to create quizzes.
    </p>
    <button 
      @click="showModal = false" 
      class="mt-4 w-full sm:w-auto px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
    >
      OK
    </button>
  </div>
</div>
      <!-- Features Comparison Table -->
      <div class="max-w-5xl w-full mt-12">
        <h3 class="text-2xl font-semibold text-gray-800 text-center mb-6">Feature Comparison</h3>
        <table class="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-3 text-gray-800">Feature</th>
              <th class="border border-gray-300 p-3 text-gray-800">Free</th>
              <th class="border border-gray-300 p-3 text-gray-800">Starter Plan</th>
              <th class="border border-gray-300 p-3 text-gray-800">Pro Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-100 transition-all duration-200">
              <td class="border border-gray-300 p-3 text-gray-700 font-medium">{{ feature.name }}</td>
              <td class="border border-gray-300 p-3">{{ feature.free }}</td>
              <td class="border border-gray-300 p-3">{{ feature.starter }}</td>
              <td class="border border-gray-300 p-3">{{ feature.pro }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import { ref as dbRef, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/firebase";

export default {
  components: { Navbar, Footer },
  setup() {
    const router = useRouter();

    return { router };
  },
  data() {
    return {
      orgId: null, // Will store organization ID if the user is an organization
      showModal: false, // Controls popup display
      plans: [
        { name: "Free", description: "Basic access", price: "EGP 0", noOfQuizzes: "5", maxQuestionsPerQuiz: "10"},
        { name: "Starter Plan", description: "For small teams", price: "EGP 1000", noOfQuizzes: "20", maxQuestionsPerQuiz: "30"},
        { name: "Pro Plan", description: "Advanced features", price: "EGP 3000", noOfQuizzes: "50", maxQuestionsPerQuiz: "Unlimited"},
      ],
      features: [
        { name: "Number of Quizzes", free: "5", starter: "20", pro: "50" },
        { name: "Max Questions per Quiz", free: "10", starter: "30", pro: "60" },
        // { name: "Quiz Reports", free: "Basic", starter: "Detailed", pro: "Full Insights" },
        // { name: "Admin Users", free: "1 Admin", starter: "5 Admins", pro: "Unlimited" },
        { name: "Scheduled Quiz Option", free: "✖", starter: "✔", pro: "✔" },
        { name: "Custom Branding", free: "✖", starter: "✔", pro: "✔" },
      ],
    };
  },
  async mounted() {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        this.orgId = snapshot.val().organizationId || null;
        console.log("User's organization ID:", this.orgId); // ✅ Debugging Log
      } else {
        console.log("User record not found in database.");
      }
    } else {
      console.log("No user is logged in.");
    }
  });
},
  methods: {
    selectPlan(plan) {
    console.log("Selected Plan:", plan.name); // ✅ Debugging Log
    console.log("orgId:", this.orgId); // ✅ Debugging Log

    if (plan.name === "Free") {
      if (this.orgId) {
        console.log("Organization trying to get Free plan. Showing modal."); // ✅ Debugging Log
        this.showModal = true;
      } else {
        console.log("Redirecting individual user to quizzes page...");
        this.$router.push("/quizzes");
      }
    } else {
      console.log("Redirecting to payment page...");
      this.$router.push({
        path: "/payment",
        query: {
          name: plan.name,
          price: plan.price,
          description: plan.description,
          noOfQuizzes: plan.noOfQuizzes,
        },
      });
    }
  },
  },
};
</script>
