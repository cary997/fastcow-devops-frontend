import { addMenusApi, delMenusApi, setMenusApi } from "@/api/auth/MenusApi"
import {
    addMenusResult,
    deleteResult,
    menuType,
    setMenusResult,
} from "@/api/auth/types"
import { ascending } from "@/router/routerUtils"
import { ref } from "vue"
import {
    getMenusListHandle,
    getMenusTreeHook,
    initMenuList,
    menusList,
} from "@/hooks/useAuthHook"

//控制表单禁用
export const formDisabled = ref<boolean>(true)

//获取后端所有菜单
export { getMenusListHandle }

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
export { menusList }
// 初始化菜单列表
export { initMenuList }

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
