import { RouteRecordRaw } from "vue-router"

/*
 * @Author: Cary
 * @Date: 2023-05-27 02:27:51
 * @LastEditors:
 * @LastEditTime: 2024-02-26 20:07:12
 * @FilePath: /src/router/modules/result.ts
 * @Descripttion:
 */
export default {
    path: "/result",
    name: "result",
    redirect: "/result/403",
    meta: {
        title: "结果页",
        en_title: "Result",
        menu_type: 1,
        showLink: false,
        hiddenTag: true,
    },
    children: [
        {
            path: "/result/403",
            name: "err403",
            component: () => import("@pages/result/403.vue"),
            meta: {
                title: "403",
                en_title: "403",
                menu_type: 2,
                showLink: false,
                hiddenTag: true,
            },
        },
        {
            path: "/result/404",
            name: "err404",
            component: () => import("@pages/result/404.vue"),
            meta: {
                title: "404",
                en_title: "404",
                menu_type: 2,
                showLink: false,
                hiddenTag: true,
            },
        },
        {
            path: "/result/500",
            name: "err500",
            component: () => import("@pages/result/500.vue"),
            meta: {
                title: "500",
                en_title: "500",
                menu_type: 2,
                showLink: false,
                hiddenTag: true,
            },
        },
    ],
} as RouteRecordRaw
