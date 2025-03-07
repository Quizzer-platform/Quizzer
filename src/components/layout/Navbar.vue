<template>
    <nav class="bg-white shadow-md" id="navbar">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center py-2">
                <h1 class="text-xl font-bold text-teal-600">Quizzer</h1>
                <ul class="hidden md:flex space-x-6">
                    <li>
                        <router-link to="/" class="hover:text-teal-600 ">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/categories" class="hover:text-teal-600 ">Categories</router-link>
                    </li>
                    <li>
                        <router-link to="/quizzes" class="hover:text-teal-600 ">Quizzes</router-link>
                    </li>
                    <li>
                        <router-link to="/leaderboard" class="hover:text-teal-600 ">Leaderboard</router-link>
                    </li>
                    <li>
                        <router-link to="/contactus" class="hover:text-teal-600 ">Contact Us</router-link>
                    </li>
                    <li>
                        <router-link to="/pricing" class="hover:text-teal-600 ">Pricing</router-link>
                    </li>
                    <li v-if="isAuthenticated">
                        <router-link :to="dashboardLink" class="hover:text-teal-600">{{ this.user.role === "user" ? "Profile" : "Dashboard"}}</router-link>
                    </li>
                </ul>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 m-5">
                        <slot name="canChange">
                            <template v-if="!isAuthenticated">
                                <button class="mx-2 hover:text-teal-600"><router-link
                                        to="/login">Login</router-link></button>
                                <button class="mx-2 hover:text-teal-600"><router-link
                                        to="/usersignup">Signup</router-link></button>
                            </template>
                            <template v-else>
                                <span class="mx-2 text-teal-600">Welcome, {{ userName }}</span>
                                <button @click="handleLogout" class="mx-2 hover:text-teal-600">Logout</button>
                            </template>
                        </slot>
                    </div>

                    <button @click="toggleMenu" class="md:hidden text-gray-600 focus:outline-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="mobileMenuOpen" class="md:hidden flex flex-col items-center space-y-4 pb-4 bg-white">
            <ul class="space-x-6 flex flex-col gap-y-2">
                <li>
                    <router-link to="/" class="hover:text-teal-600">Home</router-link>
                </li>
                <li>
                    <router-link to="/categories" class="hover:text-teal-600">Categories</router-link>
                </li>
                <li>
                    <router-link to="/quizzes" class="hover:text-teal-600">Quizzes</router-link>
                </li>
                <li>
                    <router-link to="/leaderboard" class="hover:text-teal-600">Leaderboard</router-link>
                </li>
                <li>
                    <router-link to="/contactus" class="hover:text-teal-600">Contact Us</router-link>
                </li>
                <li>
                    <router-link to="/pricing" class="hover:text-teal-600">Pricing</router-link>
                </li>
                <li v-if="isAuthenticated">
                    <router-link :to="dashboardLink" class="hover:text-teal-600">{{ this.user.role === "user" ? "Profile" : "Dashboard"}}</router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/login" class="hover:text-teal-600">Login</router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/usersignup" class="hover:text-teal-600">Signup</router-link>
                </li>
                <li v-if="isAuthenticated">
                    <button @click="handleLogout" class="hover:text-teal-600">Logout</button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/store';
import router from '@/router';

export default {
    data() {
        return {
            mobileMenuOpen: false,
        };
    },
    computed: {
        ...mapState({
            isAuthenticated: state => state.isAuthenticated,
            user: state => state.user
        }),
        userName() {
            return this.user?.name || this.user?.email || 'User';
        },
        dashboardLink() {
            if (!this.user) return '/login';

            switch (this.user.role) {
                case 'admin':
                    return '/admin';
                case 'organization_admin':
                    return '/organization';
                case 'user':
                    return '/profile';
                default:
                    return '/profile';
            }
        }
    },
    methods: {
        toggleMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
        async handleLogout() {
            try {
                await store.dispatch('logout');
                this.mobileMenuOpen = false; // Close mobile menu after logout
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    }
};
</script>

<style scoped>
nav {
    background-color: #ffffff;
    color: #333333;
    z-index: 1000;
}
</style>