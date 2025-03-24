<template>
    <div class="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div class="flex flex-1 flex-col md:flex-row">
            <UserSidebar :isOpen="isMenuOpen" @toggleSidebar="isMenuOpen = !isMenuOpen" />

            <!-- Main Content -->
            <div class="min-h-screen w-full bg-gray-100 dark:bg-[#1a202c] md:ml-50">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white dark:bg-gray-900/60 dark:text-gray-200 rounded-lg shadow-lg p-6">
                        <h1 class="text-2xl font-bold text-teal-800 dark:text-teal-400 mb-6">Your Organizations</h1>

                        <div v-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
                            {{ error }}
                        </div>

                        <div v-if="userOrgs.length > 0" class="flex flex-col gap-6 w-full">
                            <div v-for="org in userOrgs" :key="org.id"
                                class="bg-gray-50 dark:bg-gray-900/85 text-gray-900 dark:text-gray-300 rounded-lg p-6 shadow hover:shadow-md transition-shadow w-full">
                                <div class="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 v-if="org.name" class="font-semibold text-lg">{{ org.name }}</h3>
                                        <h3 v-else class="font-semibold text-lg text-gray-400 dark:text-gray-500">Unnamed Organization</h3>
                                        <p class="text-gray-600 dark:text-gray-400">{{ org.role || 'Member' }}</p>
                                    </div>
                                    <router-link to="/quizzes"
                                        class="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white px-4 py-2 rounded transition">
                                        View Quizzes
                                    </router-link>
                                </div>
                                <p v-if="org.description" class="text-gray-700 dark:text-gray-400 mb-4">{{ org.description }}</p>
                                <p v-else class="text-gray-400 dark:text-gray-500 mb-4">No description available</p>
                                <div class="flex items-center">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        Members: {{ org.membersCount || 0 }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="!loading" class="text-center py-8">
                            <div class="text-4xl mb-4">🏢</div>
                            <h3 class="text-lg font-semibold dark:text-gray-300 mb-2">No Organizations Yet</h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">Join an organization or create your own!</p>
                            <p class="text-gray-600 dark:text-gray-400 mt-10 mb-4">See our free to take quizzes!</p>
                            <router-link to="/quizzes"
                                class="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition">
                                Browse Quizzes
                            </router-link>
                        </div>

                        <div v-else class="text-center py-8 flex flex-col justify-center items-center h-60">
                            <!-- Loading Spinner -->
                        <svg class="animate-spin h-12 w-12 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading Organizations...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as dbRef, get, onValue, off } from 'firebase/database';
import { database } from '@/firebase';
import UserSidebar from './UserSidebar.vue';

export default {
    name: 'UserOrganization',
    components: {
        UserSidebar
    },
    data() {
        return {
            isMenuOpen: false,
            userOrgs: [],
            error: null,
            loading: true,
            listener: null,
            orgsRef: null,
            userData: null
        };
    },
    computed: {
        userId() {
            return this.$store.state.user?.uid;
        }
    },
    methods: {
        async fetchUserOrgs() {
            if (!this.userId) {
                this.error = "Please login to view your organizations";
                this.loading = false;
                return;
            }

            try {
                const userRef = dbRef(database, `users/${this.userId}`);
                this.orgsRef = userRef;

                this.listener = onValue(userRef, async (snapshot) => {
                    try {
                        this.userData = snapshot.val();
                        // console.log('User Data:', this.userData);

                        if (this.userData && this.userData.organization) {
                            // First, get all organizations to find the matching one
                            const orgsRef = dbRef(database, 'organizations');
                            const orgsSnapshot = await get(orgsRef);

                            if (orgsSnapshot.exists()) {
                                const orgsData = orgsSnapshot.val();
                                // Find the organization where name matches user's organization
                                const orgEntry = Object.entries(orgsData).find(([key, org]) =>
                                    org.name.toLowerCase() === this.userData.organization.toLowerCase()
                                );

                                if (orgEntry) {
                                    const [orgId, orgData] = orgEntry;
                                    // console.log('Found Organization:', orgData);

                                    this.userOrgs = [{
                                        id: orgId,
                                        name: orgData.name,
                                        description: orgData.description || `Welcome to ${orgData.name}`,
                                        membersCount: orgData.members || 0,
                                        role: this.userData.role || 'Member',
                                        status: orgData.status
                                    }];
                                } else {
                                    console.warn('Organization not found:', this.userData.organization);
                                    this.userOrgs = [];
                                }
                            }
                        } else {
                            console.warn('No organization assigned to user');
                            this.userOrgs = [];
                        }
                    } catch (err) {
                        console.error("Error fetching organization details:", err);
                        this.error = "Error loading organization details";
                        this.userOrgs = [];
                    } finally {
                        this.loading = false;
                    }
                });

            } catch (err) {
                console.error("Database connection error:", err);
                this.error = "Error connecting to database";
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchUserOrgs();
    },
    beforeUnmount() {
        if (this.orgsRef && this.listener) {
            off(this.orgsRef, 'value', this.listener);
            this.listener = null;
            this.orgsRef = null;
        }
    }
};
</script>