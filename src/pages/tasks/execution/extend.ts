import { NButton, NIcon, NPopover } from "naive-ui"
import { reactive, ref } from "vue"
import { h } from "vue"

import {
  DeleteTasksHistoryResponse,
  DeleteTasksHistoryResult,
  getTasksHistoryResponse,
  TasksHistory,
  tasksHistoryQueryParams,
  tasksHistoryQueryResponse,
  tasksHistoryQueryResult,
  TasksRunConfig,
} from "@/api/tasks/execution"
import {
  delTasksHistoryApi,
  revokeTasksHistoryApi,
  taskRunApi,
  tasksHistoryQueryApi,
} from "@/api/tasks/executionApi"
import { $t } from "@/settings/i18n"
import { onCopy, timestampFormat } from "@/utils/tools"
import { RetryFailed } from "@vicons/carbon"
import {
  AppsListDetail20Regular,
  CommentError20Filled,
  PauseOff16Filled,
} from "@vicons/fluent"
import { Copy, CreateOutline } from "@vicons/ionicons5"

import { getTaskTypeBadgeClass } from "../templates/extend"

export const historyList = ref<Array<TasksHistory>>([])
export const loadingRef = ref(false)
/**过滤任务历史**/
export async function queryTasksHistoryHandle(
  params?: tasksHistoryQueryParams,
) {
  return new Promise<tasksHistoryQueryResult>((resolve, reject) => {
    tasksHistoryQueryApi(params)
      .then((res: tasksHistoryQueryResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
/**取消任务**/
export async function revokeTasksHistoryHandle(tid: string) {
  return new Promise<any>((resolve, reject) => {
    revokeTasksHistoryApi(tid)
      .then((res: DeleteTasksHistoryResponse) => {
        if (res.code) {
          window.$message.loading(res.message)
          resolve(res)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**删除任务历史**/
export async function delTasksHistoryHandle(data: { id_list: Array<number> }) {
  return new Promise<DeleteTasksHistoryResult>((resolve, reject) => {
    delTasksHistoryApi(data)
      .then((res: DeleteTasksHistoryResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**执行任务**/
export async function taskRunHandle(data: TasksRunConfig) {
  return new Promise<TasksHistory>((resolve, reject) => {
    taskRunApi(data)
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

export const handleRefreshHistoryList = async (
  params?: tasksHistoryQueryParams,
) => {
  loadingRef.value = true
  await queryTasksHistoryHandle(params)
    .then((res: tasksHistoryQueryResult) => {
      const { result, page, limit, total, page_total } = res
      historyList.value = result
      paginationReactive.page = page
      paginationReactive.pageCount = page_total
      paginationReactive.pageSize = limit
      paginationReactive.itemCount = total
    })
    .finally(() => {
      loadingRef.value = false
    })
}

/**表格列的key */
export const columnsRowKey = (row: TasksHistory) => row.id

/**选中的key */
export const checkRowKeys = ref([])

export const defaultQureyParams = {
  task_name: null,
  task_status: null,
  task_type: null,
  task_queue_type: null,
  limit: 10,
  page: 1,
}
/**查询参数 */
export const qureyParams = ref<tasksHistoryQueryParams>({
  ...defaultQureyParams,
})
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
      handleRefreshHistoryList(qureyParams.value)
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
    handleRefreshHistoryList(qureyParams.value)
  },
})

export const createColumns = ({
  getTaskDetail,
  retryTask,
  getTemplate,
  createTask,
  revokeTask,
}: {
  getTaskDetail: (rowData: TasksHistory) => void
  retryTask: (rowData: TasksHistory) => void
  getTemplate: (rowData: TasksHistory) => void
  createTask: (rowData: TasksHistory) => void
  revokeTask: (rowData: TasksHistory) => void
}): BaseTableColumns<TasksHistory> => {
  return [
    {
      title: $t("usersPage.tableData.selection"),
      key: "selection",
      type: "selection",
    },
    {
      title: "任务名",
      key: "task_name",
      align: "center",
    },
    {
      title: "执行时间",
      key: "task_start_time",
      align: "center",
      render(row) {
        return h(
          "span",
          { class: " text-xs" },
          { default: () => timestampFormat(row.task_start_time) },
        )
      },
    },
    {
      title: "任务类型",
      key: "task_type",
      align: "center",
      render(row) {
        return h(
          "div",
          {
            class: `badge  badge-sm text-white dark:text-black ${getTaskTypeBadgeClass(
              row.task_type,
            )}`,
          },
          { default: () => row.task_type },
        )
      },
    },
    {
      title: "执行类型",
      key: "task_queue_type",
      align: "center",
      render(row) {
        return h(
          "div",
          {
            class:
              row.task_queue_type == "asb_temp_task"
                ? "text-warning"
                : "text-primary",
          },
          {
            default: () =>
              row.task_queue_type == "asb_temp_task" ? "临时任务" : "计划任务",
          },
        )
      },
    },
    {
      title: "任务状态",
      key: "task_status",
      align: "center",
      render(row) {
        return h(
          "div",
          {
            class: "space-x-2",
          },
          [
            h(
              "span",
              {
                class: ["successful"].includes(row.task_status)
                  ? "text-success"
                  : ["failed", "timeout"].includes(row.task_status)
                    ? "text-error"
                    : "text-info",
              },
              { default: () => row.task_status },
            ),
            row.task_error
              ? h(
                  NPopover,
                  { trigger: "hover", placement: "top", width: 400 },
                  {
                    trigger: () =>
                      h(NIcon, {
                        size: 16,
                        component: CommentError20Filled,
                        class: "text-error",
                      }),
                    default: () => [
                      h(
                        NButton,
                        {
                          size: "tiny",
                          text: true,
                          onClick: () => {
                            onCopy(row.task_error)
                          },
                        },
                        {
                          icon: () =>
                            h(NIcon, {
                              size: 14,
                              component: Copy,
                              class: "text-primary mr-2",
                            }),
                        },
                      ),
                      row.task_error,
                    ],
                  },
                )
              : null,
          ],
        )
      },
    },
    {
      title: "持续时长(秒)",
      key: "task_duration",
      align: "center",
    },
    {
      title: "执行用户",
      key: "exec_user",
      align: "center",
    },
    {
      title: "关联模版",
      key: "task_template_name",
      align: "center",
      ellipsis: {
        tooltip: true,
      },
      render(row) {
        return h(
          NButton,
          {
            text: true,
            size: "small",
            class:
              row.task_type == "Playbook" ? "text-primary" : "text-lightinfo",
            onClick: () => getTemplate(row),
          },
          { default: () => row.task_template_name },
        )
      },
    },
    {
      title: $t("usersPage.tableData.action"),
      key: "actions",
      align: "center",
      width: 230,
      render(row) {
        return h(
          "div",
          {
            class: "space-x-4",
          },
          [
            h(
              NButton,
              {
                size: "tiny",
                onClick: () => {
                  getTaskDetail(row)
                },
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: AppsListDetail20Regular,
                    class: "text-secondary",
                  }),
                default: () => "详情",
              },
            ),
            !["running", "starting"].includes(row.task_status)
              ? [
                  h(
                    NButton,
                    {
                      size: "tiny",
                      onClick: () => {
                        createTask(row)
                      },
                    },
                    {
                      icon: () =>
                        h(NIcon, {
                          component: CreateOutline,
                          class: "text-secondary",
                        }),
                      default: () => "新建",
                    },
                  ),

                  h(
                    NButton,
                    {
                      size: "tiny",
                      onClick: () => {
                        retryTask(row)
                      },
                    },
                    {
                      icon: () =>
                        h(NIcon, {
                          component: RetryFailed,
                          class: "text-secondary",
                        }),
                      default: () => "重试",
                    },
                  ),
                ]
              : h(
                  NButton,
                  {
                    size: "tiny",
                    onClick: () => {
                      revokeTask(row)
                    },
                  },
                  {
                    icon: () =>
                      h(NIcon, {
                        component: PauseOff16Filled,
                        class: "text-error",
                      }),
                    default: () => "取消",
                  },
                ),
          ],
        )
      },
    },
  ]
}

export const historyToConfig = (data: TasksHistory): TasksRunConfig => {
  const config: TasksRunConfig = {
    task_name: data.task_name,
    task_type: data.task_type,
    inventory: data.task_kwargs.inventory,
    ident: data.task_id,
    cmdline: data.task_kwargs.cmdline,
    forks: data.task_kwargs.forks,
    extravars: JSON.stringify(data.task_kwargs.extravars),
    timeout: data.task_kwargs.timeout,
    module: data.task_kwargs.module,
    module_args: data.task_kwargs.module_args,
    task_template_id: data.task_template_id,
    task_template_name: data.task_template_name,
    playbook:
      data.task_type == "Playbook"
        ? `${data.task_template_id}/${data.task_kwargs.playbook}`
        : null,
    tags: data.task_kwargs.tags,
    skip_tags: data.task_kwargs.skip_tags,
    role: data.task_kwargs.role,
  }
  return config
}
