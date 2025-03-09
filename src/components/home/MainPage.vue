<template>
    <section class="relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white min-h-screen">
        <!-- Decorative background elements remain unchanged -->
        <Navbar />
        
        <div class="container mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div class="max-w-4xl mx-auto w-full text-center py-8 sm:py-12">
                <span class="inline-block bg-gray-100 text-gray-900 border border-gray-300 text-sm px-4 py-1 rounded-full">
                    🚀 Measure Skills, Not Just Words
                </span>

                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-6 sm:mt-8">
                    The <span class="bg-teal-200 px-2 rounded-lg">Ultimate</span> Quiz Platform
                    <span class="block mt-2">for Smarter Hiring</span>
                </h1>

                <div class="text-gray-600 mt-4">
                    <span class="block">Quizzer is more than a quiz platform—it's a gateway to skills, a tool for evaluation,</span>
                    <span class="block mt-1">and a community that values knowledge.</span>
                </div>

                <div class="mt-4 text-md text-teal-600 font-semibold italic">
                    <span class="block">Join thousands of organizations and candidates who rely on Quizzer</span>
                    <span class="block mt-1">to measure skills and make smarter hiring decisions.</span>
                </div>

                <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <router-link to="/organizationsignup" 
                        class="bg-teal-700 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-teal-900 transition-colors duration-200">
                        For Employers and Recruiters
                    </router-link>
                    <router-link to="/usersignup"
                        class="border text-gray-900 border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        For Job Seekers →
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Bottom decorative element remains unchanged -->
    </section>

    <section class="py-8 px-6 text-center bg-white mt-15">
        <div class="max-w-4xl mx-auto ">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800">
                What Sets our Quizzes Apart
            </h2>
            <div class="text-gray-600 mt-2">
                <p>Our platform connects job seekers to jobs based on their quiz results, helping employers find the
                    right talent and candidates prove their skills.</p>
            </div>
            <!-- Features Grid -->
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <Features />
            </div>
        </div>
    </section>
    <section class="py-8 px-6 text-center bg-white mt-15">
        <div class="max-w-4xl mx-auto">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800">
                Explore Our Quiz Categories
            </h2>
            <!-- Categories Grid Quiz Cards -->
            <!-- <Cards :cards="cards" /> -->
            <div class="flex justify-center">
                <CategriesCards :categories="categories" />
            </div>
            <!-- View All Button -->
            <!-- border text-gray-900 border-gray-300 px-6 py-2 rounded-lg hover:bg-teal-50 -->
            <button @click="$router.push('/categories')"
                class="mt-8 border border-gray-300 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                View All →
            </button>
        </div>
    </section>
    <section class="py-8 px-6 bg-white text-center mt-15 ">
        <div class="max-w-4xl mx-auto">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800">
                Frequently Asked Questions
            </h2>

            <!-- FAQ Grid -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <!-- Left Column -->
                <div class="space-y-4">
                    <!-- Expanded Question -->
                    <details class="bg-white p-6 rounded-lg shadow-md text-left" open>
                        <summary class="flex items-start gap-3 cursor-pointer list-none">
                            <span class="text-xl text-teal-600">+</span>
                            <h3 class="font-semibold text-gray-800">
                                How does the quiz platform work?
                            </h3>
                        </summary>
                        <p class="text-gray-600 mt-2 text-sm pl-9">
                            Our platform allows organizations to create customized quizzes to assess skills. Job seekers
                            take these quizzes, and their results are used to match them with relevant job
                            opportunities.
                        </p>
                    </details>

                    <!-- Collapsed Question -->
                    <details class="bg-white p-6 rounded-lg shadow-md text-left">
                        <summary class="flex items-start gap-3 cursor-pointer list-none">
                            <span class="text-xl text-teal-700">+</span>
                            <h3 class="font-semibold text-gray-800">
                                Can organizations see my quiz results?
                            </h3>
                        </summary>
                        <p class="text-gray-600 mt-2 text-sm pl-9">
                            Yes, organizations can view your quiz results if you’ve applied for their job openings. Your
                            results help them assess your skills and suitability for the role. </p>
                    </details>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">


                    <details class="bg-white p-6 rounded-lg shadow-md text-left">
                        <summary class="flex items-start gap-3 cursor-pointer list-none">
                            <span class="text-xl text-teal-700">+</span>
                            <h3 class="font-semibold text-gray-800">
                                Is the platform free for job seekers?
                            </h3>
                        </summary>
                        <p class="text-gray-600 mt-2 text-sm pl-9">
                            Yes, job seekers can use the platform for free. Organizations may have subscription plans
                            for creating and managing quizzes.
                        </p>
                    </details>

                    <details class="bg-white p-6 rounded-lg shadow-md text-left">
                        <summary class="flex items-start gap-3 cursor-pointer list-none">
                            <span class="text-xl text-teal-700">+</span>
                            <h3 class="font-semibold text-gray-800">
                                What types of quizzes are available?
                            </h3>
                        </summary>
                        <p class="text-gray-600 mt-2 text-sm pl-9">
                            We offer quizzes in various categories, including technical skills, soft skills, and
                            industry-specific knowledge. Organizations can also create custom quizzes.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    </section>
    <section class="py-16 px-6 bg-white text-center my-15">
        <div class="max-w-4xl mx-auto">
            <!-- Section Title -->
            <p class="text-2xl text-teal-800 font-semibold">Testimonials</p>
            <h2 class="text-3xl font-bold text-gray-800">
                Hear From Happy Customers
            </h2>

            <!-- Testimonials Grid -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Testimonial 1 -->
                <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-start text-left">
                    <div class="flex items-center space-x-4">
                        <!-- User Image -->
                        <img src="https://placehold.co/200x200/green/white" alt="User Photo"
                            class="w-16 h-16 rounded-full border-4 border-teal-700" />
                        <!-- User Info -->
                        <div>
                            <h3 class="font-semibold text-gray-800">Sarah Johnson</h3>
                            <p class="text-sm text-gray-500">Software Engineer</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400">“</span>
                        <p class="text-gray-600 text-sm italic">
                            "Quizzer made the hiring process seamless! I received a code from the company, took the
                            quiz, and got feedback quickly. The platform is intuitive and easy to use."
                        </p>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-start text-left">
                    <div class="flex items-center space-x-4">
                        <!-- User Image -->
                        <img src="https://placehold.co/200x200/green/white" alt="User Photo"
                            class="w-16 h-16 rounded-full border-4 border-teal-700" />
                        <!-- User Info -->
                        <div>
                            <h3 class="font-semibold text-gray-800">Michael Brown</h3>
                            <p class="text-sm text-gray-500">HR Manager</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400">“</span>
                        <p class="text-gray-600 text-sm italic">
                            "As an HR manager, I love how Quizzer simplifies hiring. The skill-based assessments are
                            spot-on, and we’ve found some incredible talent through this platform."
                        </p>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-start text-left">
                    <div class="flex items-center space-x-4">
                        <!-- User Image -->
                        <img src="https://placehold.co/200x200/green/white" alt="User Photo"
                            class="w-16 h-16 rounded-full border-4 border-teal-700" />
                        <!-- User Info -->
                        <div>
                            <h3 class="font-semibold text-gray-800">Emily Davis</h3>
                            <p class="text-sm text-gray-500">Data Analyst</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                ⭐⭐⭐⭐⭐
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400">“</span>
                        <p class="text-gray-600 text-sm italic">
                            "The quizzes on Quizzer are top-notch! They helped me identify my strengths and weaknesses,
                            and I landed a job that perfectly matches my skills."
                        </p>
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

// import SearchBar from "../layout/Searchbar.vue";
export default {
    components: {
        Navbar,
        Footer,
        Features,
        Cards,
        CategriesCards
        // SearchBar
    },
    data() {
        return {
            categories: [], // Array to store the first 3 categories
            loading: true, // Loading state
        };
    },
    mounted() {
        this.loadCategories(); // Fetch categories when the component is mounted
    },
    methods: {
        loadCategories() {
            fetch("https://quizzer-platform-default-rtdb.firebaseio.com/categories.json")
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        // Map the data and slice the first 3 categories
                        this.categories = Object.keys(data)
                            .map((id) => ({
                                id,
                                icon: data[id].icon,
                                title: data[id].title, description: data[id].description,
                            }))
                            .slice(0, 3); // Only take the first 3 categories
                    } else {
                        this.categories = []; // If no data, set categories to an empty array
                    }
                })
                .catch((error) => console.error("Error loading categories:", error))
                .finally(() => (this.loading = false)); // Set loading to false when done
        },
    },

};
</script>
