import {
    addUsersApi,
    bulkDelUsersApi,
    bulkSetUsersApi,
    delUsersApi,
    queryUsersApi,
} from "@/api/auth/UsersApi"
import {
    UserCreateRequest,
    UsersQueryRequestParams,
    addUsersResponse,
    bulkDelUsersRequest,
    bulkDelUsersResponse,
    bulkSetUsersRequest,
    bulkSetUsersResponse,
    deleteResult,
    queryUsersResponse,
    queryUsersResult,
} from "@/api/auth/types"
import { setUsersHandle,setUsersPasswordHandle } from "@/hooks/useAuthHook"
import { removeObjectEmpty } from "@/utils/tools"
import { FormInst } from "naive-ui"
import { reactive, ref } from "vue"

/**控制模态框显示*/
export const showUsersModal = ref<boolean>(false)
/**用于form表单validate验证结果*/
export const usersFormRef = ref<FormInst | null>(null)

/**显示抽屉*/
export const showUsersDrawer = ref<boolean>(false)

/**获取后端所有用户*/
export async function getAllUsersHandle(params?: UsersQueryRequestParams) {
    return new Promise<queryUsersResult>((resolve, reject) => {
        queryUsersApi(params)
            .then((res: queryUsersResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

/**创建用户*/
export async function addUsersHandle(data: UserCreateRequest) {
    return new Promise<UserCreateRequest>((resolve, reject) => {
        addUsersApi(data)
            .then((res: addUsersResponse) => {
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
/** 更新用户*/
export { setUsersHandle }

/**删除用户 */
export async function delUsersHandle(user_id: number) {
    return new Promise<any>((resolve, reject) => {
        delUsersApi(user_id)
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

/**修改用户密码 */
export {setUsersPasswordHandle}

/**批量更新用户 */
export async function bulkSetUsersHandle(data: bulkSetUsersRequest) {
    return new Promise<Array<number>>((resolve, reject) => {
        bulkSetUsersApi(data)
            .then((res: bulkSetUsersResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

/**批量删除用户 */
export async function bulkDelUsersHandle(data: bulkDelUsersRequest) {
    return new Promise<Array<number>>((resolve, reject) => {
        bulkDelUsersApi(data)
            .then((res: bulkDelUsersResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

/**用户列表*/
export const usersListData = ref<Array<UserCreateRequest>>()
/**刷新用户列表*/
export async function refreshUsersList(params?: UsersQueryRequestParams) {
    if (!loadingRef.value) {
        loadingRef.value = true
        const newParams = removeObjectEmpty(params)
        await getAllUsersHandle(newParams)
            .then(res => {
                usersListData.value = res.result
            })
            .finally(() => {
                loadingRef.value = false
            })
    }
}
/**表格加载状态 */
export const loadingRef = ref(true)
/**表格分页 */
export const paginationReactive = reactive({
    page: 1,
    pageCount: 1,
    pageSize: 10,
    pageSizes: [{ label: "ALL", value: 0 }, 10, 20, 50, 100],
    showSizePicker: true,
    itemCount: 10,
    size: "small",
    prefix({ itemCount }) {
        return `Total is ${itemCount}.`
    },
    onChange: (currentPage: number) => {
        if (!loadingRef.value) {
            loadingRef.value = true
            paginationReactive.page = currentPage
            qureyParams.value.page = currentPage
            queryUsersTablesHandle(qureyParams.value)
        }
    },
    onUpdatePageSize: (pageSize: number) => {
        if (pageSize) {
            paginationReactive.pageSize = pageSize
            qureyParams.value.limit = pageSize
        } else {
            paginationReactive.pageSize = 1
            qureyParams.value.limit = paginationReactive.itemCount
        }
        queryUsersTablesHandle(qureyParams.value)
    },
})

/**默认查询参数 用于重置查询 */
export const defaultQureyParams: UsersQueryRequestParams = {
    username: null,
    nickname: null,
    phone: null,
    email: null,
    user_type: null,
    user_status: null,
    roles: null,
    limit: 10,
    page: 1,
    order_by: "username",
}
/**查询参数 */
export const qureyParams = ref({ ...defaultQureyParams })

/**根据后端分页查询用户列表数据 */
export async function queryUsersTablesHandle(params?: UsersQueryRequestParams) {
    const newParams = removeObjectEmpty(params)
    await getAllUsersHandle(newParams)
        .then(res => {
            const { result, page, limit, total, page_total } = res
            usersListData.value = result
            paginationReactive.page = page
            paginationReactive.pageCount = page_total
            paginationReactive.pageSize = limit
            paginationReactive.itemCount = total
        })
        .finally(() => {
            loadingRef.value = false
        })
}
