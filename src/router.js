import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: () => import('@/Views/a1')
        },
        {
            path: '/page-2',
            component: () => import('@/Views/page')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
});
// routes.beforeEach((to, from, next) => { next()});
export default routes