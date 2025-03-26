<template>
    <div class="bg-white p-6 rounded-xl shadow-xl mx-auto max-w-6xl 
               dark:bg-gray-800/95 dark:text-gray-200 backdrop-blur-sm mt-8">
        <div class="hidden md:block">
            <table class="w-full text-center border-collapse overflow-hidden rounded-xl">
                <thead>
                    <tr class="bg-gradient-to-r from-teal-600 to-teal-700 text-white/95 
                              dark:from-teal-700 dark:to-teal-800 dark:text-teal-50">
                        <th></th>
                        <th v-for="(header, index) in headers" :key="index" class="p-4 font-medium tracking-wide text-sm uppercase 
                                   border-b border-teal-500/30 dark:border-teal-600/50">
                            {{ header }}
                        </th>
                        <th v-if="showActions" class="p-4 border-b border-teal-500/30 
                                   dark:border-teal-600/50"></th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-teal-100/30 dark:divide-teal-900/50">
                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-teal-700/40 transition-all duration-150 ease-out bg-teal-50 dark:bg-teal-950/10
                               dark:hover:bg-teal-900/30 group">
                        <td class="p-4 text-gray-700 dark:text-teal-100 font-normal 
                                   text-sm group-hover:text-teal-800 dark:group-hover:text-teal-200">
                            <copyText :copiedText="row[0]"></copyText>
                        </td>
                        <td v-for="(cell, colIndex) in row" :key="colIndex" class="p-4 text-gray-700 dark:text-teal-100 font-normal 
                                   text-sm group-hover:text-teal-800 dark:group-hover:text-teal-200">
                            {{ cell }}
                        </td>
                        <td v-if="showActions" class="p-4 pr-6">
                            <button class="flex items-center gap-2 ml-auto px-4 py-2 rounded-lg 
                                       bg-white/90 shadow-sm ring-1 ring-teal-200/50 hover:ring-teal-300 text-teal-800 cursor-pointer
                                       hover:bg-teal-50/80 transition-all duration-200 ease-in-out
                                       dark:bg-teal-900/30 dark:ring-teal-700/50 dark:hover:bg-teal-800/50
                                       dark:hover:ring-teal-600 dark:text-teal-200"
                                @click="$emit('view-details', row[0])">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-sm font-medium">Details</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile View -->
        <div class="block md:hidden space-y-3">
            <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="bg-teal-100/50 backdrop-blur-sm rounded-xl p-4 shadow-sm ring-1 ring-gray-100/30
                       hover:ring-teal-200/50 transition-all duration-150 ease-out
                       dark:bg-teal-900/10 dark:ring-teal-800/50 dark:hover:ring-teal-700">
                <div class="p-4 text-gray-700 dark:text-teal-100 font-normal 
                           text-sm group-hover:text-teal-800 dark:group-hover:text-teal-200">
                    <copyText :copiedText="row[0]"></copyText>
                </div>
                <div v-for="(cell, colIndex) in row" :key="colIndex" class="flex justify-between items-center py-2.5 px-1
                            border-b border-teal-100/30 last:border-0 last:pb-0
                            dark:border-teal-900/50">
                    <span class="text-xs font-medium text-teal-700/90 tracking-wide 
                              dark:text-teal-400/90">
                        {{ headers[colIndex] }}
                    </span>
                    <span class="text-sm text-teal-900/85 font-medium max-w-[60%] truncate
                    dark:text-teal-200/90">
                        {{ cell }}
                    </span>
                </div>
                <div v-if="showActions" class="pt-4 mt-3 border-t border-teal-100/30 
                           dark:border-teal-900/50">
                    <button class="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                               rounded-lg bg-teal-700/5 hover:bg-teal-700/10 ring-1 
                               ring-teal-700/10 hover:ring-teal-700/20 transition-all duration-150 text-teal-800 cursor-pointer
                               dark:bg-teal-400/10 dark:hover:bg-teal-400/20 dark:ring-teal-400/20
                               dark:hover:ring-teal-400/30 dark:text-teal-300" @click="$emit('view-details', row[0])">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CopyText from '../layout/CopyText.vue';
export default {
    name: "TableStructure",
    props: {
        headers: {
            type: Array,
            required: true,
        }, // Table headers
        rows: {
            type: Array,
            required: true,
        }, // Table data
        showActions: {
            type: Boolean,
            default: true,
        }, // Toggle action button column
    },
    components: {
        CopyText,
    },
    methods: {
        getHeaderClass(index) {
            if (index === 0) return "rounded-l-lg";
            if (index === this.headers.length - 1 && !this.showActions) return "rounded-r-lg";
            return "";
        },
        getCellClass(colIndex, rowIndex) {
            if (colIndex === 0) return "rounded-l-lg";
            if (colIndex === this.headers.length - 1 && !this.showActions) return "rounded-r-lg";
            return "";
        },
    },
};
</script>