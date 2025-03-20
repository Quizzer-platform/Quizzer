<template>
    <nav class="bg-white shadow-md transition-colors duration-300 pt-3" id="navbar">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center py-2">
                <!-- Logo & Welcome Message -->
                <h1 class="text-xl font-extrabold text-teal-800 dark:text-teal-400">Quizzer</h1>
                
                <!-- Small Screen Welcome Message -->
                <span v-if="isAuthenticated" class="md:hidden text-sm text-teal-800 dark:text-teal-400 font-semibold">
                    Welcome, {{ user.name || "User" }}!
                </span>

                <!-- Desktop Navigation -->
                <ul class="hidden md:flex space-x-4 items-center">
                    <li>
                        <router-link to="/" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Home
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/categories" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Categories
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/quizzes" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Quizzes
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/leaderboard" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Leaderboard
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/contactus" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Contact Us
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/pricing" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            Pricing
                        </router-link>
                    </li>
                    <li v-if="isAuthenticated">
                        <router-link :to="dashboardLink" 
                            class="hover:text-teal-700 dark:hover:text-teal-400"
                            active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                            {{ this.user.role === "user" ? "Profile" : "Dashboard" }}
                        </router-link>
                    </li>
                </ul>

                <!-- Right Side: Login/Signup or Welcome Message + Dark Mode + Menu -->
                <div class="flex items-center space-x-4">
                    <!-- Welcome Message -->
                    <span v-if="isAuthenticated" class="hidden md:block text-sm text-teal-800 dark:text-teal-400 font-semibold">
                        Welcome, {{ user.name || "User" }}!
                    </span>

                    <!-- Login & Signup Buttons (Only If Not Logged In) -->
                    <template v-if="!isAuthenticated">
                        <router-link to="/login" class="hover:text-teal-700 dark:hover:text-teal-400">
                            Login
                        </router-link>
                        <router-link to="/usersignup" class="hover:text-teal-700 dark:hover:text-teal-400">
                            Signup
                        </router-link>
                    </template>

                    <!-- Dark Mode Button -->
                    <button @click="toggleDarkMode" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                        <span v-if="isDarkMode">🌙</span>
                        <span v-else>☀️</span>
                    </button>
                    <button v-if="isAuthenticated" @click="logout" class="hidden md:block hover:text-red-600 dark:hover:text-red-400 cursor-pointer">
                    Logout
                    </button>

                    <!-- Mobile Menu Button -->
                    <button @click="toggleMenu" class="block hamburger md:hidden" id="menuBtn">
                        <span class="hamburger-top"></span>
                        <span class="hamburger-middle"></span>
                        <span class="hamburger-bottom"></span>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden flex flex-col items-center space-y-4 pb-4 bg-white dark:bg-[#1a202c] transition-colors duration-300 dark:text-white">
            <ul class="flex flex-col gap-y-2">
                <li>
                    <router-link to="/" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Home
                    </router-link>
                </li>
                <li>
                    <router-link to="/categories" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Categories
                    </router-link>
                </li>
                <li>
                    <router-link to="/quizzes" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Quizzes
                    </router-link>
                </li>
                <li>
                    <router-link to="/leaderboard" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Leaderboard
                    </router-link>
                </li>
                <li>
                    <router-link to="/contactus" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Contact Us
                    </router-link>
                </li>
                <li>
                    <router-link to="/pricing" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        Pricing
                    </router-link>
                </li>
                <li v-if="isAuthenticated">
                    <router-link :to="dashboardLink" 
                        class="hover:text-teal-600 dark:hover:text-teal-400"
                        active-class="border-b-2 border-teal-600 pb-1 text-teal-600 dark:border-teal-400 dark:text-teal-400">
                        {{ this.user.role === "user" ? "Profile" : "Dashboard" }}
                    </router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/login" class="hover:text-teal-600 dark:hover:text-teal-400">
                        Login
                    </router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/usersignup" class="hover:text-teal-600 dark:hover:text-teal-400">
                        Signup
                    </router-link>
                </li>
                <li v-if="isAuthenticated">
    <button @click="logout" class="hover:text-red-600 dark:hover:text-red-400 cursor-pointer">
        Logout
    </button>
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
            isDarkMode: localStorage.getItem("darkMode") === "true", // Load saved preference
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
            menuBtn.classList.toggle("open");
        },
        async handleLogout() {
            try {
                await store.dispatch('logout');
                this.mobileMenuOpen = false; // Close mobile menu after logout
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },
        toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", this.isDarkMode);
    },
    },
    mounted() {
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        }
    }
};
</script>

<style scoped>
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

nav {
    background-color: #ffffff;
    color: #333333;
    z-index: 1000;
}
.dark nav {
    background-color: #1a202c; /* Dark background */
    color: #ffffff;
}
.hamburger{
    cursor: pointer;
    width: 24px;
    height: 24px;
    transition: all 0.3s;
    position: relative;
}
.hamburger-top,
.hamburger-middle,
.hamburger-bottom{
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 2px;
    background-color: teal;
    transform: rotate(0);
    transition: all 0.3s;
}
.hamburger-middle{
    transform: translateY(7px);
}
.hamburger-bottom{
    transform: translateY(14px);
}
.open{
    transform: rotate(90deg);
    transform: translateY(0px);
}
.open .hamburger-top{
    transform: rotate(45deg) translateY(6px) translate(6px);
}
.open .hamburger-middle{
    display: none;
}
.open .hamburger-bottom{
    transform: rotate(-45deg) translateY(6px) translate(-6px);
}

</style>