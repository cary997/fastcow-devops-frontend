import {
    addMenusApi,
    delMenusApi,
    getMenusListApi,
    setMenusApi,
} from "@/api/auth/MenusApi"
import {
    addMenusResult,
    deleteResult,
    listMenusResult,
    menuType,
    setMenusResult,
} from "@/api/auth/types"
import { ascending } from "@/router/routerUtils"
import useLanguageStore from "@/store/modules/appLanguage"
import { renderIcon } from "@/utils/tools"
import { Link } from "@vicons/carbon"
import { FormatAlignLeftFilled } from "@vicons/material"
import { DocumentOnePage24Filled, RadioButton24Filled } from "@vicons/fluent"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const { language } = storeToRefs(useLanguageStore())
//控制表单禁用
export const formDisabled = ref<boolean>(true)

//不同类型菜单图标
export const directoryIcon = renderIcon(FormatAlignLeftFilled, {
    size: 18,
    class: "text-primary ",
})
export const pagesIcon = renderIcon(DocumentOnePage24Filled, {
    size: 18,
    class: "text-info ",
})
export const buttonIcon = renderIcon(RadioButton24Filled, {
    size: 18,
    class: "text-warning ",
})
export const exlinkIcon = renderIcon(Link, {
    size: 18,
    class: "text-accent",
})

//获取后端所有菜单
export async function getMenusListHandle(params: { to_tree: boolean }) {
    return new Promise<Array<RouteChildrenConfigsTable>>((resolve, reject) => {
        getMenusListApi(params)
            .then((res: listMenusResult) => {
                if (res.code) {
                    resolve(res.data.result)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//格式化树形菜单数据
export function getMenusTreeHook(menusList: Array<RouteChildrenConfigsTable>) {
    return menusList.map(item => {
        const currentItem = {
            ...item,
            label: () =>
                language.value === "en" ? item.meta.en_title : item.meta.title,
            key: item.id,
            prefix:
                item.meta.menu_type == 1
                    ? directoryIcon
                    : item.meta.menu_type == 2
                      ? pagesIcon
                      : item.meta.menu_type == 3
                        ? buttonIcon
                        : exlinkIcon,
        }
        if (item.children && item.children.length > 0) {
            // Recursion
            currentItem.children = getMenusTreeHook(item.children)
        } else {
            delete currentItem["children"]
        }

        return currentItem
    })
}

//创建菜单
export async function addMenusHandle(data?: menuType) {
    return new Promise<menuType>((resolve, reject) => {
        addMenusApi(data)
            .then((res: addMenusResult) => {
                if (res.code) {
                    window.$message.success(res.message)
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//更新菜单
export async function setMenusHandle(key: number, data?: menuType) {
    return new Promise<menuType>((resolve, reject) => {
        setMenusApi(key, data)
            .then((res: setMenusResult) => {
                if (res.code) {
                    window.$message.success(res.message)
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//删除菜单
export async function delMenusHandle(key: number) {
    return new Promise<any>((resolve, reject) => {
        delMenusApi(key)
            .then((res: deleteResult) => {
                if (res.code) {
                    window.$message.success(res.message)
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//后端菜单列表
export const menusList = ref<Array<RouteChildrenConfigsTable>>([])
// 初始化菜单列表
export async function initMenuList() {
    await getMenusListHandle({
        to_tree: true,
    }).then(res => {
        menusList.value = ascending(getMenusTreeHook(res))
    })
}

//刷新后端菜单列表
export async function refreshMenusList() {
    let result = ascending(
        getMenusTreeHook(
            await getMenusListHandle({
                to_tree: true,
            }),
        ),
    )
    menusList.value = result
}

//菜单树中默认展开和选中的key
export const defaultKeys = [!menusList.value.length ? 1 : menusList.value[0].id]

//控制节点选择
export const selectedKeys = ref(defaultKeys)
