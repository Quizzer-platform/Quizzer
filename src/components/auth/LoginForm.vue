    // AuthPage.vue (Responsive Login and Signup Page)
    <template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div class="flex flex-col-reverse md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <h2 class="text-2xl font-semibold text-teal-600 mb-2">Welcome back!</h2>
            <p class="text-gray-600 mb-6">Enter your credentials to access your account</p>
            <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label class="block text-gray-700">Email address</label>
                <input v-model="email" type="email" placeholder="Enter your email" class="w-full p-2 border rounded-lg">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">Password</label>
                <div>
                <input v-model="password" type="password" placeholder="Enter your password" class="w-full p-2 border rounded-lg">
                <a href="#" class="text-teal-600 text-sm">Forgot password?</a>
                </div>
            </div>
            <div class="mb-4 flex items-center">
                <input v-model="rememberMe" type="checkbox" class="mr-2">
                <label class="text-gray-600 text-sm">Remember for 30 days</label>
            </div>
            <button class="w-full bg-teal-600 text-white py-2 rounded-lg">Login</button>
            <p class="text-center mt-4 text-gray-600">
                Don't have an account? <router-link to="/signup" class="text-teal-600">Sign Up</router-link>
            </p>
            </form>
        </div>
        <div class="hidden md:flex w-1/2 bg-teal-900 items-center justify-center p-10">
            <img :src="imageUrl" alt="Woman with tablet" class="rounded-lg max-w-full">
        </div>
        
        </div>
    </div>
    </template>

    <script>
    import imageUrl from "@/assets/img2PNG.PNG";
    export default {
    data() {
        return {
        email: "",
        password: "",
        rememberMe: false,
        imageUrl,
        };
    },
    methods: {
        handleLogin() {
        console.log("Login Data:", this.email, this.password);
        },
    },
    };
    </script>