import { useMenusStoreHook } from "@/store/modules/appMenus"
import { router } from "./index"
import { isProxy, toRaw } from "vue"
import { cloneDeep, intersection, isAllEmpty } from "@pureadmin/utils"
import { getConfig } from "@/settings/config"
import { useTimeoutFn } from "@vueuse/core"
import {
    RouterHistory,
    createWebHistory,
    createWebHashHistory,
    RouteRecordRaw,
    RouteComponent,
    RouteRecordName,
} from "vue-router"
import { getAsyncRoutes } from "@/api/login/AsyncRoutesApi"

const IFrame = () => import("@components/Layout/FrameView.vue")
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/pages/**/*.{vue,tsx}")

function handRank(routeInfo: any) {
    const { name, path, parent, meta } = routeInfo
    return isAllEmpty(parent)
        ? isAllEmpty(meta?.rank) ||
          (meta?.rank === 0 && name !== "Home" && path !== "/")
            ? true
            : false
        : false
}

/** 按照路由中meta下的rank等级升序来排序路由只对一级路由生效 */
export function ascending(arr: any[]) {
    arr.forEach((v, index) => {
        // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
        if (handRank(v)) v.meta.rank = index + 2
    })
    return arr.sort(
        (a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
            return a?.meta.rank - b?.meta.rank
        },
    )
}

/** 过滤meta中showLink为false的菜单 */
export function filterTree(data: RouteComponent[]) {
    const newTree = cloneDeep(data).filter(
        (v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false,
    )
    newTree.forEach(
        (v: { children }) =>
            v.children && (v.children = filterTree(v.children)),
    )
    return newTree
}

/** 过滤children长度为0的的目录 */
export function filterChildrenTree(data: RouteComponent[]) {
    const newTree = cloneDeep(data).filter(
        (v: any) => v?.children?.length !== 0,
    )
    newTree.forEach(
        (v: { children }) =>
            v.children && (v.children = filterTree(v.children)),
    )
    return newTree
}

/** 判断两个数组彼此是否存在相同值 */
export function isOneOfArray(a: Array<string>, b: Array<string>) {
    return Array.isArray(a) && Array.isArray(b)
        ? intersection(a, b).length > 0
            ? true
            : false
        : true
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
export function getParentPaths(
    value: string,
    routes: RouteRecordRaw[],
    key = "path",
) {
    // 深度遍历查找
    function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
        for (let i = 0; i < routes.length; i++) {
            const item = routes[i]
            // 返回父级path
            if (item[key] === value) return parents
            // children不存在或为空则不递归
            if (!item.children || !item.children.length) continue
            // 往下查找时将当前path入栈
            parents.push(item.path)

            if (dfs(item.children, value, parents).length) return parents
            // 深度遍历查找未找到时当前path 出栈
            parents.pop()
        }
        // 未找到时返回空数组
        return []
    }

    return dfs(routes, value, [])
}

/** 查找对应 `path` 的路由信息 */
export function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
    let res = routes.find((item: { path: string }) => item.path == path)
    if (res) {
        return isProxy(res) ? toRaw(res) : res
    } else {
        for (let i = 0; i < routes.length; i++) {
            if (
                routes[i].children instanceof Array &&
                routes[i].children.length > 0
            ) {
                res = findRouteByPath(path, routes[i].children)
                if (res) {
                    return isProxy(res) ? toRaw(res) : res
                }
            }
        }
        return null
    }
}

export function addPathMatch() {
    if (!router.hasRoute("pathMatch")) {
        router.addRoute({
            path: "/:pathMatch(.*)",
            name: "pathMatch",
            redirect: "/result/404",
        })
    }
}

/** 处理动态路由（后端返回的路由） */
export function handleAsyncRoutes(routeList) {
    if (routeList.length === 0) {
        useMenusStoreHook().handleWholeMenus(routeList)
    } else {
        formatFlatteningRoutes(addAsyncRoutes(routeList)).map(
            (v: RouteRecordRaw) => {
                // 防止重复添加路由
                if (
                    router.options.routes[0].children.findIndex(
                        value => value.path === v.path,
                    ) !== -1
                ) {
                    return
                } else {
                    // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
                    router.options.routes[0].children.push(v)
                    if (!router.hasRoute(v?.name)) router.addRoute(v)
                    const flattenRouters: any = router
                        .getRoutes()
                        .find(n => n.path === "/")
                    router.addRoute(flattenRouters)
                }
            },
        )
        useMenusStoreHook().handleWholeMenus(routeList)
    }
    addPathMatch()
}

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）*/
export async function initRouter(foce: boolean = false) {
    if (getConfig().CachingAsyncRoutes) {
        // 开启动态路由缓存本地sessionStorage
        const key = "async-routes"
        const asyncRouteList = JSON.parse(sessionStorage.getItem(key) as any)
        if (asyncRouteList && asyncRouteList?.length > 0 && !foce) {
            return new Promise(resolve => {
                handleAsyncRoutes(asyncRouteList)
                resolve(router)
            })
        } else {
            return new Promise(resolve => {
                getAsyncRoutes().then(({ data }) => {
                    handleAsyncRoutes(cloneDeep(data))
                    sessionStorage.setItem(key, JSON.stringify(data))
                    resolve(router)
                })
            })
        }
    } else {
        return new Promise(resolve => {
            getAsyncRoutes().then(({ data }) => {
                handleAsyncRoutes(cloneDeep(data))
                resolve(router)
            })
        })
    }
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
export function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
    if (routesList.length === 0) return routesList
    let hierarchyList = routesList
    for (let i = 0; i < hierarchyList.length; i++) {
        if (hierarchyList[i].children) {
            hierarchyList = hierarchyList
                .slice(0, i + 1)
                .concat(hierarchyList[i].children, hierarchyList.slice(i + 1))
        }
    }
    return hierarchyList
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
export function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
    if (routesList.length === 0) return routesList
    const newRoutesList: RouteRecordRaw[] = []
    routesList.forEach((v: RouteRecordRaw) => {
        if (v.path === "/") {
            newRoutesList.push({
                component: v.component,
                name: v.name,
                path: v.path,
                redirect: v.redirect,
                meta: v.meta,
                children: [],
            })
        } else {
            newRoutesList[0]?.children.push({ ...v })
        }
    })
    return newRoutesList
}

/** 处理缓存路由（添加、删除、刷新） */
export function handleAliveRoute(name: RouteRecordName, mode?: string) {
    switch (mode) {
        case "add":
            useMenusStoreHook().cacheOperate({
                mode: "add",
                name,
            })
            break
        case "delete":
            useMenusStoreHook().cacheOperate({
                mode: "delete",
                name,
            })
            break
        case "refresh":
            useMenusStoreHook().cacheOperate({
                mode: "refresh",
                name,
            })
            break
        default:
            useMenusStoreHook().cacheOperate({
                mode: "delete",
                name,
            })
            useTimeoutFn(() => {
                useMenusStoreHook().cacheOperate({
                    mode: "add",
                    name,
                })
            }, 100)
    }
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
export function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
    if (!arrRoutes || !arrRoutes.length) return
    const modulesRoutesKeys = Object.keys(modulesRoutes)
    arrRoutes.forEach((v: RouteRecordRaw) => {
        // 将backstage属性加入meta，标识此路由为后端返回路由
        v.meta.backstage = true
        // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
        // if (v?.children && v.children.length && !v.redirect)
        //   v.redirect = v.children[0].path;
        // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
        if (v?.children && v.children.length && !v.name)
            v.name = (v.children[0].name as string) + "Parent"
        if (v.meta?.frameSrc) {
            v.component = IFrame
        } else {
            //判断路径是否以/结尾，如果不是则加上/
            v.path = v.path.endsWith("/") ? v.path : v.path + "/"
            // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path/index.vue保持一致）
            const index = v?.component
                ? modulesRoutesKeys.findIndex(ev =>
                      ev.includes(v.component as any),
                  )
                : modulesRoutesKeys.findIndex(ev =>
                      ev.includes(v.path + "index"),
                  )
            v.component = modulesRoutes[modulesRoutesKeys[index]]
        }
        if (v?.children && v.children.length) {
            addAsyncRoutes(v.children)
        }
    })
    return arrRoutes
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
export function getHistoryMode(routerHistory): RouterHistory {
    // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
    const historyMode = routerHistory.split(",")
    const leftMode = historyMode[0]
    const rightMode = historyMode[1]
    // no param
    if (historyMode.length === 1) {
        if (leftMode === "hash") {
            return createWebHashHistory("")
        } else if (leftMode === "h5") {
            return createWebHistory("")
        }
    } //has param
    else if (historyMode.length === 2) {
        if (leftMode === "hash") {
            return createWebHashHistory(rightMode)
        } else if (leftMode === "h5") {
            return createWebHistory(rightMode)
        }
    }
}
