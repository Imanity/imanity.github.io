<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconHome from './icons/IconHome.vue'
import IconBlog from './icons/IconBlog.vue'
import IconProject from './icons/IconProject.vue'
import IconAlbum from './icons/IconAlbum.vue'
import IconAbout from './icons/IconAbout.vue'
defineProps<{
    title: string
}>()
</script>

<template>
    <div class="banner">
        <div class="nav-wrapper">
            <RouterLink to="/">Renjie's space</RouterLink>
            <nav class="nav">
                <RouterLink to="/"><IconHome /><span>Home</span></RouterLink>
                <RouterLink to="/blog"><IconBlog /><span>Blog</span></RouterLink>
                <RouterLink to="/project"><IconProject /><span>Projects</span></RouterLink>
                <RouterLink to="/album"><IconAlbum /><span>Album</span></RouterLink>
                <RouterLink to="/about"><IconAbout /><span>About</span></RouterLink>
            </nav>
        </div>

        <div class="title">{{ title }}</div>
    </div>
</template>

<style scoped>
.banner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .nav-wrapper {
        height: 64px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        a,
        RouterLink {
            text-decoration: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            line-height: 64px;
            padding-left: 16px;
        }

        nav {
            display: flex;
            justify-content: flex-end;
            padding: 16px 8px;

            a,
            RouterLink {
                text-decoration: none;
                color: inherit;
                cursor: pointer;
                padding: 0 16px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                span {
                    color: #ffffff;
                    font-size: 15px;
                    padding-left: 8px;
                }
            }
            a:hover,
            RouterLink:hover {
                filter: brightness(75%);
            }
        }
    }

    .title {
        color: #ffffff;
        font-size: 72px;
        text-align: center;
        line-height: 160px;
        padding: 10px 0;
    }
}
</style>
