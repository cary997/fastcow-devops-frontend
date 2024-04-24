import {
  getTasksHistoryResponse,
  readTaskStdoutParams,
  readTaskStdoutResponse,
  TasksHistory,
} from "@/api/tasks/execution"
import { getTasksHistoryApi, readTaskStdoutApi } from "@/api/tasks/executionApi"

/**查询任务记录**/
export async function getTasksHistoryHandle(tid: number) {
  return new Promise<TasksHistory>((resolve, reject) => {
    getTasksHistoryApi(tid)
      .then((res: getTasksHistoryResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**读取任务输出文件 */
export async function readTaskStdoutHandle(params: readTaskStdoutParams) {
  return new Promise<string>((resolve, reject) => {
    readTaskStdoutApi(params)
      .then((res: readTaskStdoutResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
