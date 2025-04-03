<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10" />
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#151a24] p-4 py-10 lg:pt-[10rem]">
        <div
            class="flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="w-full md:w-1/2 p-6 md:p-10">
                <h2 class="text-2xl font-semibold text-teal-600 dark:text-teal-400 mb-6">Register Your Organization</h2>
                <form @submit.prevent="handleOrgSignup">
                    <div class="mb-4">
                        <label for="orgName" class="block text-gray-700 dark:text-gray-300">Organization Name</label>
                        <input id="orgName" v-model="org.name" type="text" placeholder="Enter organization name"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                        outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="orgEmail" class="block text-gray-700 dark:text-gray-300">Admin Email</label>
                        <input id="orgEmail" v-model="org.email" type="email" placeholder="Enter admin email"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                        outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="orgPass" class="block text-gray-700 dark:text-gray-300">Admin Password</label>
                        <input id="orgPass" v-model="org.password" type="password" placeholder="Enter admin password"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                        outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
                    </div>
                    <div class="mb-4">
                        <label for="orgPhone" class="block text-gray-700 dark:text-gray-300">Admin Phone</label>
                        <input id="orgPhone" v-model="org.phone" type="text" placeholder="Enter admin phone number"
                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-gray-700 dark:text-white 
                        outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-300 dark:focus:border-teal-400 dark:focus:ring-teal-600">
                        <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                    </div>
                    <button
                        class="w-full bg-teal-600 text-white py-2 rounded-lg cursor-pointer hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                        :disabled="loading">
                        {{ loading ? 'Registering...' : 'Register Organization' }}
                    </button>
                    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
                        Have an account? <router-link to="/login"
                            class="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">Sign
                            In</router-link>
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
// Remove useStore and useRouter as we're using direct imports
import imageUrl from "@/assets/img1.PNG";
import Navbar from "../layout/Navbar.vue";
import { ref, set, push } from 'firebase/database';
import { database } from '@/firebase';
import router from '@/router';
import store from '@/store';

export default {
    components: {
        Navbar,
    },
    data() {
        return {
            org: {
                name: "",
                email: "",
                password: "",
                phone: ""
            },
            imageUrl,
            loading: false,
            errors: {}
        };
    },
    methods: {
        // generateOrgID(name) {
        //     const randomNum = Math.floor(1000 + Math.random() * 9000);
        //     const timestamp = Date.now();
        //     return `${name.toLowerCase().replace(/\s+/g, '')}-${randomNum}-${timestamp}`;
        // },
        validateForm() {
            this.errors = {};
            if (!this.org.name) this.errors.name = "Organization name is required";
            if (!this.org.email) this.errors.email = "Admin email is required";
            if (!this.org.password) {
                this.errors.password = "Password is required";
            } else if (this.org.password.length < 6) {
                this.errors.password = "Password must be at least 6 characters";
            }
            if (!this.org.phone) this.errors.phone = "Phone number is required";
            return Object.keys(this.errors).length === 0;
        },
        async handleOrgSignup() {
            if (!this.validateForm()) return;

            this.loading = true;
            this.errors = {};

            try {
                // Register admin user with Firebase Auth
                const result = await store.dispatch('register', {
                    email: this.org.email,
                    password: this.org.password,
                    userData: {
                        name: this.org.name,
                        email: this.org.email,
                        phone: this.org.phone,
                        role: "organization_admin",
                        organization: this.org.name,
                        createdAt: new Date().toISOString()
                    }
                });

                // Check if registration was successful
                if (!result || !result.uid) {
                    throw new Error('Registration failed');
                }

                // Add organization to database
                const orgID = this.generateOrgID(this.org.name);
                const orgData = {
                    id: orgID,
                    name: this.org.name,
                    adminEmail: this.org.email,
                    adminPhone: this.org.phone,
                    adminUid: result.uid,  // Use result.uid directly
                    createdAt: new Date().toISOString(),
                    members: 0,
                    quizzes: 0,
                    plans: [
                        { name: "init", description: "init", price: 0, noOfQuizzes: 0 },
                    ],
                };

                // Create organization first
                const orgsRef = ref(database, 'organizations');
                const newOrgRef = push(orgsRef);
                await set(newOrgRef, orgData);

                // Then create user data with organization reference
                const userRef = ref(database, `users/${result.uid}`);  // Use result.uid directly
                await set(userRef, {
                    name: this.org.name,
                    email: this.org.email,
                    phone: this.org.phone,
                    role: "organization_admin",
                    organization: this.org.name,
                    organizationId: newOrgRef.key,
                    createdAt: new Date().toISOString()
                });

                // Store in localStorage for immediate access
                const userData = {
                    uid: result.uid,  // Use result.uid directly
                    email: this.org.email,
                    role: "organization_admin",
                    organization: this.org.name,
                    organizationId: newOrgRef.key
                };

                localStorage.setItem('user', JSON.stringify(userData));
                store.commit('SET_USER', userData);
                router.push('/organization');
            } catch (error) {
                console.error("Error registering organization:", error);

                if (error.code === 'auth/email-already-in-use') {
                    this.errors.email = "Email is already registered";
                } else if (error.code === 'auth/invalid-email') {
                    this.errors.email = "Invalid email format";
                } else if (error.code === 'auth/weak-password') {
                    this.errors.password = "Password is too weak";
                } else {
                    this.errors.general = error.message || "Registration failed. Please try again.";
                }

                // Rollback if needed
                if (store.state.user) {
                    await store.dispatch('logout');
                }
            } finally {
                this.loading = false;
            }
        }
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