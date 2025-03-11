<!-- <template>
  
  <div class=" relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16 ">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-100 to-teal-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    <Navbar/>
    <div class="flex flex-col items-center justify-center m-7 ">
   
    <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 m-7">
      We offer great <span class="text-teal-600">price</span> plan for the application
    </h2>
    
    <div class="flex items-center space-x-2 mb-6">
      <button 
        @click="monthlyActive = true; updatePricing()" 
        :class="monthlyActive ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full cursor-pointer">
        Monthly
      </button>
      <button 
        @click="monthlyActive = false; updatePricing()" 
        :class="!monthlyActive ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full cursor-pointer">
        Yearly <span class="text-xs text-black">(Save 30%)</span>
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl m-16">
      <div class="border rounded-lg p-6 shadow-md text-center bg-gray-200">
        <h3 class="text-xl font-semibold text-gray-700">Starter</h3>
        <p class="text-gray-500 mt-2">Starter pack to help you get started</p>
        <p class="text-2xl font-bold text-gray-800 mt-4">Free</p>
        <button class="mt-4 px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg mb-6 cursor-pointer">Get Started</button>
        <hr>
        <ul class="text-left mt-4 text-gray-600">
          <li>✔ 5 free tests and 5 custom questions</li>
          <li>✔ Qualifying questions</li>
          <li>✔ Invite unlimited candidates</li>
          <li>✔ Post remote jobs on our job board</li>
        </ul>
      </div>
      
      <div class="border rounded-lg p-6 bg-white shadow-md text-center">
        <h3 class="text-xl font-semibold text-gray-700">Pro</h3>
        <p class="text-gray-500 mt-2">More power for small teams</p>
        <p class="text-2xl font-bold text-gray-800 mt-4">{{ proPrice }}</p>
        <button class="mt-4 px-6 py-2 text-white rounded-lg bg-teal-800 hover:bg-teal-900 mb-6 cursor-pointer">Get Started</button>
        <hr>
        <ul class="text-left mt-4 text-gray-600">
          <li>✔ All 400+ tests in the test library</li>
          <li>✔ Unlimited active assessments</li>
          <li>✔ Create custom essay, multiple-choice, and file-upload questions</li>
        </ul>
      </div>
      
      <div class="border rounded-lg p-6 shadow-md text-center bg-gray-200">
        <h3 class="text-xl font-semibold text-gray-700">Business+</h3>
        <p class="text-gray-500 mt-2">For companies that need to manage work</p>
        <p class="text-2xl font-bold text-gray-800 mt-4">{{ businessPrice }}</p>
        <button class="mt-4 px-6 py-2 text-white rounded-lg bg-teal-800 hover:bg-teal-900 mb-6 cursor-pointer">Get Started</button>
        <hr>
        <ul class="text-left mt-4 text-gray-600">
          <li>✔ Everything in the Starter plan, plus...</li>
          <li>✔ ATS integration</li>
          <li>✔ Custom branded assessments</li>
          <li>✔ Video questions</li>
        </ul>
      </div>
      
      <div class="border rounded-lg p-6 bg-white shadow-md text-center">
        <h3 class="text-xl font-semibold text-gray-700">Enterprise</h3>
        <p class="text-gray-500 mt-2">For enterprises that need additional security</p>
        <p class="text-2xl font-bold text-gray-800 mt-4">Custom</p>
        <button class="mt-4 px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg mb-6 cursor-pointer">Contact Sales</button>
        <hr>
        <ul class="text-left mt-4 text-gray-600">
          <li>✔ Enhanced security</li>
          <li>✔ Dedicated account management</li>
          <li>✔ API access and integrations</li>
          <li>✔ Priority customer support</li>
        </ul>
      </div>
    </div>
  </div>


  </div>
  <Footer/>
  
</template>

<script>
  import Navbar from "../layout/Navbar.vue";
  import Footer from "../layout/Footer.vue"
export default {
  components:{
    Navbar,
    Footer
  },
  data() {
    return {
      monthlyActive: true,
      proPrice: "$20 / month",
      businessPrice: "$100 / month"
    };
  },
  methods: {
    updatePricing() {
      if (this.monthlyActive) {
        this.proPrice = "$20 / month";
        this.businessPrice = "$100 / month";
      } else {
        this.proPrice = "$140 / year";
        this.businessPrice = "$700 / year";
      }
    }
  }
};
</script> -->

<template>
  <div class="relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16">
    <Navbar />
    <div class="flex flex-col items-center justify-center m-7">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 m-7">
        We offer great <span class="text-teal-600">price</span> plan for the application
      </h2>

      <div class="flex items-center space-x-2 mb-6">
        <button @click="monthlyActive = true; updatePricing()" 
                :class="monthlyActive ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-4 py-2 rounded-full cursor-pointer">
          Monthly
        </button>
        <button @click="monthlyActive = false; updatePricing()" 
                :class="!monthlyActive ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-4 py-2 rounded-full cursor-pointer">
          Yearly <span class="text-xs text-black">(Save 30%)</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl m-16">
        <div v-for="plan in plans" :key="plan.name" class="border rounded-lg p-6 shadow-md text-center bg-white">
          <h3 class="text-xl font-semibold text-gray-700">{{ plan.name }}</h3>
          <p class="text-gray-500 mt-2">{{ plan.description }}</p>
          <p class="text-2xl font-bold text-gray-800 mt-4">{{ plan.price }}</p>
          <button class="mt-4 px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg mb-6 cursor-pointer" @click="selectPlan(plan)">
            Get Started
          </button>
          <hr>
          <ul class="text-left mt-4 text-gray-600" v-if="plan.name=='Free'">
            <!-- <li v-for="feature in plan.features" :key="feature">✔ {{ plan.noOfQuizzes }}</li> -->
             <li> ✔  Kickstart your journey with {{ plan.noOfQuizzes}} free tests! No risk, just learning!</li>
          </ul>
          <ul class="text-left mt-4 text-gray-600" v-else-if="plan.name=='Starter Plan'">
            <!-- <li v-for="feature in plan.features" :key="feature">✔ {{ plan.noOfQuizzes }}</li> -->
             <li> ✔  Empower your team with {{ plan.noOfQuizzes}} custom quizzes! Boost learning and engagement!</li>
          </ul>
          <ul class="text-left mt-4 text-gray-600" v-else-if="plan.name=='Pro Plan'">
            <!-- <li v-for="feature in plan.features" :key="feature">✔ {{ plan.noOfQuizzes }}</li> -->
             <li> ✔ Unleash limitless potential with {{ plan.noOfQuizzes}} quizzes! Elevate your training game!</li>
          </ul>
          <!-- <ul class="text-left mt-4 text-gray-600">
            <li v-for="feature in plan.features" :key="feature">✔ {{ plan.noOfQuizzes }}</li>
             <li v-for="feature in plan.features"> plan.noOfQuizzes</li>
          </ul> -->
        </div>
      </div>

      <div class="max-w-5xl w-full mt-10">
        <h3 class="text-xl font-semibold text-gray-700 text-center mb-4">Features Comparison</h3>
        <table class="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2">Feature</th>
              <th class="border border-gray-300 p-2">Free</th>
              <th class="border border-gray-300 p-2">Starter Plan</th>
              <th class="border border-gray-300 p-2">Pro Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in features" :key="feature.name">
              <td class="border border-gray-300 p-2">{{ feature.name }}</td>
              <td class="border border-gray-300 p-2">{{ feature.free }}</td>
              <td class="border border-gray-300 p-2">{{ feature.starter }}</td>
              <td class="border border-gray-300 p-2">{{ feature.pro }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import { onMounted, ref as vueRef, nextTick } from "vue";
import { ref as dbRef, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/firebase";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";

export default {
  components: { Navbar, Footer },
  setup() {
    const stripe = vueRef(null);
    const elements = vueRef(null);
    const card = vueRef(null);
    const router = useRouter();

    onMounted(async () => {
      stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (!stripe.value) {
        console.error("Stripe failed to load.");
        return;
      }
      
      elements.value = stripe.value.elements();
      card.value = elements.value.create("card", {
        hidePostalCode: true,
        link: { enabled: false },
      });

      await nextTick();
      card.value.mount("#card-element");
    });

    const handleSubmit = async () => {
      if (!stripe.value || !card.value) {
        console.error("Stripe or Card element not initialized");
        return;
      }

      const { paymentMethod, error } = await stripe.value.createPaymentMethod({
        type: "card",
        card: card.value,
      });

      if (error) {
        console.error("Payment Error:", error.message);
      } else {
        console.log("Payment Success:", paymentMethod);
      }
    };

    const goToPaymentPage = () => {
      router.push("/payment");
    };

    return { handleSubmit, goToPaymentPage, stripe, elements, card };
  },
  data() {
    return {
      userData: null,
      userId: null, // Store user ID
      orgId: null,      monthlyActive: true,
      plans: [
        { name: "Free", description: "Basic access", price: "Free", noOfQuizzes: "5" },
        { name: "Starter Plan", description: "For small teams", price: "EGP 1000 / month", noOfQuizzes: "20" },
        { name: "Pro Plan", description: "Advanced features", price: "EGP 3000 / month", noOfQuizzes: "70" },
      ],
      features: [
        { name: "Edge content delivery", free: "✔", starter: "✔", pro: "✔" },
        { name: "Custom domains", free: "1", starter: "3", pro: "Unlimited" },
        { name: "Team members", free: "3", starter: "20", pro: "Unlimited" },
        { name: "Single sign-on (SSO)", free: "-", starter: "-", pro: "✔" },
        { name: "Advanced analytics", free: "✔", starter: "✔", pro: "✔" },
        { name: "Basic reports", free: "-", starter: "✔", pro: "✔" },
        { name: "Professional reports", free: "-", starter: "-", pro: "✔" },
      ],
    };
  },
  created() {
        this.fetchOrganizationId();
  },
  methods: {
        async fetchOrganizationId() {
      const auth = getAuth();

      return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            console.error("User not logged in");
            reject("No user");
            return;
          }

          try {
            this.userId = user.uid; // ✅ Store the logged-in user ID
            console.log("User ID:", this.userId);

            // 🔹 Fetch organization ID from users collection
            const userRef = dbRef(database, `users/${this.userId}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              this.orgId = snapshot.val().organizationId; // ✅ Correct organization ID
              console.log("Fetched Organization ID:", this.orgId);
              resolve(this.orgId);
            } else {
              console.error("User data not found");
              reject("User data not found");
            }
          } catch (error) {
            console.error("Error fetching organization ID:", error);
            reject(error);
          }
        });
      });
    },
    updatePricing() {
      if (this.monthlyActive) {
        this.plans[1].price = "EGP 1000 / month";
        this.plans[2].price = "EGP 3000 / month";
      } else {
        this.plans[1].price = "EGP 10000 / year";
        this.plans[2].price = "EGP 30000 / year";
      }
    },
     async selectPlan(plan) {
    if (!this.orgId) {
      alert("Organization ID not found.");
      return;
    }

    // ✅ Redirect to the Payment Page with plan details (but don't save it yet)
    this.$router.push({
      path: "/payment",
      query: {
        name: plan.name,
        price: plan.price,
        description: plan.description,
        noOfQuizzes: plan.noOfQuizzes,
      },
    });
  },
  },
};
</script>
