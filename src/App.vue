<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
    <header>
        <Header title="Renjie's space" />
    </header>

    <article>todo</article>

    <footer>
        <Footer />
    </footer>
</template>

<style scoped>
header {
    background-color: darkslategray;
}

article {
    min-height: 400px;
}

footer {
    background-color: lightslategray;
}
</style>
