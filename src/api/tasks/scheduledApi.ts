import { http } from "@/utils/http"

import {
  CreateScheduledResponse,
  CreateScheduledTask,
  UpdateSysScheduledTask,
  scheduledQueryQueryParams,
  scheduledQueryResponse,
} from "./scheduled"

/** 过滤任务历史 */
export const scheduledQueryApi = (params?: scheduledQueryQueryParams) => {
  return http.request<scheduledQueryResponse>("get", "/tasks/scheduled/query", {
    params,
  })
}

/**创建计划任务*/
export const addScheduledApi = (data: CreateScheduledTask) => {
  return http.request<CreateScheduledResponse>("post", "/tasks/scheduled/add", {
    data,
  })
}

/**更新计划任务*/
export const setScheduledApi = (sid: number, data: CreateScheduledTask) => {
  return http.request<CreateScheduledResponse>(
    "put",
    `/tasks/scheduled/set/${sid}`,
    {
      data,
    },
  )
}
/**更新计系统内置划任务*/
export const setSysScheduledApi = (sid: number, data: UpdateSysScheduledTask) => {
  return http.request<CreateScheduledResponse>(
    "patch",
    `/tasks/scheduled/sys_set/${sid}`,
    {
      data,
    },
  )
}

/** 删除计划任务  */
export const delTasksHistoryApi = (sid: number) => {
  return http.request<BaseResponse>(
    "delete",
    `/tasks/scheduled/del/${sid}`,
  )
}
