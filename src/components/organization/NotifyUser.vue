<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1a202c] p-6">
        <div class="container mx-auto max-w-2xl">
        <div class="flex items-center mb-6">
            <button 
                @click="$router.push('/organization')" 
                class="flex items-center gap-2 text-white bg-teal-600 hover:bg-teal-700 
                       px-4 py-2 rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-lg font-medium">Back to Dashboard</span>
            </button>
        </div>

        <form @submit.prevent="sendEmail" class="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-teal-500 text-center">Contact User</h2>

            <div class="space-y-4">
                <!-- <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                    <input v-model="OrganizationName" type="text" placeholder="Organization Name"
                        class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600
                               focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 dark:text-white" required>
                </div> -->

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">User Name</label>
                    <input v-model="name" type="text" placeholder="User Name"
                        class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600
                               focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 dark:text-white" required>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">User Email</label>
                    <input v-model="email" type="email" placeholder="User Email"
                        class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600
                               focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 dark:text-white" required>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Code</label>
                    <input v-model="quizcode" type="text" placeholder="Quiz Code"
                        class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600
                               focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 dark:text-white" required>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Website Link</label>
                    <input v-model="message" type="text" placeholder="Website Link"
                        class="mt-2 p-3 w-full bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600
                               focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 dark:text-white" required>
                </div>
            </div>

            <div class="flex justify-center">
                <button type="submit"
                    class="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 
                           transition-all duration-300 shadow-md cursor-pointer">
                    Send Message
                </button>
            </div>
        </form>

        <!-- Confirmation Popup -->
        <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-black/40">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center transform scale-95 transition-transform duration-300">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">✅ Message Sent!</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Your message has been successfully sent to the user.</p>
                <button @click="redirectToDashboard"
                    class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300 cursor-pointer">
                    OK
                </button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import emailjs from "@emailjs/browser";

export default {
    data() {
        return {
            OrganizationName: "",
            name: "",
            email: "",
            quizcode: "",
            message: "",
            showPopup: false, // Controls popup visibility
        };
    },
    methods: {
        async sendEmail() {
            try {
                const serviceID = "service_vfqov6e";
                const templateID = "template_jple4br";
                const publicKey = "wQb6IC1fjIt3_eUVs";

                const templateParams = {
                    OrganizationName: this.OrganizationName,
                    to_name: this.name,
                    user_email: this.email,
                    quizcode: this.quizcode,
                    message: this.message,
              };
               // Show success popup
                this.showPopup = true;
                await emailjs.send(serviceID, templateID, templateParams, publicKey);
                // Reset form fields
                this.OrganizationName = "";
                this.name = "";
                this.email = "";
                this.quizcode = "";
                this.message = "";
            } catch (error) {
                console.error("Error while sending:", error);
                alert("An error occurred while sending your message.");
            }
        },
        redirectToDashboard() {
            this.showPopup = false;
            this.$router.push('/organization');
        }
    }
};
</script>

<style>
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #374151 inset !important; /* Match dark input background */
  -webkit-text-fill-color: white !important;
  caret-color: white;
  transition: background-color 9999s ease-in-out 0s;
}
</style>

