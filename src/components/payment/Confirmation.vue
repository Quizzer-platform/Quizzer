<template>
  <div class=" relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16 ">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-100 to-teal-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
<Navbar>
  <template v-slot:canChange>
            <UserProfileIcon />
        </template>
</Navbar>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-center m-16">
    <h2 class="text-lg font-semibold">Thank You For Your Purchase</h2>
    <div class="my-4">
      <div class="w-8 h-8 mx-auto border-4 border-green-500 rounded-full animate-ping"></div>
    </div>
    <h3 class="text-xl font-bold">Order #123RGR231567Y Confirmed</h3>
    <button class="w-full mt-4 bg-teal-800 text-white py-2 rounded cursor-pointer hover:bg-teal-900">
     OK
    </button>
    <button class="w-full mt-2 text-gray-500 py-2 rounded cursor-pointer">
      Generate Receipt
    </button>
  </div> </div>
</template>

<script>
import Navbar from "../layout/Navbar.vue";
import UserProfileIcon  from "../layout/UserProfileIcon.vue"
export default {
  components: {Navbar,UserProfileIcon },
  
};
</script>
<style scoped>
/* Add any additional styles if needed */
</style>
