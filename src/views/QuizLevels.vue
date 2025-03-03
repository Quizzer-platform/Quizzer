<template>
    <Navbar/>
    <Quizlevels/>
    <Footer/>
    </template>
    <script>
    import Navbar from "../components/layout/Navbar.vue";
    import Footer from "../components/layout/Footer.vue";
    import Quizlevels from "@/components/home/Quizlevels.vue";
    export default{
    components:{
        Navbar,
        Footer,
        Quizlevels
    }
    }
    </script>