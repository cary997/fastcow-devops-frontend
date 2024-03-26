import {
    createRouter,
    RouteComponent,
    Router,
    RouteRecordRaw,
} from "vue-router"
import {
    findRouteByPath,
    formatFlatteningRoutes,
    formatTwoStageRoutes,
    getHistoryMode,
    handleAliveRoute,
    initRouter,
    ascending,
} from "./routerUtils"
import { getConfig, simpleConfig } from "@/settings/config"
import remainingRouter from "./modules/remaining"
import { App } from "vue"
import { getToken } from "@/utils/storage/userLogin"
import NProgress from "@/utils/progress"
import { isUrl, openLink } from "@pureadmin/utils"
import { useMenusStoreHook } from "@/store/modules/appMenus"
import { useTabsStoreHook } from "@/store/modules/appTabs"
import { getLanguage } from "@/utils/storage/Language"
import { getTagHook } from "@/hooks/useTagsHook"

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
    ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
    {
        eager: true,
    },
)

/** 原始静态路由（未做任何处理） */
const routes: RouteRecordRaw[] = []

Object.keys(modules).forEach(key => {
    routes.push(modules[key].default)
})
/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
    formatFlatteningRoutes(ascending(routes)),
)
/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteRecordRaw> = ascending(routes).concat(
    ...remainingRouter,
)
/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
    return remainingRouter[v].path
})

/** 创建路由实例 */
export const router: Router = createRouter({
    history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
    routes: constantRoutes.concat(...remainingRouter),
    strict: true,
    scrollBehavior(to, from, savedPosition) {
        return new Promise(resolve => {
            if (savedPosition) {
                return savedPosition
            } else {
                if (from.meta.saveSrollTop) {
                    const top: number =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop
                    resolve({ left: 0, top })
                }
            }
        })
    },
})

/** 重置路由 */
export function resetRouter() {
    router.getRoutes().forEach(route => {
        const { name, meta } = route
        if (name && router.hasRoute(name) && meta?.backstage) {
            router.removeRoute(name)
            router.options.routes = formatTwoStageRoutes(
                formatFlatteningRoutes(ascending(routes)),
            )
        }
    })
    useMenusStoreHook().clearAllCachePage()
    sessionStorage.removeItem("async-routes")
}

/** 路由白名单 */
const whiteList = simpleConfig.whiteListFrontend
router.beforeEach((to: toRouteType, _from, next) => {
    if (to.meta?.keepAlive) {
        handleAliveRoute(to.name, "add")
        // 页面整体刷新和点击标签页刷新
        if (_from.name === undefined || _from.name === "Redirect") {
            handleAliveRoute(to.name)
        }
    }
    const userInfo = getToken()
    NProgress.start()
    const externalLink = to?.meta.menu_type === 4 && isUrl(to?.name as string)
    if (!externalLink) {
        to.matched.some(item => {
            if (!item.meta.title) return ""
            const language = getLanguage()
            const Title = getConfig().title
            if (Title)
                document.title = `${Title} | ${
                    language === "zh-CN"
                        ? item.meta?.title
                        : item.meta?.en_title
                }`
            else
                document.title = (
                    language === "zh-CN"
                        ? item.meta?.title
                        : item.meta?.en_title
                ) as string
        })
    }
    /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
    function toCorrectRoute() {
        whiteList.includes(to.fullPath) ? next(_from.fullPath) : next()
    }
    if (userInfo) {
        // 无权限跳转403页面
        // if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
        //   next({ path: "/result/403" });
        // }
        if (_from?.name) {
            // name为超链接
            if (externalLink) {
                openLink(to?.name as string)
                NProgress.done()
            } else {
                toCorrectRoute()
            }
        } else {
            // 刷新
            if (
                useMenusStoreHook().wholeMenus.length === 0 &&
                to.path !== "/login"
            ) {
                initRouter().then((router: Router) => {
                    const { path } = to
                    const route = findRouteByPath(
                        path,
                        router.options.routes[0].children,
                    )
                    if (route && route.meta?.title) {
                        if (route.meta.menu_type === 2) {
                            useTabsStoreHook().handleTags(
                                "push",
                                getTagHook(route),
                            )
                        }
                    }
                    router.push(to.fullPath)
                })
            }
            toCorrectRoute()
        }
    } else {
        if (to.path !== "/login") {
            if (whiteList.indexOf(to.path) !== -1) {
                next()
            } else {
                next({ path: "/login" })
            }
        } else {
            next()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export function setupRouter(app: App<Element>) {
    app.use(router)
}
