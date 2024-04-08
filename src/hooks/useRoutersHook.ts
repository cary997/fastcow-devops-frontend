import { IconSelect } from "@/router/icons"
import useLanguageStore from "@/store/modules/appLanguage"
import { useMenusStore } from "@/store/modules/appMenus"
import { storeToRefs } from "pinia"
import { h } from "vue"
import { RouterLink } from "vue-router"
const { language } = storeToRefs(useLanguageStore())

// 过滤不显示父级菜单
function getShowParent(routerMap: RouteChildrenConfigsTable) {
    let newRouterMap = routerMap
    if (newRouterMap.children && newRouterMap.children.length === 1) {
        if (newRouterMap.children[0].meta.showParent === false) {
            newRouterMap = newRouterMap.children[0]
            getShowParent(newRouterMap)
        }
    }
    return newRouterMap
}
//格式化菜单数据
export function getMenusHook(routerMap: Array<RouteChildrenConfigsTable>) {
    const currentMenuList = []
    routerMap.forEach(items => {
        const item = getShowParent(items)
        if (item.meta.menu_type === 4) {
            useMenusStore().handleMenusExtlink(item, item.name)
            return
        }
        if (item.meta.menu_type === 3) {
            useMenusStore().handleMenusButton(item, item.name)
            return
        }
        const currentMenu = {
            label:
                //类型是页面则渲染为routerLink
                //类型是目录但是配置了redirect或component则渲染为routerLink
                item.meta.menu_type === 2 ||
                (item.meta.menu_type === 1 && item.redirect) ||
                (item.meta.menu_type === 1 && item.component)
                    ? () =>
                          h(
                              RouterLink,
                              {
                                  to: {
                                      name: item.name,
                                  },
                              },
                              {
                                  default: () =>
                                      language.value === "en"
                                          ? item.meta?.en_title
                                          : item.meta?.title,
                              },
                          )
                    : () =>
                          language.value === "en"
                              ? item.meta?.en_title
                              : item.meta?.title,
            key: item.name as string,
            icon: item.meta?.icon ? IconSelect(item.meta?.icon) : null,
            show: item.meta?.showLink === false ? false : true,
            menu_type: item.meta?.menu_type,
            tab: item.meta?.title,
            en_tab: item.meta?.en_title,
            hiddenTag: item.meta?.hiddenTag === true ? true : false,
        }
        if (item.children && item.children.length > 0) {
            // Recursion
            currentMenu["children"] = getMenusHook(item.children)
        }
        //过滤目录类型但是目录不包含任何页面
        if (
            currentMenu.menu_type === 1 &&
            currentMenu["children"].length === 0
        ) {
            return
        }
        if ("children" in currentMenu) {
            // Recursion
            const children = currentMenu.children
            if (children == 0) {
                delete currentMenu["children"]
            }
        }

        currentMenuList.push(currentMenu)
    })
    return currentMenuList
}
