import {
  taskConfigCheckResponse,
  taskConfigCheckResult,
  TasksRunConfig,
} from "@/api/tasks/execution"
import { taskConfigCheckApi } from "@/api/tasks/executionApi"
import {
  scheduledConfig,
} from "@/api/tasks/scheduled"

/**默认参数 */
export const defaultTaskConfig: TasksRunConfig = {
  task_name: "",
  task_type: "",
  inventory: {},
  task_template_id: null,
  task_template_name: null,
  extravars: null,
  forks: 5,
  timeout: 300,
  cmdline: null,
  tags: null,
  skip_tags: null,
  module: null,
  module_args: null,
  playbook: null,
  role: null,
}

export const defaultScheduledConfig:scheduledConfig= {
  types: null,
  every: null,
  period: "minutes",
  minute: null,
  hour: "*",
  day_of_week: "*",
  day_of_month: "*",
  month_of_year: "*",
  timezone: "Asia/Shanghai",
  enabled: true,
  one_off: false,
  priority: 5,
  expire_seconds: 300,
  headers: null,
  description: null,
}
export const baseProps = {
  title: {
    type: String,
    required: true,
  },
  modalStep: {
    type: Number,
    default: 1,
  },
  titleDesc: {
    type: String,
    required: true,
  },
  otherPaneDisable: {
    type: Boolean,
    default: false,
  },
}

/**测试执行任务**/
export async function taskConfigCheckHandle(data: TasksRunConfig) {
  return new Promise<taskConfigCheckResult>((resolve, reject) => {
    taskConfigCheckApi(data)
      .then((res: taskConfigCheckResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
