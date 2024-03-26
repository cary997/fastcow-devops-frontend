/*
 * @Author:
 * @Date: 2024-02-15 22:23:54
 * @LastEditors:
 * @LastEditTime: 2024-02-18 20:05:07
 * @FilePath: \fastapi-naive-web\src\api\auth\RolesApi.ts
 * @Descripttion:
 */
import { http } from "@/utils/http"
import {
    deleteResult,
    rolesCreateRequest,
    rolesCreateResult,
    rolesListResult,
    setRolesResult,
} from "./types"

/**获取角色列表*/
export const getRolesListApi = () => {
    return http.request<rolesListResult>("get", "/auth/roles/list")
}

/**创建角色*/
export const addRolesApi = (data?: rolesCreateRequest) => {
    return http.request<rolesCreateResult>("post", "/auth/roles/add", { data })
}

/**更新角色*/
export const setRolesApi = (role_id: number, data?: rolesCreateRequest) => {
    return http.request<setRolesResult>("patch", `/auth/roles/set/${role_id}`, {
        data,
    })
}

/**删除角色*/
export const delRolesApi = (role_id: number) => {
    return http.request<deleteResult>("delete", `/auth/roles/del/${role_id}`)
}
