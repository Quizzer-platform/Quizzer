<template>
    <div class="md:h-screen">
        <!-- Sidebar Toggle for Small Screens -->
        <button @click="toggleMenu" class="md:hidden p-4 bg-teal-900 text-white flex justify-end w-full">
            ☰
        </button>

        <!-- Sidebar -->
        <aside :class="{ 'hidden': !isMenuOpen, 'block': isMenuOpen }"
            class="w-full h-dvh  md:w-64 bg-teal-900 text-white p-6 flex flex-col md:block">
            <div class="text-center mb-8">
                <div class="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center text-3xl overflow-hidden">
                    <img v-if="userData?.photoURL" :src="userData.photoURL" :alt="userData?.name" class="w-full h-full object-cover">
                    <span v-else>👤</span>
                </div>
                <h3 class="mt-2 font-semibold">{{ userData?.name || 'User' }}</h3>
            </div>
            <nav class="flex flex-col space-y-4">
                <div>
                    <router-link to="/" 
                        class="block p-2 rounded transition-colors"
                        :class="$route.path === '/' ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-700'">
                        Home
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile" 
                        class="block p-2 rounded transition-colors"
                        :class="$route.path === '/profile' ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-700'">
                        Profile
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile/userQuizzes" 
                        class="block p-2 rounded transition-colors"
                        :class="$route.path === '/profile/userQuizzes' ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-700'">
                        Quizzes and Rank
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile/userOrg" 
                        class="block p-2 rounded transition-colors"
                        :class="$route.path === '/profile/userOrg' ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-700'">
                        Your Organization
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile/userSubscription" 
                        class="block p-2 rounded transition-colors"
                        :class="$route.path === '/profile/userSubscription' ? 'bg-teal-700 font-bold text-white' : 'text-gray-300 hover:bg-teal-700'">
                        Your Subscription
                    </router-link>
                </div>
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
        isMenuOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:isMenuOpen'],
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
        toggleMenu() {
            this.$emit('update:isMenuOpen', !this.isMenuOpen);
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
        try {
            this.fetchUserData();
        } catch (error) {
            console.error('Error in mounted hook:', error);
        }
    },
    beforeUnmount() {
        try {
            if (this.userRef && this.listener) {
                off(this.userRef, 'value', this.listener);
            }
        } catch (error) {
            console.error('Error in unmount hook:', error);
        }
    }
};
</script>