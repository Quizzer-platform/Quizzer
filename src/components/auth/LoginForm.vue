// AuthPage.vue (Responsive Login and Signup Page)
    <template>
        <Navbar />
        <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div
                class="flex flex-col-reverse md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

                <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                    <h2 class="text-2xl font-semibold text-teal-600 mb-2">Welcome back!</h2>
                    <p class="text-gray-600 mb-6">Enter your credentials to access your account</p>
                    <form @submit.prevent="handleLogin">
                        <div class="mb-4">
                            <label class="block text-gray-700">Email address</label>
                            <input v-model="email" type="email" placeholder="Enter your email"
                                class="w-full p-2 border rounded-lg">
                            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700">Password</label>
                            <div>
                                <input v-model="password" type="password" placeholder="Enter your password"
                                    class="w-full p-2 border rounded-lg">
                                <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                            </div>
                        </div>
                        <p v-if="errors.general" class="text-red-500 text-sm mb-4">{{ errors.general }}</p>
                        <button class="w-full bg-teal-600 text-white py-2 rounded-lg cursor-pointer" 
                            :disabled="loading">
                            {{ loading ? 'Logging in...' : 'Login' }}
                        </button>
                        <p class="text-center mt-4 text-gray-600">
                            Don't have an account? <router-link to="/usersignup" class="text-teal-600">Sign Up</router-link>
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
import Navbar from "../layout/Navbar.vue";
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';  // Add 'set' to imports
import { database } from '@/firebase';
import router from '@/router';
import store from '@/store';  // Import store for state management

export default {
    components: {
        Navbar,
    },
    data() {
        return {
            email: "",
            password: "",
            imageUrl,
            loading: false,
            errors: {}
        };
    },
    methods: {
        validateForm() {
            this.errors = {};
            if (!this.email) this.errors.email = "Email is required";
            if (!this.password) this.errors.password = "Password is required";
            return Object.keys(this.errors).length === 0;
        },
        async handleLogin() {
            if (!this.validateForm()) return;
            
            this.loading = true;
            this.errors = {};
            
            try {
                // Authenticate with Firebase
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    this.email,
                    this.password
                );
    
                // Get user data from Realtime Database
                const userRef = ref(database, `users/${userCredential.user.uid}`);
                const userSnapshot = await get(userRef);
                let userData = userSnapshot.val();  // Changed to let since we might modify it
    
                if (!userData) {
                    // Check if it's a new user without data
                    userData = {  // Assign directly to userData
                        email: userCredential.user.email,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    };
                    
                    // Create user data if it doesn't exist
                    await set(userRef, userData);
                }
    
                // Get the ID token
                const token = await userCredential.user.getIdToken();
    
                // Create complete user data object
                const completeUserData = {
                    ...userData,
                    uid: userCredential.user.uid
                };
    
                // Store user data and token
                localStorage.setItem('user', JSON.stringify(completeUserData));
                localStorage.setItem('token', token);
    
                // Update Vuex store
                store.commit('SET_USER', completeUserData);
    
                // Redirect based on user role
                if (userData.role === 'organization_admin') {
                    router.push('/organization');
                } else if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
    
            } catch (error) {
                console.error("Login error:", error);
                
                if (error.message.includes('user-not-found')) {
                    this.errors.email = "No account found with this email";
                } else if (error.message.includes('wrong-password')) {
                    this.errors.password = "Incorrect password";
                } else {
                    this.errors.general = "Failed to login. Please try again";
                }
            } finally {
                this.loading = false;
            }
        },
        async handleLogin() {
            if (!this.validateForm()) return;
            
            this.loading = true;
            this.errors = {};
            
            try {
                const userData = await store.dispatch('login', {
                    email: this.email,
                    password: this.password
                });
    
                // Redirect based on user role
                if (userData.role === 'organization_admin') {
                    router.push('/organization');
                } else if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error("Login error:", error);
                
                if (error.code === 'auth/user-not-found') {
                    this.errors.email = "No account found with this email";
                } else if (error.code === 'auth/wrong-password') {
                    this.errors.password = "Incorrect password";
                } else {
                    this.errors.general = "Failed to login. Please try again";
                }
            } finally {
                this.loading = false;
            }
        }
        

    }
};
</script>