import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import User from "../views/User";
import Topic from "../views/Topic";
import PostDetail from "../views/PostDetail";
import Search from "../views/Search";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        props: (route) => ({query: route.query})
    },
    {
        path: '/topic',
        name: 'Topic',
        component: Topic,
        props: (route) => ({query: route.query})
    },
    {
        path: '/post',
        name: 'PostDetail',
        component: PostDetail,
        props: (route) => ({query: route.query})
    },
    {
        path: '/search',
        name: 'Search',
        component: Search,
        props: (route) => ({query: route.query})
    },
    {path: '*', redirect: '/'}
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
