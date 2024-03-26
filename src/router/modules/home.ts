import { RouteRecordRaw } from "vue-router"
const Layout = () => import("@components/Layout/index.vue")

export default {
    path: "/",
    name: "worktop",
    component: Layout,
    redirect: "/home",
    meta: {
        icon: "HomeIcon",
        title: "工作台",
        en_title: "Worktop",
        menu_type: 1,
        rank: 0,
    },
    children: [
        {
            path: "/home",
            name: "home",
            component: () => import("@pages/home/index.vue"),
            meta: {
                icon: "HomeIcon",
                title: "首页",
                en_title: "Home",
                menu_type: 2,
                showParent: false,
            },
        },
    ],
} as RouteRecordRaw
