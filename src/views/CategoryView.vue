<template>
    <Navbar />
    <search customClass="" />
    <Category />
    <Footer />
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import Category from "../components/home/Categories.vue";
import search from "../components/layout/Searchbar.vue"
export default {
    components: {
        Category,
        Navbar,
        Footer,
        search
    }
}
</script>