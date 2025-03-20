<template>
    <Navbar class="fixed top-0 left-0 w-full h-20 bg-white dark:bg-gray-900 shadow z-10"></Navbar>
    <section class="py-8 px-6 pt-20 bg-white dark:bg-[#1a202c] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 flex items-center justify-center mt-5">
            <div class="max-w-4xl mx-auto w-full text-center py-8 sm:py-12">
                <span
                    class="inline-block bg-teal-100 dark:bg-teal-800 text-gray-900 dark:text-white border border-teal-300 dark:border-teal-600 text-sm px-6 py-1 my-2 rounded-full">
                    {{ $t('mainPage.hero.tagline') }}
                </span>

                <h1 class="md:text-4xl text-2xl font-bold text-gray-900 dark:text-white mt-6 sm:mt-8">
                    {{ $t('mainPage.hero.title.part1') }}<span
                        class="bg-teal-200 dark:bg-teal-700 dark:text-white px-3 py-2 rounded-lg">{{
                            $t('mainPage.hero.title.highlight') }}</span> Quiz Platform
                    <span class="block mt-4">{{ $t('mainPage.hero.title.part2') }}</span>
                </h1>

                <div class="text-gray-600 dark:text-gray-300 mt-4">
                    <span class="block">{{ $t('mainPage.hero.description.line1') }}</span>
                    <span class="block mt-1">{{ $t('mainPage.hero.description.line2') }}</span>
                </div>

                <div class="mt-4 text-md text-teal-600 dark:text-teal-400 font-semibold italic">
                    <span class="block">{{ $t('mainPage.hero.callToAction.line1') }}</span>
                    <span class="block mt-1">{{ $t('mainPage.hero.callToAction.line2') }}</span>
                </div>

                <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <router-link to="/organizationsignup"
                        class="bg-teal-700 dark:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-teal-900 dark:hover:bg-teal-800 transition-colors duration-200">
                        {{ $t('mainPage.hero.buttons.employers') }}
                    </router-link>
                    <router-link to="/usersignup"
                        class="border text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
                        {{ $t('mainPage.hero.buttons.jobSeekers') }}
                    </router-link>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-8 px-6 text-center bg-white dark:bg-[#1a202c] transition-colors duration-300 pt-10">
        <div class="max-w-4xl mx-auto mt-2">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
                {{ $t('mainPage.features.sectionTitle') }}
            </h2>
            <div class="text-gray-600 dark:text-gray-300 my-4 max-w-xl mx-auto">
                <p>{{ $t('mainPage.features.description') }}</p>
            </div>

            <!-- Features Grid -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Card 1 -->
                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Skill Evaluation</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Our platform provides in-depth skill assessments across multiple domains, helping organizations
                        make data-driven hiring decisions.
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>

                <!-- Card 2 -->
                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Track quiz performance with detailed analytics, including scores, time spent, and comparative
                        benchmarking for smarter evaluations.
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>

                <!-- Card 3 -->
                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customizable Quizzes</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Create quizzes with various question types, difficulty levels, and scoring methods to match your
                        assessment criteria.
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-8 px-6 text-center bg-white dark:bg-[#1a202c] transition-colors duration-300 pt-20">
        <div class="mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
                Explore Our Quiz Categories
            </h2>

            <div class="flex justify-center mt-6">
                <CategriesCards :categories="filteredCategories" @view-quizzes="viewCategoryQuizzes" />
            </div>

            <button @click="$router.push('/categories')" class="mt-8 border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-lg cursor-pointer 
        hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300">
                View All →
            </button>
        </div>
    </section>

    <section class="py-8 px-6 bg-white dark:bg-[#1a202c] text-center transition-colors duration-300 pt-15">
        <div class="max-w-4xl mx-auto">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
                Frequently Asked Questions
            </h2>

            <!-- FAQ Grid -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- FAQ Item 1 -->
                    <details
                        class="faq-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:scale-105 hover:bg-teal-50 dark:hover:bg-gray-700 open:ring-2 open:ring-teal-400"
                        open>

                        <summary class="cursor-pointer list-none pl-7 relative">
                            <h3 class="font-semibold text-gray-800 dark:text-white">
                                How does the quiz platform work?
                            </h3>
                        </summary>

                        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm pl-9 transition-all duration-300">
                            Our platform allows organizations to create customized quizzes to assess skills. Job seekers
                            take these quizzes, and their results are used to match them with relevant job
                            opportunities.
                        </p>
                    </details>

                    <!-- FAQ Item 2 -->
                    <details
                        class="faq-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:scale-105 hover:bg-teal-50 dark:hover:bg-gray-700 open:ring-2 open:ring-teal-400">

                        <summary class="cursor-pointer list-none pl-7 relative">
                            <h3 class="font-semibold text-gray-800 dark:text-white">
                                Can organizations see my quiz results?
                            </h3>
                        </summary>

                        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm pl-9 transition-all duration-300">
                            Yes, organizations can view your quiz results if you’ve applied for their job openings. Your
                            results help them assess your skills and suitability for the role.
                        </p>
                    </details>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                    <!-- FAQ Item 3 -->
                    <details
                        class="faq-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:scale-105 hover:bg-teal-50 dark:hover:bg-gray-700 open:ring-2 open:ring-teal-400">

                        <summary class="cursor-pointer list-none pl-7 relative">
                            <h3 class="font-semibold text-gray-800 dark:text-white">
                                Is the platform free for job seekers?
                            </h3>
                        </summary>

                        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm pl-9 transition-all duration-300">
                            Yes, job seekers can use the platform for free. Organizations may have subscription plans
                            for creating and managing quizzes.
                        </p>
                    </details>

                    <!-- FAQ Item 4 -->
                    <details
                        class="faq-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:scale-105 hover:bg-teal-50 dark:hover:bg-gray-700 open:ring-2 open:ring-teal-400">

                        <summary class="cursor-pointer list-none pl-7 relative">
                            <h3 class="font-semibold text-gray-800 dark:text-white">
                                What types of quizzes are available?
                            </h3>
                        </summary>

                        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm pl-9 transition-all duration-300">
                            We offer quizzes in various categories, including technical skills, soft skills, and
                            industry-specific knowledge. Organizations can also create custom quizzes.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    </section>


    <section class="py-8 px-6 bg-white dark:bg-[#1a202c] text-center transition-colors duration-300 pt-15">
        <div class="max-w-4xl mx-auto">
            <p class="text-2xl text-teal-800 dark:text-teal-400 font-bold my-2">Testimonials</p>
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Hear From Happy Customers</h2>

            <!-- Testimonials Grid -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Testimonial Card -->
                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Sarah Johnson</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Software Engineer</p>
                    <p class="mt-4 text-gray-700 dark:text-gray-300 italic">
                        "Quizzer made the hiring process seamless! The platform is intuitive and easy to use."
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>

                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Michael Brown</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">HR Manager</p>
                    <p class="mt-4 text-gray-700 dark:text-gray-300 italic">
                        "As an HR manager, I love how Quizzer simplifies hiring. The skill-based assessments are
                        spot-on!"
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>

                <div
                    class="relative bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-[0_8px_20px_rgba(0,255,255,0.3)]">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Emily Davis</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Data Analyst</p>
                    <p class="mt-4 text-gray-700 dark:text-gray-300 italic">
                        "The quizzes on Quizzer are top-notch! They helped me land a job that matches my skills."
                    </p>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer />
</template>

<script>
import router from '@/router';
import Navbar from "../layout/Navbar.vue";
import Footer from "../layout/Footer.vue";
import Features from "./Features.vue"
import Cards from "./QuizzesCards.vue"
import CategriesCards from "./CategriesCards.vue";
import QuizesCards from "./QuizzesCards.vue";

// import SearchBar from "../layout/Searchbar.vue";
export default {
    components: {
        Navbar,
        Footer,
        Features,
        Cards,
        CategriesCards,
        QuizesCards,
        // SearchBar
    },
    data() {
        return {
            categories: [], // Array to store the first 3 categories
            loading: true, // Loading state
            searchQuery: "",
        };
    },
    mounted() {
        this.loadCategories(); // Fetch categories when the component is mounted
    },
    watch: {
        '$route'() {
            if (this.$route.path === '/') {
                this.showCategories = true;
                this.selectedCategoryQuizzes = [];
            }
        }
    },
    computed: {
        filteredCategories() {
            if (!this.searchQuery) return this.categories;
            return this.categories.filter(category =>
                category.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                category.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            ).map(category => ({
                ...category,
                icon: category.icon
            }));
        },
    },
    methods: {
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        // Ensure quizzes array is included
                        this.categories = Object.keys(data).map(id => ({
                            id,
                            icon: data[id].icon,
                            title: data[id].title,
                            description: data[id].description,
                            quizzes: data[id].quizzes || [] // Include quizzes here
                        })).slice(0, 3); // Only take the first 3 categories
                    } else {
                        this.categories = [];
                    }
                })
                .catch(error => console.error("Error loading categories:", error))
                .finally(() => (this.loading = false));
        },
        viewCategoryQuizzes(categoryId) {
            // Navigate to categories page with category ID
            this.$router.push({
                path: '/categories',
                query: { category: categoryId }
            });
        },
    },

};
</script>

<style>
.faq-item summary {
    list-style: none;
}

.faq-item summary::-webkit-details-marker {
    display: none;
}

.faq-item summary::before {
    content: '+';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    line-height: 1.5rem;
    color: #297764;
    font-weight: 600;
    transition: transform 0.3s ease;
}

.faq-item[open] summary::before {
    content: '−';
}
</style>