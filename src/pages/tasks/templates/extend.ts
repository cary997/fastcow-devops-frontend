import {
    addTasksTemplateApi,
    delTasksTemplateApi,
    getTasksTemplateApi,
    queryTasksTemplateApi,
    setTasksTemplateApi,
} from "@/api/tasks/templatesApi"
import {
    CreateTaskTemplate,
    CreateTaskTemplateResponse,
    TaskTemplates,
    UpdateTaskTemplate,
    UpdateTaskTemplateResponse,
    deleteTaskTemplatesResponse,
    tasksTemplateQueryParams,
    tasksTemplateQueryResponse,
    tasksTemplateQueryResult,
} from "@/api/tasks/types"
import { reactive, ref } from "vue"
/**控制模态框显示 */
export const showModal = ref<boolean>(false)
export const defaultTemplateData: CreateTaskTemplate = {
    name: null,
    task_type: "Ad-Hoc",
    desc: null,
}
/**模态框绑定数据 */
export const templateData = ref<TaskTemplates>({ ...defaultTemplateData })
/**任务模版列表 */
export const templateList = ref<Array<TaskTemplates>>([])
/**分页 */
export const paginationReactive = reactive({
    page: 1,
    pageSize: 1,
    itemCount: 0,
    prefix({ itemCount }) {
        return `Total is ${itemCount}.`
    },
})
/**创建任务模版*/
export async function addTasksTemplateHandle(data: CreateTaskTemplate) {
    return new Promise<TaskTemplates>((resolve, reject) => {
        addTasksTemplateApi(data)
            .then((res: CreateTaskTemplateResponse) => {
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

/**过滤任务模版**/
export async function queryTasksTemplateHandle(
    params?: tasksTemplateQueryParams,
) {
    return new Promise<tasksTemplateQueryResult>((resolve, reject) => {
        queryTasksTemplateApi(params)
            .then((res: tasksTemplateQueryResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

export async function refreshTemplateList(params?: tasksTemplateQueryParams) {
    await queryTasksTemplateHandle(params).then(res => {
        const { result, page, limit, total } = res
        templateList.value = result
        paginationReactive.page = page
        paginationReactive.pageSize = limit
        paginationReactive.itemCount = total
    })
}

/**删除任务模版**/
export async function delTasksTemplateHandle(tid: string) {
    return new Promise<any>((resolve, reject) => {
        delTasksTemplateApi(tid)
            .then((res: deleteTaskTemplatesResponse) => {
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

/**更新任务模版**/
export async function setTasksTemplateHandle(
    tid: string,
    data: UpdateTaskTemplate,
) {
    return new Promise<any>((resolve, reject) => {
        setTasksTemplateApi(tid, data)
            .then((res: UpdateTaskTemplateResponse) => {
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
