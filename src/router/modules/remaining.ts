import { RouteRecordRaw } from "vue-router"

const Layout = () => import("@components/Layout/index.vue")

export default [
    {
        path: "/login",
        name: "login",
        component: () => import("@pages/login/index.vue"),
        meta: {
            title: "登录",
            en_title: "login",
            showLink: false,
            rank: 101,
        },
    },
    {
        path: "/redirect",
        component: Layout,
        meta: {
            title: "加载中",
            en_title: "loading",
            showLink: false,
            rank: 102,
        },
        children: [
            {
                path: "/redirect/:path(.*)",
                name: "redirect",
                component: () => import("@components/Layout/Redirect.vue"),
            },
        ],
    },
] as Array<RouteRecordRaw>
