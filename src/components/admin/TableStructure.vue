<template>
    <div class="bg-white p-6 rounded-lg shadow-lg mx-auto max-w-5xl">
        <div class="hidden md:block">
            <table class="w-full text-left border-collapse overflow-hidden rounded-lg">
                <thead>
                    <tr class="bg-teal-900 text-white text-center">
                        <th v-for="(header, index) in headers" :key="index" class="p-4">
                            {{ header }}
                        </th>
                        <th v-if="showActions" class="p-4"></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex"
                        class="bg-teal-700/25 hover:bg-teal-700/50 transition duration-200 ease-in-out">
                        <td v-for="(cell, colIndex) in row" :key="colIndex" class="p-3 text-center font-semibold">
                            {{ cell }}
                        </td>
                        <td v-if="showActions" class="p-3 text-right">
                            <button
                                class="bg-teal-700 hover:bg-teal-900 text-white px-5 py-2 rounded-md shadow-md cursor-pointer"
                                @click="$emit('view-details', row[0])">
                                Details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="block md:hidden">
            <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="bg-teal-700/25 rounded-lg p-4 mb-4 shadow-md">
                <div v-for="(cell, colIndex) in row" :key="colIndex"
                    class="flex justify-between items-center py-2 border-b border-teal-900/10">
                    <span class="font-semibold text-teal-900">{{ headers[colIndex] }}:</span>
                    <span class="text-teal-900">{{ cell }}</span>
                </div>
                <div v-if="showActions" class="flex justify-end mt-4">
                    <button
                        class="bg-teal-700 hover:bg-teal-900 text-white px-5 py-2 rounded-md shadow-md cursor-pointer"
                        @click="$emit('view-details', row[0])">
                        Details
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
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