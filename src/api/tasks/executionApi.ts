import { http } from "@/utils/http"

import {
  DeleteTasksHistoryResponse,
  getTasksHistoryResponse,
  HistoryStatisticsResponse,
  readTaskStdoutParams,
  readTaskStdoutResponse,
  tasksHistoryQueryParams,
  tasksHistoryQueryResponse,
  TasksRunConfig,
} from "./execution"

/** 过滤任务历史 */
export const tasksHistoryQueryApi = (params?: tasksHistoryQueryParams) => {
  return http.request<tasksHistoryQueryResponse>(
    "get",
    "/tasks/execution/query",
    {
      params,
    },
  )
}
/** 取消任务历史  */
export const revokeTasksHistoryApi = (tid: string) => {
  return http.request<BaseResponse>(
    "post",
    `/tasks/execution/revoke/${tid}`,
  )
}
/** 删除任务历史  */
export const delTasksHistoryApi = (data: { id_list: Array<number> }) => {
  return http.request<DeleteTasksHistoryResponse>(
    "delete",
    "/tasks/execution/del",
    { data },
  )
}

/** 查询任务模版 */
export const getTasksHistoryApi = (tid: string) => {
  return http.request<getTasksHistoryResponse>(
    "get",
    `/tasks/execution/get/${tid}`,
  )
}

/** 执行任务 */
export const taskRunApi = (data: TasksRunConfig) => {
  return http.request<getTasksHistoryResponse>("post", "/tasks/execution/run", {
    data,
  })
}

/** 测试执行任务 */
export const taskConfigCheckApi = (data: TasksRunConfig) => {
  return http.request<getTasksHistoryResponse>(
    "post",
    "/tasks/execution/check",
    {
      data,
    },
  )
}

/**读取任务输出 */
export const readTaskStdoutApi = (params: readTaskStdoutParams) => {
  return http.request<readTaskStdoutResponse>(
    "get",
    "/tasks/execution/read_stdout",
    {
      params,
    },
    {showNProgress: false},
  )
}

/** 任务历史统计 */
export const getHistoryStatisticsApi = (periodic: number) => {
  return http.request<HistoryStatisticsResponse>(
    "get",
    `/tasks/execution/history_statistics/${periodic}`,
  )
}