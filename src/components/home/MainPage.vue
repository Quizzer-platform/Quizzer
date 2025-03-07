<template>
    <section class="relative isolate overflow-hidden bg-gradient-to-b from-teal-50 to-white pb-16">
        <!-- Decorative background elements (Teal-themed) -->
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-100 to-teal-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>
        <Navbar />
        <!-- <SearchBar class="ml-auto w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]" /> -->
        <div class="container mx-auto px-6 text-center">
            <!-- Main Content -->
            <div class="max-w-4xl mx-auto mt-15">
                <span class="bg-gray-100 text-gray-900 border-1 border-gray-300 text-sm px-4 py-1 rounded-full">
                    🚀 Measure Skills, Not Just Words
                </span>

                <h1 class="text-4xl font-bold text-gray-900 mt-8">
                    The <span class="bg-teal-200 px-2 rounded-lg">Ultimate</span> Quiz Platform
                    <p>for Smarter Hiring</p>
                </h1>

                <div class="text-gray-600 mt-4">
                    Quizzer is more than a quiz platform—it's a gateway to skills, a tool for evaluation,
                    <p>and a community that values knowledge.</p>
                </div>

                <!-- Trusted by section -->
                <div class="mt-4 text-sm text-teal-600 font-semibold">
                    We are trusted by <span class="italic">Fortune 500 Companies</span>
                </div>

                <!-- Buttons -->
                <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4 mb-5">
                    <button
                        class="bg-teal-700 text-white px-6 py-2 rounded-lg shadow-lg cursor-pointer hover:bg-teal-900">
                        <router-link to="/organizationsignup">For Employers and Recruiters</router-link>
                    </button>
                    <button
                        class="border text-gray-900 border-gray-300 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-200">
                        <router-link to="/usersignup">For Job Seekers →</router-link>
                    </button>
                </div>
            </div>
        </div>
        <!-- Another decorative background element at the bottom (Teal-themed) -->
        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true">
            <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-teal-200 to-teal-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
            </div>
        </div>
    </section>
    <section class="py-8 px-6 text-center bg-white">
        <div class="max-w-4xl mx-auto">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800">
                What Sets our Quizzes Apart
            </h2>
            <div class="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc <p>odio in et, lectus sit lorem id
                    integer.</p>
            </div>
            <!-- Features Grid -->
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                <Features />
            </div>
        </div>
    </section>
    <section class="py-8 px-6 text-center bg-white">
        <div class="max-w-4xl mx-auto">
            <!-- Heading -->
            <h2 class="text-3xl font-bold text-gray-800">
                Explore Our Quiz Categories
            </h2>
            <!-- Categories Grid Quiz Cards -->
            <Cards :cards="cards" />
            <!-- View All Button -->
            <!-- border text-gray-900 border-gray-300 px-6 py-2 rounded-lg hover:bg-teal-50 -->
            <button @click="$router.push('/categories')"
                class="mt-8 border border-gray-300 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-100">
                View All →
            </button>
        </div>
    </section>
    <section class="py-8 px-6 bg-white text-center">
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
                    <div class="bg-white p-6 rounded-lg shadow-md text-left">
                        <div class="flex items-start gap-3">
                            <span class="text-xl text-teal-600">−</span>
                            <div>
                                <h3 class="font-semibold text-gray-800">
                                    How long until we deliver your first blog post?
                                </h3>
                                <p class="text-gray-600 mt-2 text-sm">
                                    Really boy law county she unable her sister. Feet you off its like like silk.
                                    Among sex are leave law built now. In built table in an rapid blush. Merits
                                    behind on afraid or warmly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Collapsed Question -->
                    <div class="bg-white p-6 rounded-lg shadow-md text-left flex items-center gap-3">
                        <span class="text-xl text-teal-700">+</span>
                        <h3 class="font-semibold text-gray-800">
                            How long until we deliver your first blog post?
                        </h3>
                    </div>
                </div>

                <!-- Right Column  -->
                <div class="space-y-4">
                    <div class="bg-white p-6 rounded-lg shadow-md text-left flex items-center gap-3">
                        <span class="text-xl text-teal-700">+</span>
                        <h3 class="font-semibold text-gray-800">
                            How long until we deliver your first blog post?
                        </h3>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-md text-left flex items-center gap-3">
                        <span class="text-xl text-teal-700">+</span>
                        <h3 class="font-semibold text-gray-800">
                            How long until we deliver your first blog post?
                        </h3>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-md text-left flex items-center gap-3">
                        <span class="text-xl text-teal-700">+</span>
                        <h3 class="font-semibold text-gray-800">
                            How long until we deliver your first blog post?
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="py-16 px-6 bg-white text-center">
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
                            <h3 class="font-semibold text-gray-800">Lora Smith</h3>
                            <p class="text-sm text-gray-500">Designer</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400"><i>i</i><i>i</i> </span>
                        <p class="text-gray-600 text-sm italic">
                            It is a long established fact that a reader will be distracted by the readable content of a
                            page when looking at its layout.
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
                            <h3 class="font-semibold text-gray-800">Lora Smith</h3>
                            <p class="text-sm text-gray-500">Designer</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400"><i>i</i><i>i</i> </span>
                        <p class="text-gray-600 text-sm italic">
                            It is a long established fact that a reader will be distracted by the readable content of a
                            page when looking at its layout.
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
                            <h3 class="font-semibold text-gray-800">Lora Smith</h3>
                            <p class="text-sm text-gray-500">Designer</p>
                            <!-- Stars -->
                            <div class="text-yellow-500 text-lg">
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                                <i>i</i>
                            </div>
                        </div>
                    </div>

                    <!-- Quote & Review -->
                    <div class="mt-4 flex space-x-2">
                        <span class="text-4xl text-gray-400"><i>i</i><i>i</i> </span>
                        <p class="text-gray-600 text-sm italic">
                            It is a long established fact that a reader will be distracted by the readable content of a
                            page when looking at its layout.
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
// import SearchBar from "../layout/Searchbar.vue";
export default {
    components: {
        Navbar,
        Footer,
        Features,
        Cards,
        // SearchBar
    },
    data() {
        return {
            cards: [
                {
                    icon: "icon",
                    title: "Programming",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
                },
                {
                    icon: "icon",
                    title: "Languages",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
                },
                {
                    icon: "icon",
                    title: "Typing Speed",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
                },
            ],
        };
    },
};
</script>