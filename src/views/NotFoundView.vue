<template>
    <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="text-base font-semibold text-red-600">404</p>
            <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-red-600 sm:text-7xl">Page not found
            </h1>
            <p class="mt-6 text-lg font-medium text-pretty text-red-500 sm:text-xl/8">Sorry, we couldn’t find the page
                you’re looking for.</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <a href="#"
                    class="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold 
                    text-white shadow-xs hover:bg-teal-500 
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <router-link to="/">Go back home</router-link></a>
            </div>
        </div>
    </main>
</template>


<script>

</script>

<style scoped></style>