import { getMenusListApi } from "@/api/auth/MenusApi"
import { getRolesListApi } from "@/api/auth/RolesApi"
import { setUsersApi, setUsersPasswordApi } from "@/api/auth/UsersApi"
import {
    UserCreateRequest,
    listMenusResult,
    rolesListBaseResult,
    rolesListResult,
    setUserPasswordRequest,
    setUsersRequest,
    setUsersResponse,
} from "@/api/auth/types"
import { ascending } from "@/router/routerUtils"
import { renderIcon } from "@/utils/tools"
import { ref } from "vue"
import { Link } from "@vicons/carbon"
import { FormatAlignLeftFilled } from "@vicons/material"
import { DocumentOnePage24Filled, RadioButton24Filled } from "@vicons/fluent"
import { storeToRefs } from "pinia"
import useLanguageStore from "@/store/modules/appLanguage"

const { language } = storeToRefs(useLanguageStore())

/** 更新用户*/
export async function setUsersHandle(user_id: number, data: setUsersRequest) {
    return new Promise<UserCreateRequest>((resolve, reject) => {
        setUsersApi(user_id, data)
            .then((res: setUsersResponse) => {
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

/**修改用户密码 */
export async function setUsersPasswordHandle(data: setUserPasswordRequest) {
    return new Promise<any>((resolve, reject) => {
        setUsersPasswordApi(data)
            .then((res: BaseResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//获取所有角色信息
export async function getRolesListHandle() {
    return new Promise<Array<rolesListBaseResult>>((resolve, reject) => {
        getRolesListApi()
            .then((res: rolesListResult) => {
                if (res.code) {
                    resolve(res.data.result)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

//后端角色列表
export const rolesList = ref<Array<rolesListBaseResult>>([])

// 获取角色列表
export async function getRolesList() {
    await getRolesListHandle().then(res => {
        rolesList.value = res
    })
}

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
