    <template>
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="flex w-3/4 h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Left Side - Form -->
            <div class="w-1/2 p-10 flex flex-col justify-center">
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
                    <a href="#" class="text-teal-600 text-sm ">Forgot password?</a>
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
    
            <!-- Right Side - Image -->
            <div class="w-1/2 bg-teal-900 flex flex-col justify-center items-center p-10 relative h-full">
                <img :src="imageUrl" alt="Woman with tablet" class="rounded-lg">
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
            imageUrl 

        };
        },
        methods: {
        handleLogin() {
            console.log("Login Data:", this.email, this.password);
        },
        },
    };
    </script>
    