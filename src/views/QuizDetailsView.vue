<template>
    <div class="dark:bg-[#1a202c] bg-white min-h-screen">
        <Navbar />
        <QuizDetails />
        <Footer />
    </div>
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import QuizDetails from "@/components/quiz/QuizDetails.vue";
export default {
    components: {
        Navbar,
        Footer,
        QuizDetails
    }
}
</script>