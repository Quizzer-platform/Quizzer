<template>
    <div>
        <!-- Sidebar Toggle Button (Only for Small Screens) -->
        <button @click="toggleSidebar" class="md:hidden p-4 bg-teal-900 text-white flex justify-start w-full">
            ☰
        </button>

        <!-- Sidebar -->
        <aside
            class="fixed left-0 top-0 h-screen w-64 bg-teal-900 text-white flex flex-col transition-transform duration-300 md:w-50 md:translate-x-0"
            :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }">

            <button class="absolute top-4 right-4 md:hidden text-white text-2xl" @click="toggleSidebar">
                ✖
            </button>

            <div class="text-center mb-8 mt-10">
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
                    :class="$route.path === '/' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700'">
                    Home
                </router-link>
                <router-link to="/profile" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700'">
                    Profile
                </router-link>
                <router-link to="/profile/userQuizzes" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userQuizzes' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700'">
                    Quizzes and Rank
                </router-link>
                <router-link to="/profile/userOrg" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userOrg' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700'">
                    Your Organization
                </router-link>
                <router-link to="/profile/userSubscription" class="block w-full p-3 pl-8 transition-colors"
                    :class="$route.path === '/profile/userSubscription' ? 'bg-teal-700 text-white' : 'text-gray-300 hover:bg-teal-700'">
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
            userRef: null
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
        }
    },
    mounted() {
        this.fetchUserData();
    },
    beforeUnmount() {
        if (this.userRef && this.listener) {
            off(this.userRef, 'value', this.listener);
        }
    }
};
</script>
