<template>
    <div>
        <!-- Sidebar Toggle Button (Only for Small Screens) -->
        <button @click="toggleSidebar" class="md:hidden p-4 bg-teal-900 text-white flex justify-start w-full dark:bg-gray-800">
            ☰
        </button>

        <!-- Sidebar -->
        <aside
            class="fixed left-0 top-0 h-screen w-64 bg-teal-900 text-white flex flex-col transition-transform duration-300 
                   md:w-50 md:translate-x-0 dark:bg-gray-900 dark:text-gray-200"
            :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }">
            
            <div class="relative flex items-center justify-between p-4">
                <!-- Close Button (Only for Small Screens) -->
                <button class="md:hidden text-white text-2xl" @click="toggleSidebar">
                    ✖
                </button>

                <!-- Dark Mode Toggle -->
                <!-- Dark Mode Toggle -->
<button @click="toggleDarkMode"
    class="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:left-30 md:self-end 
           w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 cursor-pointer">    
    <!-- Toggle Knob -->
    <div class="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform duration-300 transform"
        :class="{ 'translate-x-6': isDarkMode, 'translate-x-0': !isDarkMode }">
    </div>

    <!-- Moon Icon (Dark Mode) -->
    <svg v-if="isDarkMode" class="absolute left-1 w-4 h-4 text-yellow-300 transition-all duration-300"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.74 2a10.94 10.94 0 0 0 0 20 9.22 9.22 0 0 1 0-20Z" />
    </svg>

    <!-- Sun Icon (Light Mode) -->
    <svg v-else class="absolute right-1 w-4 h-4 text-yellow-500 transition-all duration-300"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
</button>
            </div>
            <div class="text-center mb-8">
                <div
                    class="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-3xl overflow-hidden">
                    <img v-if="userData?.photoURL" :src="userData.photoURL" :alt="userData?.name"
                        class="w-full h-full object-cover">
                    <span v-else>👤</span>
                </div>
                <h3 class="mt-2 font-semibold">{{ userData?.name || 'User' }}</h3>
            </div>

            <nav class="flex flex-col space-y-1">
                <router-link to="/" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700 dark:hover:bg-teal-800 dark:text-gray-300 dark:active:bg-gray-700'">
                    Home
                </router-link>
                <router-link to="/profile" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700 dark:hover:bg-teal-800 dark:text-gray-300 dark:active:bg-gray-700'">
                    Profile
                </router-link>
                <router-link to="/profile/userQuizzes" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userQuizzes' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700 dark:hover:bg-teal-800 dark:text-gray-300 dark:active:bg-gray-700'">
                    Quizzes and Rank
                </router-link>
                <router-link to="/profile/userOrg" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userOrg' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700 dark:hover:bg-teal-800 dark:text-gray-300 dark:active:bg-gray-700'">
                    Your Organization
                </router-link>
                <router-link to="/profile/userSubscription" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userSubscription' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700 dark:hover:bg-teal-800 dark:text-gray-300 dark:active:bg-gray-700'">
                    Your Subscription
                </router-link>
            </nav>
        </aside>
    </div>
</template>

<script>
import { ref as dbRef, onValue, off } from 'firebase/database';
import { database } from '@/firebase';
import { mapState } from 'vuex';

export default {
    name: 'UserSidebar',
    props: {
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['toggleSidebar'],
    data() {
        return {
            userData: null,
            listener: null,
            userRef: null,
            isDarkMode: localStorage.getItem("darkMode") === "true" || false,
        };
    },
    computed: {
        ...mapState({
            userId: state => state.user?.uid
        })
    },
    methods: {
        toggleSidebar() {
            this.$emit('toggleSidebar');
        },
        fetchUserData() {
            if (!this.userId) return;

            this.userRef = dbRef(database, `users/${this.userId}`);
            this.listener = onValue(this.userRef, (snapshot) => {
                this.userData = snapshot.val();
            }, (error) => {
                console.error('Error fetching user data:', error);
                this.userData = null;
            });
        },
        toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode; // Toggle the state
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", this.isDarkMode);
    },
    },
    mounted() {
        this.fetchUserData();
        if (this.isDarkMode) {
            document.documentElement.classList.add("dark");
        }
    },
    beforeUnmount() {
        if (this.userRef && this.listener) {
            off(this.userRef, 'value', this.listener);
        }
    }
};
</script>
