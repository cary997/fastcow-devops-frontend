import { http } from "@/utils/http"

import { baseAssetsFields, getAssetsFieldsResponse } from "./type"

/**获取字段配置*/
export const getAssetsFieldsApi = () => {
  return http.request<getAssetsFieldsResponse>("get", "/assets/fields/get")
}

/**更新字段配置*/
export const setAssetsFieldsApi = (data: baseAssetsFields) => {
  return http.request<getAssetsFieldsResponse>("patch", "/assets/fields/set", {
    data,
  })
}
