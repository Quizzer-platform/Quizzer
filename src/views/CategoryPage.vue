<template>
<Navbar/>
<Category/>
<Footer/>
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import Category from "../components/home/Categories.vue";
export default{
components:{
  Category,
  Navbar,
  Footer,
}
}
</script>


