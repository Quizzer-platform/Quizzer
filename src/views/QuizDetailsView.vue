<template>
    <Navbar />
    <QuizDetails />
    <Footer />
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