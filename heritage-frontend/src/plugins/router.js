import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AboutPage from '../components/AboutPage.vue'
import FormsPage from '../components/FormsPage.vue'
import TreesPage from '../components/TreesPage.vue'
import DataPage from '../components/DataPage.vue'
import LoginPage from "@/components/LoginPage.vue";

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { name: 'home', path: '/', component: HomePage },
  { name: 'about', path: '/about', component: AboutPage },
  { name: 'forms', path: '/forms', component: FormsPage },
  { name: 'trees', path: '/trees', component: TreesPage },
  { name: 'data', path: '/data', component: DataPage },
  { name: 'login', path: '/login', component: LoginPage }
]


const router = createRouter(
{
	history: createWebHashHistory(),
  routes: routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  next()
})

export default router;