import { NButton, NIcon, NPopover } from "naive-ui"
import { h, reactive, ref } from "vue"

import {
  HistoryStatisticsResponse,
  HistoryStatisticsResult,
} from "@/api/tasks/execution"
import { getHistoryStatisticsApi } from "@/api/tasks/executionApi"
import {
  CreateScheduledResponse,
  CreateScheduledTask,
  PeriodicTask,
  scheduledConfig,
  scheduledQueryQueryParams,
  scheduledQueryResponse,
  scheduledQueryResult,
  ScheduledType,
  UpdateSysScheduledTask,
} from "@/api/tasks/scheduled"
import {
  addScheduledApi,
  delTasksHistoryApi,
  scheduledQueryApi,
  setScheduledApi,
  setSysScheduledApi,
} from "@/api/tasks/scheduledApi"
import { $t } from "@/settings/i18n"
import { delObjectProps, timestampFormat } from "@/utils/tools"
import { History24Filled, SaveEdit20Regular } from "@vicons/fluent"
import { InformationCircle } from "@vicons/ionicons5"
import { AdjustRound, DeleteOutlineRound } from "@vicons/material"

import { getTaskTypeBadgeClass } from "../templates/extend"

export const scheduledList = ref<Array<PeriodicTask>>([])
export const defaultQureyParams: scheduledQueryQueryParams = {
  types: "interval",
  limit: 10,
  page: 1,
}
/**查询参数 */
export const qureyParams = ref<scheduledQueryQueryParams>({
  ...defaultQureyParams,
})
/**过滤计划任务*/
export async function scheduledQueryHandle(params?: scheduledQueryQueryParams) {
  return new Promise<scheduledQueryResult>((resolve, reject) => {
    scheduledQueryApi(params)
      .then((res: scheduledQueryResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**任务历史统计*/
export async function getHistoryStatisticsHandle(periodic?: number) {
  return new Promise<HistoryStatisticsResult>((resolve, reject) => {
    getHistoryStatisticsApi(periodic)
      .then((res: HistoryStatisticsResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**添加计划任务*/
export async function addScheduledHandle(data: CreateScheduledTask) {
  return new Promise<PeriodicTask>((resolve, reject) => {
    addScheduledApi(data)
      .then((res: CreateScheduledResponse) => {
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
/**更新计划任务*/
export async function setScheduledHandle(
  sid: number,
  data: CreateScheduledTask,
) {
  return new Promise<PeriodicTask>((resolve, reject) => {
    setScheduledApi(sid, data)
      .then((res: CreateScheduledResponse) => {
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
/**更新系统内置计划任务*/
export async function setSysScheduledHandle(
  sid: number,
  data: UpdateSysScheduledTask,
) {
  return new Promise<PeriodicTask>((resolve, reject) => {
    setSysScheduledApi(sid, data)
      .then((res: CreateScheduledResponse) => {
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
/**删除计划任务*/
export async function delScheduledHandle(sid: number) {
  return new Promise<PeriodicTask>((resolve, reject) => {
    delTasksHistoryApi(sid)
      .then((res: CreateScheduledResponse) => {
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
export const loadingRef = ref(false)

export const handleRefreshScheduledList = async (
  params?: scheduledQueryQueryParams,
) => {
  loadingRef.value = true
  await scheduledQueryHandle(params)
    .then((res: scheduledQueryResult) => {
      const { result, page, limit, total, page_total } = res
      scheduledList.value = result
      paginationReactive.page = page
      paginationReactive.pageCount = page_total
      paginationReactive.pageSize = limit
      paginationReactive.itemCount = total
    })
    .finally(() => {
      loadingRef.value = false
    })
}
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
      handleRefreshScheduledList(qureyParams.value)
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
    handleRefreshScheduledList(qureyParams.value)
  },
})

export const createColumns = ({
  delScheduled,
  setScheduled,
  getHistory,
}: {
  delScheduled: (rowData: PeriodicTask) => void
  setScheduled: (rowData: PeriodicTask) => void
  getHistory: (rowData: PeriodicTask) => void
}): BaseTableColumns<PeriodicTask> => {
  return [
    {
      title: "名称",
      key: "name",
      align: "left",
      width: 190,
      ellipsis: { tooltip: true },
      fixed: "left",
    },
    {
      title: "类型",
      key: "task_type",
      align: "center",
      width: 150,
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
      title: "状态",
      key: "enabled",
      align: "center",
      width: 100,
      render(row) {
        return h("span", { class: "flex justify-center items-center" }, [
          h(NIcon, {
            class: row.enabled ? " text-success" : "text-error",
            component: AdjustRound,
            size: 16,
          }),
        ])
      },
    },
    {
      title: "计划",
      key: "schedule_str",
      align: "center",
      width: 200,
      render(row) {
        return h(
          "span",
          {
            class: "font-mono",
          },
          { default: () => row.schedule_str },
        )
      },
    },
    {
      title: "运行",
      key: "total_run_count",
      align: "center",
      render(row) {
        return h(
          "span",
          { class: " text-xs" },
          { default: () => `${row.total_run_count}次` },
        )
      },
    },
    {
      title: "最后运行",
      key: "last_run_at",
      align: "left",
      width: 200,
      ellipsis: { tooltip: true },
      fixed: "left",
      render(row) {
        return h(
          "span",
          { class: " text-xs" },
          {
            default: () =>
              row.last_run_at
                ? row.last_run_at.replace("T", " ")
                : row.last_run_at,
          },
        )
      },
    },
    {
      title: "最后编辑",
      key: "update_at",
      align: "left",
      width: 200,
      ellipsis: { tooltip: true },
      fixed: "left",
      render(row) {
        return h(
          "span",
          { class: " text-xs" },
          { default: () => `${row.user_by}/${timestampFormat(row.update_at)}` },
        )
      },
    },
    {
      title: "其他",
      key: "queue",
      align: "center",
      width: 100,
      render(row) {
        return h(
          NPopover,
          { trigger: "hover" },
          {
            trigger: () =>
              h(NIcon, {
                class: "text-lightinfo",
                size: 20,
                component: InformationCircle,
              }),
            default: () =>
              h("span", { class: "text-xs" }, [
                h(
                  "ul",
                  { class: "list-outside" },
                  {
                    default: () => [
                      h(
                        "li",
                        { class: "text-xs" },
                        { default: () => `队列优先级(0-9): ${row.priority}` },
                      ),
                      h(
                        "li",
                        { class: "text-xs" },
                        {
                          default: () => `队列过期时间: ${row.expire_seconds}s`,
                        },
                      ),

                      h(
                        "li",
                        { class: "text-xs" },
                        { default: () => `queue: ${row.queue ?? "default"}` },
                      ),
                      h(
                        "li",
                        { class: "text-xs" },
                        {
                          default: () =>
                            `exchange: ${row.exchange ?? "default"}`,
                        },
                      ),
                      h(
                        "li",
                        { class: "text-xs" },
                        {
                          default: () =>
                            `routing_key: ${row.routing_key ?? "default"}`,
                        },
                      ),
                      h(
                        "li",
                        { class: "text-xs" },
                        {
                          default: () =>
                            `headers: ${JSON.stringify(row.headers)}`,
                        },
                      ),
                      h(
                        "li",
                        { class: "text-xs" },
                        {
                          default: () =>
                            `创建时间: ${timestampFormat(row.create_at)}`,
                        },
                      ),
                    ],
                  },
                ),
              ]),
          },
        )
      },
    },
    {
      title: "备注",
      key: "description",
      align: "left",
      width: 150,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: $t("usersPage.tableData.action"),
      key: "actions",
      width: 230,
      align: "center",
      fixed: "right",
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
                disabled: row.types == "system" ? true : false,
                size: "tiny",
                onClick: () => {
                  getHistory(row)
                },
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: History24Filled,
                    class: "text-lightinfo",
                  }),
                default: () => "历史",
              },
            ),
            h(
              NButton,
              {
                disabled: row.types == "system" ? true : false,
                size: "tiny",
                onClick: () => {
                  delScheduled(row)
                },
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: DeleteOutlineRound,
                    class: "text-lightinfo",
                  }),
                default: () => "删除",
              },
            ),
            h(
              NButton,
              {
                disabled: row.name === "ldap_sync",
                size: "tiny",
                onClick: () => {
                  setScheduled(row)
                },
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: SaveEdit20Regular,
                    class: "text-lightinfo",
                  }),
                default: () => "编辑",
              },
            ),
          ],
        )
      },
    },
  ]
}

export const PeriodicTaskToScheduledConfig = (
  periodicTask: PeriodicTask,
): scheduledConfig => {
  const scheduled = delObjectProps(periodicTask.scheduled, [
    "create_at",
    "update_at",
    "id",
  ])
  return {
    ...scheduled,
    id: periodicTask.id,
    types: periodicTask.types as ScheduledType,
    headers: JSON.stringify(periodicTask.headers),
    priority: periodicTask.priority,
    expire_seconds: periodicTask.expire_seconds,
    one_off: periodicTask.one_off,
    description: periodicTask.description,
    enabled: periodicTask.enabled,
  }
}
