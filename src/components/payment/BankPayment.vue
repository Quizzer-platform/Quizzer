<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">Bank Payment</h3>
    <select class="w-full p-2 border rounded cursor-pointer">
      <option>Select Bank</option>
      <option>Access Bank</option>
      <option>Bank A</option>
      <option>Bank B</option>
    </select>
    <label class="block mt-2 text-lg font-semibold">Enter Your Bank Account Number</label>
    <input type="text" placeholder="0123456789" class="w-full p-2 border rounded mt-1" />
    <button class="w-full mt-4 bg-teal-800 text-white py-2 rounded cursor-pointer hover:bg-teal-900">Pay</button>
  </div>
</template>