<template>
    <div class="flex flex-col items-center md:w-full md:flex-row  md:items-start md:gap-4 max-w-6xl mx-auto p-6">
        <div class="flex flex-col my-4 p-4 rounded-xl shadow-md bg-gray-100 md:w-[50%] ">
            <div class="flex flex-col items-start bg-gray-100 p-4 rounded-xl shadow-md md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 m-2">React Test</h2>
                </div>
                <div>
                    <button class="bg-teal-700 text-white px-4 py-2 m-2 rounded-lg hover:bg-teal-500 cursor-pointer">Get
                        Started</button>
                </div>
            </div>
            <div class="flex flex-col mt-4 font-semibold m-2 p-4 rounded-xl w-fit">
                <div class="bg-teal-200 m-2 p-4 rounded-xl shadow-md hover:bg-teal-100">&#10004; programming skills</div>
                <div class="bg-red-200 m-2 p-4 rounded-xl shadow-md hover:bg-red-100">&#10004; 10 min </div>
                <div class="bg-orange-200 m-2 p-4 rounded-xl shadow-md hover:bg-orange-100">&#10004; low</div>
            </div>
        </div>
        <div class="  md:w-[50%]">
            <div class=" p-4 rounded-xl shadow-md md:w-full">
                <div class="p-4 bg-gray-100 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Summary of the React test</h3>
                    <p class=" mt-2">
                        Our React assessment test measures developers' skills in the React.js library.
                        It evaluates candidates in the most important React concepts, as well as assessing their skill and
                        familiarity with advanced concepts.
                    </p>
                    <div class="mt-4">
                        <h4 class="font-semibold">Covered skills</h4>
                        <div class="flex flex-col mt-2 ">
                            <div>&#10004; React Hooks</div>
                            <div>&#10004; State Management</div>
                            <div>&#10004; Design Patterns</div>
                            <div>&#10004; Advanced Concepts</div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 p-4 bg-gray-100 rounded-lg shadow">
                    <h3 class="font-semibold">Use the React.js test to hire</h3>
                    <p class=" mt-2">
                        Front-end developers, full-stack developers, game programmers, React coders, social media
                        specialists,
                        and any other role that requires a good grasp of React.
                    </p>
                </div>
            </div>
            <div class="mt-4 space-y-2 md:w-full">
                <details class="bg-gray-100 p-4 rounded-lg">
                    <summary class="font-semibold cursor-pointer">About this test</summary>
                    <p class="mt-2 ">This test is designed to assess your proficiency in React.js concepts.</p>
                </details>
                <details class="bg-gray-100 p-4 rounded-lg">
                    <summary class="font-semibold cursor-pointer">Who Created it</summary>
                    <p class="mt-2 ">Industry experts and React professionals created this test.</p>
                </details>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
<script>
</script>