import { http } from "@/utils/http"
import {
    addUsersResponse,
    bulkDelUsersRequest,
    bulkDelUsersResponse,
    bulkSetUsersRequest,
    bulkSetUsersResponse,
    deleteResult,
    getCurrentUsersResponse,
    queryUsersResponse,
    setUserPasswordRequest,
    setUsersRequest,
    setUsersResponse,
    UserCreateRequest,
    UsersQueryRequestParams,
} from "./types"

/** 查询所有user */
export const queryUsersApi = (params?: UsersQueryRequestParams) => {
    return http.request<queryUsersResponse>("get", "/auth/users/query", {
        params,
    })
}

/**创建用户*/
export const addUsersApi = (data?: UserCreateRequest) => {
    return http.request<addUsersResponse>("post", "/auth/users/add", { data })
}

/**编辑用户*/
export const setUsersApi = (user_id: number, data?: setUsersRequest) => {
    return http.request<setUsersResponse>(
        "patch",
        `/auth/users/set/${user_id}`,
        {
            data,
        },
    )
}

/**删除用户*/
export const delUsersApi = (user_id: number) => {
    return http.request<deleteResult>("delete", `/auth/users/del/${user_id}`)
}

/**更新密码用户*/
export const setUsersPasswordApi = (data?: setUserPasswordRequest) => {
    return http.request<BaseResponse>("post", "/auth/users/pwdset", { data })
}

/**批量编辑用户*/
export const bulkSetUsersApi = (data?: bulkSetUsersRequest) => {
    return http.request<bulkSetUsersResponse>("patch", "/auth/users/bulkset", {
        data,
    })
}

/**批量删除用户*/
export const bulkDelUsersApi = (data: bulkDelUsersRequest) => {
    return http.request<bulkDelUsersResponse>("delete", "/auth/users/bulkdel", {
        data,
    })
}

/**查询当前用户*/
export const getCurrentUsersApi = () => {
    return http.request<getCurrentUsersResponse>("get", "/auth/users/get")
}

/**重置用户TOTP*/
export const resetTotpApi = (user_id: number) => {
    return http.request<BaseResponse>("post", `/auth/users/otpreset/${user_id}`)
}
