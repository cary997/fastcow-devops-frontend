import { http } from "@/utils/http"
import {
    CreateTaskTemplate,
    CreateTaskTemplateResponse,
    UpdateTaskTemplate,
    UpdateTaskTemplateFiles,
    UpdateTaskTemplateResponse,
    deleteTaskTemplatesResponse,
    getTaskTemplateResponse,
    tasksTemplateQueryParams,
    tasksTemplateQueryResponse,
} from "./types"

/**创建任务模版*/
export const addTasksTemplateApi = (data: CreateTaskTemplate) => {
    return http.request<CreateTaskTemplateResponse>(
        "post",
        "/tasks/templates/add",
        { data },
    )
}

/** 过滤任务模版 */
export const queryTasksTemplateApi = (params?: tasksTemplateQueryParams) => {
    return http.request<tasksTemplateQueryResponse>(
        "get",
        "/tasks/templates/query",
        {
            params,
        },
    )
}

/** 查询任务模版 */
export const getTasksTemplateApi = (tid: string) => {
    return http.request<getTaskTemplateResponse>(
        "get",
        `/tasks/templates/get/${tid}`,
    )
}
/** 删除任务模版 */
export const delTasksTemplateApi = (tid: string) => {
    return http.request<deleteTaskTemplatesResponse>(
        "delete",
        `/tasks/templates/del/${tid}`,
    )
}

/** 更新任务模版 */
export const setTasksTemplateApi = (tid: string, data: UpdateTaskTemplate) => {
    return http.request<UpdateTaskTemplateResponse>(
        "patch",
        `/tasks/templates/set/${tid}`,
        {
            data,
        },
    )
}
/** 更新任务模版元数据文件 */
export const setTasksTemplateFilesApi = (
    tid: string,
    data: UpdateTaskTemplateFiles,
) => {
    return http.request<UpdateTaskTemplateResponse>(
        "patch",
        `/tasks/templates/set_files/${tid}`,
        {
            data,
        },
    )
}
