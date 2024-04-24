import { TasksRunConfig } from "@/api/tasks/execution"

export type PeriodicTask = {
  id?: number | null
  create_at?: number | null
  update_at?: number | null
  name: string
  task: string
  types: string
  task_type: string
  interval_id?: number | null
  crontab_id?: number | null
  solar_id?: number | null
  clocked_id?: number | null
  args?: Array<any>
  kwargs?: TasksRunConfig
  queue: string | null
  exchange: string | null
  routing_key: string | null
  headers?: Record<string, any> | null
  priority?: number | null
  expires: string | null
  expire_seconds?: number | null
  one_off?: boolean
  start_time: string | null
  enabled?: boolean
  last_run_at: string | null
  total_run_count?: number
  date_changed?: string
  description: string
  no_changes?: boolean
  user_by: string | null
  scheduled: scheduled
}
export interface CrontabScheduleBase {
  minute?: string
  hour?: string
  day_of_week?: string
  day_of_month?: string
  month_of_year?: string
  timezone?: string
}

/**
 * Schedule executing every n seconds, minutes, hours or days.
 */
export interface IntervalScheduleBase {
  every?: number
  period?: IntervalPeriod
}

export type scheduled = CrontabScheduleBase | IntervalScheduleBase

export type scheduledQueryResult = {
  result?: Array<PeriodicTask> | null
  total?: number | null
  page_total?: number | null
  page?: number | null
  limit?: number | null
}

export interface scheduledQueryResponse extends BaseResponse {
  data: scheduledQueryResult
}

/**
 * 计划任务过滤参数
 */
export interface scheduledQueryQueryParams {
  name?: string
  types?: ScheduledType
  task_type?: string
  enabled?: boolean
  one_off?: boolean
  limit?: number
  page?: number
}

export type ScheduledType =
  | "interval"
  | "crontab"
  | "solar"
  | "clocked"
  | "system"
/**
 * 定时任务配置基类
 */
export type PeriodicTaskBase = {
  types?: ScheduledType
  headers?: string
  priority?: number
  expire_seconds?: number
  one_off?: boolean
  enabled?: boolean
  description?: string | null
}
/**
 * 定时任务基类
 */
export interface CrontabSchedule
  extends CrontabScheduleBase,
    PeriodicTaskBase {}

/**
 * Schedule executing every n seconds, minutes, hours or days.
 */
export interface IntervalSchedule extends IntervalScheduleBase, PeriodicTaskBase {}

export interface scheduledConfig
  extends PeriodicTaskBase,
    CrontabSchedule,
    IntervalSchedule {
  id?: number | null
}
/**
 * 创建定时任务
 */
export type CreateScheduledTask = {
  scheduled_config: scheduledConfig
  task_run_config: TasksRunConfig
}

export interface CreateScheduledResponse extends BaseResponse {
  data: PeriodicTask
}

export type UpdateSysScheduledTask = {
  scheduled_config: scheduledConfig
  kwargs: string
}