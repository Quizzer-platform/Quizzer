<template>
    <nav class="bg-white shadow-md" id="navbar">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center py-2">
                <h1 class="text-xl font-extrabold text-teal-700">Quizzer</h1>
                <ul class="hidden md:flex space-x-4">
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
                    <li v-if="!isAuthenticated" class="ms-20">
                        <button class="mx-2 hover:text-teal-600"><router-link to="/login">Login</router-link></button>
                        <button class="mx-2 hover:text-teal-600"><router-link
                                to="/usersignup">Signup</router-link></button>
                    </li>
                    <li v-if="isAuthenticated">
                        <router-link :to="dashboardLink" class="hover:text-teal-600">{{ this.user.role === "user" ?
                            "Profile" : "Dashboard" }}</router-link>
                    </li>
                </ul>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 m-5">
                        <slot name="canChange">
                            <template v-if="isAuthenticated">
                                <span class="mx-2 text-teal-600">Welcome, {{ userName }}</span>
                                <button @click="handleLogout" class="mx-2 hover:text-teal-600">Logout</button>
                            </template>
                        </slot>
                    </div>

                    <button  @click="toggleMenu" class="block hamburger md:hidden" id="menuBtn">
                        <span class="hamburger-top"></span>
                        <span class="hamburger-middle"></span>
                        <span class="hamburger-bottom"></span>
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
                    <router-link :to="dashboardLink" class="hover:text-teal-600">{{ this.user.role === "user" ?
                        "Profile" :
                        "Dashboard" }}</router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/login" class="hover:text-teal-600">Login</router-link>
                </li>
                <li v-if="!isAuthenticated">
                    <router-link to="/usersignup" class="hover:text-teal-600">Signup</router-link>
                </li>
                <!-- <li v-if="isAuthenticated">
                    <button @click="handleLogout" class="hover:text-teal-600">Logout</button>
                </li> -->
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