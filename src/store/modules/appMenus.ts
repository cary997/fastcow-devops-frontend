import { defineStore } from "pinia"
import { store } from "@/store"
import { cacheType } from "./types.d"
import { constantMenus } from "@/router"
import { ascending, filterTree, filterChildrenTree } from "@router/routerUtils"
import { getKeyList } from "@pureadmin/utils"
import { useTabsStoreHook } from "./appTabs"
import { ref } from "vue"
import { MenuInst } from "naive-ui"
import { RouteRecordRaw } from "vue-router"

export const useMenusStore = defineStore({
    id: "app-menus",
    state: () => ({
        // 静态路由生成的菜单
        constantMenus,
        // 整体路由生成的菜单（静态、动态）
        wholeMenus: [],
        // 整体路由生成的按钮（静态、动态）
        wholeMenusButton: [],
        // 整体路由生成的外链（静态、动态）
        wholeMenusExtlink: [],
        // 缓存页面keepAlive
        cachePageList: [],
        // 当前页面key
        currentKey: null,
        // 当前展开key
        menuInstRef: ref<MenuInst | null>(null),
    }),
    actions: {
        /** 组装整体路由生成的菜单 */
        handleWholeMenus(routes: Array<RouteRecordRaw>) {
            this.wholeMenus = filterChildrenTree(
                filterTree(ascending(this.constantMenus.concat(routes))),
            )
        },
        handleMenusButton(btninfo: any, name) {
            // 判断是否存在
            const NameHasExits = this.wholeMenusButton.some(button => {
                return button.name === name
            })
            if (NameHasExits) return
            this.wholeMenusButton.push(btninfo.name)
        },
        handleMenusExtlink(extlinkinfo: any, name) {
            // 判断是否存在
            const NameHasExits = this.wholeMenusExtlink.some(extlink => {
                return extlink.name === name
            })
            if (NameHasExits) return
            this.wholeMenusExtlink.push(extlinkinfo)
        },
        cacheOperate({ mode, name }: cacheType) {
            const delIndex = this.cachePageList.findIndex(v => v === name)
            switch (mode) {
                case "refresh":
                    this.cachePageList = this.cachePageList.filter(
                        v => v !== name,
                    )
                    break
                case "add":
                    // 判断是否存在
                    const NameHasExits = this.cachePageList.some(key => {
                        return key === name
                    })
                    if (NameHasExits) return
                    this.cachePageList.push(name)
                    break
                case "delete":
                    delIndex !== -1 && this.cachePageList.splice(delIndex, 1)
                    break
            }
            /** 监听缓存页面是否存在于标签页，不存在则删除 */
            ;(() => {
                let cacheLength = this.cachePageList.length
                const nameList = getKeyList(useTabsStoreHook().multiTags, "key")
                while (cacheLength > 0) {
                    nameList.findIndex(
                        v => v === this.cachePageList[cacheLength - 1],
                    ) === -1 &&
                        this.cachePageList.splice(
                            this.cachePageList.indexOf(
                                this.cachePageList[cacheLength - 1],
                            ),
                            1,
                        )
                    cacheLength--
                }
            })()
        },
        /** 清空缓存页面 */
        clearAllCachePage() {
            this.wholeMenus = []
            this.cachePageList = []
            this.wholeMenusButton = []
            this.wholeMenusExtlink = []
        },
    },
})

export function useMenusStoreHook() {
    return useMenusStore(store)
}
