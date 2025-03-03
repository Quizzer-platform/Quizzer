    <template>
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="flex w-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Left Side - Form -->
            <div class="w-1/2 p-10">
            <h2 class="text-2xl font-semibold text-teal-600 mb-6">Get Started Now</h2>
            <form @submit.prevent="handleSignup">
                <div class="mb-4">
                <label class="block text-gray-700">Name</label>
                <input v-model="name" type="text" placeholder="Enter your name" class="w-full p-2 border rounded-lg">
                </div>
                <div class="mb-4">
                <label class="block text-gray-700">Email address</label>
                <input v-model="email" type="email" placeholder="Enter your email" class="w-full p-2 border rounded-lg">
                </div>
                <div class="mb-4">
                <label class="block text-gray-700">Password</label>
                <input v-model="password" type="password" placeholder="Enter your password" class="w-full p-2 border rounded-lg">
                </div>
                <div class="mb-4">
                <label class="block text-gray-700">Phone</label>
                <input v-model="phone" type="text" placeholder="Enter your phone number" class="w-full p-2 border rounded-lg">
                </div>
                <div class="mb-4 flex items-center">
                <input v-model="termsAccepted" type="checkbox" class="mr-2">
                <label class="text-gray-600 text-sm">I agree to the <a href="#" class="text-teal-600">terms & policy</a></label>
                </div>
                <button class="w-full bg-teal-600 text-white py-2 rounded-lg">Signup</button>
                <p class="text-center mt-4 text-gray-600">
                Have an account? <router-link to="/login" class="text-teal-600">Sign In</router-link>
                </p>
            </form>
            </div>
    
            <!-- Right Side - Image -->
            <div class="w-1/2 bg-teal-900 flex items-center justify-center p-10 relative">
                <img :src="imageUrl" alt="Woman with tablet" class="rounded-lg">
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import imageUrl from "@/assets/img1.PNG";
    export default {
        data() {
        return {
            name: "",
            email: "",
            password: "",
            phone: "",
            termsAccepted: false,
            imageUrl
        };
        },
        methods: {
        handleSignup() {
            console.log("Signup Data:", this.name, this.email, this.password, this.phone);
        },
        },
    };
    </script>
    