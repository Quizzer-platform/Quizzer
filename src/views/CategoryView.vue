<template>
<Navbar/>
<Categories/>
<Footer/>
</template>
<script>
import Navbar from "../components/layout/Navbar.vue";
import Footer from "../components/layout/Footer.vue";
import Categories from "../components/home/Categories.vue";
export default{
components:{
  Categories,
  Navbar,
  Footer,
}
}
</script>


