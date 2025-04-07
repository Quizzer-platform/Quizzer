<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10" />
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#151a24] p-4 py-10 lg:pt-[8rem]">
        <div
            class="flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="w-full md:w-1/2 p-6 md:p-10">
                <h2 class="text-2xl font-semibold text-teal-600 dark:text-teal-400 mb-6">Get Started Now</h2>
                <form @submit.prevent="handleSignup">
                    <div class="mb-4">
                        <label for="name" class="block text-gray-700 dark:text-gray-300">Name</label>
                        <input id="name" v-model="user.name" type="text" placeholder="Enter your name"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="address" class="block text-gray-700 dark:text-gray-300">Email address</label>
                        <input id="address" v-model="user.email" type="email" placeholder="Enter your email"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-gray-700 dark:text-gray-300">Password</label>
                        <input id="password" v-model="user.password" type="password" placeholder="Enter your password"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-gray-700 dark:text-gray-300">Phone</label>
                        <input id="phone" v-model="user.phone" type="text" placeholder="Enter your phone number"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300">Organization (Optional)</label>
                        <select v-model="user.organization"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
            outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                            <option value="guest">Guest User</option>
                            <option v-for="org in organizations" :key="org.id" :value="org.name">
                                {{ org.name }}
                            </option>
                        </select>
                    </div>
                    <button
                        class="w-full bg-teal-600 text-white py-2 rounded-lg cursor-pointer hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                        :disabled="loading">
                        {{ loading ? 'Creating Account...' : 'Sign Up' }}
                    </button>
                    <div class="text-[#364365] dark:text-white font-medium text-sm flex justify-center gap-2 my-4 text-center">
                        <span class="border-b-1 w-20 self-center dark:border-gray-600"></span>
                        <p>Or sign Up with</p>
                        <span class="border-b-1 w-20 self-center dark:border-gray-600"></span>
                    </div>
                    <div class="text-center mt-4">
                        <button @click="handleGoogleSignIn"
                            class="flex items-center justify-center w-full bg-white text-gray-800  dark:bg-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:cursor-pointer">
                            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-6 h-6 mr-2">
                            Google
                        </button>
                        <p class="text-[10px] text-teal-800 mt-2">Note that if you signed in with Google, you will have a
                            guest account for now.</p>
                    </div>
                    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
                        Have an account? <router-link to="/login"
                            class="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">Sign
                            In</router-link>
                    </p>
                    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
                        <router-link to="/organizationsignup"
                            class="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">Sign
                            up Your Organization
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
import imageUrl from "@/assets/img1.PNG";
import Navbar from "../layout/Navbar.vue";
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database } from '@/firebase';
import router from '@/router';
import store from '@/store';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default {
    components: {
        Navbar,
    },
    data() {
        return {
            user: {
                name: "",
                email: "",
                password: "",
                phone: "",
                organization: "guest",
                role: "user"
            },
            imageUrl,
            loading: false,
            errors: {},
            organizations: []
        };
    },
    created() {
        this.fetchOrganizations();
    },
    methods: {
        async fetchOrganizations() {
            try {
                const response = await fetch('https://quizzer-platform-default-rtdb.firebaseio.com/organizations.json');
                const data = await response.json();
                if (data) {
                    this.organizations = Object.keys(data).map(id => ({
                        id,
                        ...data[id]
                    }));
                }
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        },
        validateForm() {
            this.errors = {};
            if (!this.user.name) this.errors.name = "Name is required";
            if (!this.user.email) this.errors.email = "Email is required";
            if (!this.user.password) this.errors.password = "Password is required";
            if (this.user.password.length < 6) this.errors.password = "Password must be at least 6 characters";
            if (!this.user.phone) this.errors.phone = "Phone is required";
            return Object.keys(this.errors).length === 0;
        },
        async handleSignup() {
            if (!this.validateForm()) return;

            this.loading = true;
            try {
                const userData = await store.dispatch('register', {
                    email: this.user.email,
                    password: this.user.password,
                    userData: {
                        name: this.user.name,
                        email: this.user.email,
                        phone: this.user.phone,
                        organization: this.user.organization,
                        role: this.user.role,
                        createdAt: new Date().toISOString(),
                        attemptedQuizzes: ['init'],
                        overallScore: 0,
                        quizzesToTake: 5,
                        plans: [
                            { name: "init", description: "init", price: 0, noOfQuizzes: 0 },
                        ],
                    }
                });

                if (this.user.organization !== 'guest') {
                    const org = this.organizations.find(org => org.name === this.user.organization);
                    if (org) {
                        // Add user to organization members using PUT request
                        const membersCount = org.members ? Object.keys(org.members).length + 1 : 1;
                        const updateData = {
                            members: membersCount
                        };

                        await fetch(
                            `https://quizzer-platform-default-rtdb.firebaseio.com/organizations/${org.id}.json`,
                            {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updateData)
                            }
                        );
                    }
                }

                // Store user data in database
                await set(ref(database, `users/${userData.uid}`), userData);

                if (this.user.organization !== 'guest') {
                    router.push('/entercode');
                } else {
                    router.push('/');
                }

            } catch (error) {
                console.error("Signup error:", error);
                if (error.code === 'auth/email-already-in-use') {
                    this.errors.email = "Email is already registered";
                } else if (error.code === 'auth/invalid-email') {
                    this.errors.email = "Invalid email format";
                } else if (error.code === 'auth/weak-password') {
                    this.errors.password = "Password is too weak";
                } else {
                    this.errors.general = "Failed to create account. Please try again.";
                }
            } finally {
                this.loading = false;
            }
        },
        async handleGoogleSignIn(event) {
            event.preventDefault(); // Prevent form submission
            this.errors = {}; // Clear any existing errors
            this.loading = true;
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Prepare user data with the same structure
                const userData = {
                    name: user.displayName || '',
                    email: user.email,
                    phone: user.phoneNumber || '',
                    organization: 'guest',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    attemptedQuizzes: ['init'],
                    overallScore: 0,
                    quizzesToTake: 5,
                    plans: [
                        { name: "init", description: "init", price: 0, noOfQuizzes: 0 },
                    ],
                };

                // Save user data to database
                await set(ref(database, `users/${user.uid}`), userData);
                // Navigate to home page since Google users start as guests
                router.push('/');

            } catch (error) {
                console.error("Google Sign-in error:", error);
                this.errors.general = "Failed to sign in with Google. Please try again.";
            } finally {
                this.loading = false;
            }
        },
    }
};
</script>
<style scoped>
/* Autofill styles for light mode */
input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: black !important;
}

/* Autofill styles for dark mode */
.dark input:-webkit-autofill {
    background-color: transparent !important;
    -webkit-box-shadow: 0 0 0px 1000px #374151 inset !important;
    /* dark:bg-gray-700 */
    -webkit-text-fill-color: white !important;
    /* Ensures white text in dark mode */
}
</style>