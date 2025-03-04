<template>
  
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
        :class="monthlyActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full">
        Monthly
      </button>
      <button 
        @click="monthlyActive = false; updatePricing()" 
        :class="!monthlyActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-full">
        Yearly <span class="text-xs text-green-500">(Save 30%)</span>
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl m-16">
      <div class="border rounded-lg p-6 shadow-md text-center bg-gray-200">
        <h3 class="text-xl font-semibold text-gray-700">Starter</h3>
        <p class="text-gray-500 mt-2">Starter pack to help you get started</p>
        <p class="text-2xl font-bold text-gray-800 mt-4">Free</p>
        <button class="mt-4 px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg mb-6">Get Started</button>
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
        <button class="mt-4 px-6 py-2 text-white rounded-lg bg-teal-800 hover:bg-teal-900 mb-6">Get Started</button>
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
        <button class="mt-4 px-6 py-2 text-white rounded-lg bg-teal-800 hover:bg-teal-900 mb-6">Get Started</button>
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
        <button class="mt-4 px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg mb-6">Contact Sales</button>
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
</script>
