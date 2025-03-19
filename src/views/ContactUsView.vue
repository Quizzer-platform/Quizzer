<template>
    <Navbar />
    <ContactUs/>
    <Footer/>
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import ContactUs from "@/components/home/ContactUs.vue";
export default{
components:{
    Navbar,
    Footer,
    ContactUs
}
}
</script>