<template>
    <Navbar />
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div class="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="w-full md:w-1/2 p-6 md:p-10">
                <h2 class="text-2xl font-semibold text-teal-600 mb-6">Get Started Now</h2>
                <form @submit.prevent="handleSignup">
                    <div class="mb-4">
                        <label for="name" class="block text-gray-700">Name</label>
                        <input id="name" v-model="user.name" type="text" placeholder="Enter your name"
                            class="w-full p-2 border rounded-lg mt-1">
                        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="address" class="block text-gray-700">Email address</label>
                        <input id="address" v-model="user.email" type="email" placeholder="Enter your email"
                            class="w-full p-2 border rounded-lg mt-1">
                        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-gray-700">Password</label>
                        <input id="password" v-model="user.password" type="password" placeholder="Enter your password"
                            class="w-full p-2 border rounded-lg mt-1">
                        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="phone" class="block text-gray-700">Phone</label>
                        <input id="phone" v-model="user.phone" type="text" placeholder="Enter your phone number"
                            class="w-full p-2 border rounded-lg mt-1">
                        <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="" class="block text-gray-700">Organization (Optional)</label>
                        <select v-model="user.organization" class="w-full p-2 border rounded-lg mt-1">
                            <option value="guest">Guest User</option>
                            <option v-for="org in organizations" :key="org.id" :value="org.name">
                                {{ org.name }}
                            </option>
                        </select>
                    </div>
                    <button class="w-full bg-teal-600 text-white py-2 rounded-lg cursor-pointer hover:bg-teal-800" :disabled="loading">
                        {{ loading ? 'Creating Account...' : 'Sign Up' }}
                    </button>
                    <p class="text-center mt-4 text-gray-600">
                        Have an account? <router-link to="/login" class="font-semibold text-teal-600  hover:text-teal-800">Sign In</router-link>
                    </p>
                    <p class="text-center mt-4 text-gray-600">
                        <router-link to="/organizationsignup" class="font-semibold text-teal-600  hover:text-teal-800">Signup your organization
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
        }
    }
};
</script>
