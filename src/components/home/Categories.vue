<template>
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Categories</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <CategoryCard 
          v-for="(category, index) in categories" 
          :key="index"
          :icon="category.icon" 
          :title="category.title" 
          :description="category.description" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import CategoryCard from "./categorycard.vue";
  
  export default {
    name: "CategoryPage",
    components: { CategoryCard },
    data() {
      return {
        categories: [
          { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
          { icon: "💻", title: "Technology", description: "Stay updated with the latest tech trends." },
          { icon: "🎨", title: "Design", description: "Discover creative design inspirations." },
          { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
          { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
          { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
          { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
          { icon: "💻", title: "Technology", description: "Stay updated with the latest tech trends." },
          { icon: "🎨", title: "Design", description: "Discover creative design inspirations." },
          { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
          { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
          { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." }, { icon: "📚", title: "Education", description: "Explore a variety of educational resources." },
          { icon: "💻", title: "Technology", description: "Stay updated with the latest tech trends." },
          { icon: "🎨", title: "Design", description: "Discover creative design inspirations." },
          { icon: "⚽", title: "Sports", description: "Catch up with the latest sports news." },
          { icon: "🎵", title: "Music", description: "Enjoy trending music and artists." },
          { icon: "🍔", title: "Food", description: "Find delicious recipes and food tips." },
          
        ]
      };
    }
  };
  </script>
  
  <style>
  /* You can add additional styles here if needed */
  </style>
  