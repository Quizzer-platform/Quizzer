<template>
    <form class="max-w-xs mx-auto mt-5" @submit.prevent>
        <div class="relative">
            <!-- Search Input -->
            <input 
                type="search" 
                v-model="searchText"
                @input="emitSearch"
                placeholder="Search..."
                :class="[
                    'block w-full pl-10 pr-4 py-2 text-sm border rounded-md outline-none shadow-md transition',
                    'bg-white text-gray-900 border-gray-300 focus:ring-teal-500 focus:border-teal-500', 
                    'dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-teal-400 dark:focus:border-teal-400',
                    customClass
                ]"
            />
        </div>
    </form>
</template>


<script>
export default {
    name: "Searchbar",
    props: {
        customClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            searchText: ""
        };
    },
    methods: {
        emitSearch() {
            this.$emit("search", this.searchText);
        }
    }
};
</script>

