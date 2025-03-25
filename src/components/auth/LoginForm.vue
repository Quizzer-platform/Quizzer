<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10" />
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#151a24] p-4 py-10 lg:pt-[8rem]">
        <div
            class="flex flex-col-reverse md:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">

            <div class="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <h2 class="text-2xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Welcome back!</h2>
                <p class="text-gray-600 dark:text-gray-300 mb-6">Enter your credentials to access your account</p>
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                        <input v-model="email" type="email" id="email" placeholder="Enter your email"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input v-model="password" type="password" id="password" placeholder="Enter your password"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                    </div>

                    <p v-if="errors.general" class="text-red-500 text-sm mb-4">{{ errors.general }}</p>
                    <button
                        class="w-full bg-teal-600 text-white py-2 rounded-lg cursor-pointer hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                        :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                    <div class="text-center mt-4">
                        <button @click="handleGoogleSignIn"
                            class="flex items-center justify-center w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:cursor-pointer">
                            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-6 h-6 mr-2">
                            Sign in with Google
                        </button>
                    </div>
                    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
                        Don't have an account?
                        <router-link to="/usersignup"
                            class="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                            Sign Up
                        </router-link>
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
        },
        async handleGoogleSignIn(event) {
            event.preventDefault();
            this.errors = {};
            this.loading = true;

            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Check if user exists in database
                const userRef = ref(database, `users/${user.uid}`);
                const userSnapshot = await get(userRef);

                if (!userSnapshot.exists()) {
                    // First time Google sign-in - redirect to signup
                    this.errors.general = "Please sign up first using Google authentication";
                    router.push('/usersignup');
                    return;
                }

                // Existing user - proceed with login
                const userData = userSnapshot.val();
                const token = await user.getIdToken();

                // Create complete user data object
                const completeUserData = {
                    ...userData,
                    uid: user.uid
                };

                // Store user data and token
                localStorage.setItem('user', JSON.stringify(completeUserData));
                localStorage.setItem('token', token);
                localStorage.setItem('isLoggedIn', 'true');

                // Update Vuex store
                store.commit('SET_USER', completeUserData);
                store.commit('SET_AUTH_STATUS', true);

                // Redirect based on role
                if (userData.role === 'organization_admin') {
                    router.push('/organization');
                } else if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }

            } catch (error) {
                console.error("Google Sign-in error:", error);
                if (error.code === 'auth/popup-closed-by-user') {
                    this.errors.general = "Sign-in cancelled. Please try again.";
                } else if (error.code === 'auth/network-request-failed') {
                    this.errors.general = "Network error. Please check your connection.";
                } else {
                    this.errors.general = "Failed to sign in with Google. Please try again.";
                }
            } finally {
                this.loading = false;
            }
        }


    }
};
</script>


<style scoped>
/* Autofill Fix */
input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: black !important;
}

.dark input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-box-shadow: 0 0 0px 1000px #374151 inset !important;
    /* Matches dark:bg-gray-700 */
    -webkit-text-fill-color: white !important;
}
</style>