import {
    addRolesApi,
    delRolesApi,
    getRolesListApi,
    setRolesApi,
} from "@/api/auth/RolesApi"
import {
    deleteResult,
    rolesCreateRequest,
    rolesCreateResult,
    rolesListBaseResult,
    rolesListResult,
    setRolesResult,
} from "@/api/auth/types"
import { clone } from "@pureadmin/utils"
import { ref, reactive } from "vue"

//控制模态框显示
export const showRolesModal = ref<boolean>(false)

//当前选中的角色信息
export const currentRolesData = ref<rolesListBaseResult>(null)

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

//创建角色
export async function addRolesHandle(data: rolesCreateRequest) {
    return new Promise<rolesCreateRequest>((resolve, reject) => {
        addRolesApi(data)
            .then((res: rolesCreateResult) => {
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
//更新角色
export async function setRolesHandle(key: number, data: rolesCreateRequest) {
    return new Promise<rolesCreateRequest>((resolve, reject) => {
        setRolesApi(key, data)
            .then((res: setRolesResult) => {
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

//删除角色
export async function delRolesHandle(key: number) {
    return new Promise<any>((resolve, reject) => {
        delRolesApi(key)
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

//加载状态
export const loadingRef = ref<boolean>(true)
//后端角色列表
export const rolesListData = ref<Array<rolesListBaseResult>>([])

//表单绑定数据
export const rolesDefaultModalData: rolesCreateRequest = {
    name: null,
    nickname: null,
    desc: null,
    role_status: true,
    menus: [],
}
//表单绑定数据
export const rolesData = ref<rolesCreateRequest>({ ...rolesDefaultModalData })

// 初始化菜单列表
export async function initRolesList() {
    await getRolesListHandle()
        .then(res => {
            rolesListData.value = res
            currentRolesData.value = rolesListData.value[0]
            rolesData.value = clone(currentRolesData.value, true)
        })
        .finally(() => {
            loadingRef.value = false
        })
}
//刷新后端角色列表
export async function refreshRolesList() {
    loadingRef.value = true
    await getRolesListHandle()
        .then(res => {
            rolesListData.value = res
        })
        .finally(() => {
            loadingRef.value = false
        })
}

//启用or禁用角色数量
export function getRolesStatus(count: number, status: boolean) {
    rolesListData.value.forEach(item => {
        item.role_status === status ? count++ : count
    })
    return count
}
