<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">Card Payment</h3>
    <input type="text" placeholder="Card Number" class="w-full p-2 border rounded mb-2" />
    <div class="flex space-x-2">
      <input type="text" placeholder="MM/YY" class="w-1/2 p-2 border rounded" />
      <input type="text" placeholder="CVV" class="w-1/2 p-2 border rounded" />
    </div>
    <button class="w-full mt-4 bg-teal-800 text-white py-2 rounded cursor-pointer hover:bg-teal-900">Pay</button>
  </div>
</template>