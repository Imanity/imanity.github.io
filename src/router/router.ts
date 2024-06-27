import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import ProjectView from '../views/ProjectView.vue'
import AlbumView from '../views/AlbumView.vue'
import AboutView from '../views/AboutView.vue'
import CVView from '../views/CVView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/blog', component: BlogView },
    { path: '/project', component: ProjectView },
    { path: '/album', component: AlbumView },
    { path: '/about', component: AboutView },
    { path: '/cv', component: CVView }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
