/*
 * @Author: Cary
 * @Date: 2023-06-01 19:28:11
 * @LastEditors: Cary
 * @LastEditTime: 2023-06-22 17:35:54
 * @FilePath: \fastapi-naive-web\src\api\AsyncRoutesApi.ts
 * @Descripttion:
 */
import { http } from "@/utils/http"

interface AsyncRoutesResult extends BaseResponse {
    data: Array<any>
}

//获取后端所有动态路由
export const getAsyncRoutes = () => {
    return http.request<AsyncRoutesResult>("get", "/async-routes")
}
