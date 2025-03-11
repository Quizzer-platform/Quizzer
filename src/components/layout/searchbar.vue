<template>
    <form class="max-w-xs mx-auto mt-5" @submit.prevent>
        <div class="relative">
            <input 
                type="search" 
                v-model="searchText"
                @input="emitSearch"
                placeholder="Search"
                :class="['block w-full p-2 ps-8 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-teal-500 focus:border-teal-500', customClass]"
            />
            <button type="submit"
                :class="['absolute end-1 top-1/2 -translate-y-1/2 text-white px-3 py-1 text-sm rounded-md', customClass]">
            </button>
        </div>
    </form>
</template>

<script>
export default {
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

