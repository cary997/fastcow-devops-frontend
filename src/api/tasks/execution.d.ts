/**
 * 任务历史表信息
 */
export type TasksHistory = {
  id?: number | null
  create_at?: number | null
  update_at?: number | null
  /**
   * 任务id
   */
  task_id?: string
  /**
   * 任务类型
   */
  task_type?: string
  /**
   * 任务名称
   */
  task_name?: string
  /**
   * 任务参数
   */
  task_kwargs?: Record<string, any>
  /**
   * 任务返回码
   */
  task_rc?: number | null
  /**
   * 任务状态
   */
  task_status?: string | null
  /**
   * 任务错误信息
   */
  task_error?: string | null
  /**
   * 任务开始时间
   */
  task_start_time?: number | null
  /**
   * 任务结束时间
   */
  task_end_time?: number | null
  /**
   * 任务耗时
   */
  task_duration?: number | null
  /**
   * 模版ID
   */
  task_template_id?: string | null
  /**
   * 模版名称
   */
  task_template_name?: string | null
  /**
   * 执行用户
   */
  exec_user?: string | null
  /**
   * 执行节点
   */
  exec_worker?: string | null
  /** 任务队列类型 */
  task_queue_type?: string | null
  /** 计划任务名称 */
  task_scheduled_name?: string | null
}

/**
 * 任务历史过滤参数
 */
export interface tasksHistoryQueryParams {
  task_name?: string
  task_status?: string
  task_type?: string
  limit?: number
  page?: number
}
/**
 * 任务历史过滤结果
 */
export interface tasksHistoryQueryResult {
  result?: Array<TasksHistory> | null
  total?: number | null
  page_total?: number | null
  page?: number | null
  limit?: number | null
}
/**
 * 任务历史过滤响应
 */
export interface tasksHistoryQueryResponse extends BaseResponse {
  data: tasksHistoryQueryResult
}

/**
 * 删除任务历史结果
 */
export type DeleteTasksHistoryResult = {
  id: number
  task_id: string
  private_data_dir: string
}
/**
 * 删除任务历史响应
 */
export interface DeleteTasksHistoryResponse extends BaseResponse {
  data: DeleteTasksHistoryResult
}

/**
 * 查询任务历史响应
 */
export interface getTasksHistoryResponse extends BaseResponse {
  data: TasksHistory
}
/**
 * 配置检查响应
 */
export interface taskConfigCheckResult {
  rc?: number
  status?: string
  task_type?: string
  stdout?: string
}
export interface taskConfigCheckResponse extends BaseResponse {
  data: taskConfigCheck
}

/**
 * 任务执行配置
 */
export type TasksRunConfig = {
  /**
   * task name
   */
  task_name: string
  /**
   * task type
   */
  task_type: string
  /**
   * inventory
   */
  inventory: Object | null
  /** 任务队列类型 */
  task_queue_type?: string | null
  /** 计划任务名称 */
  task_scheduled_name?: string | null
  /**
   * run id
   */
  ident?: string | null
  /**
   * command line
   */
  cmdline?: string | null
  /**
   * host pattern
   */
  host_pattern?: string | null
  /**
   * forks
   */
  forks?: number | null
  /**
   * extra vars
   */
  extravars?: string | Object | null
  /**
   * timeout
   */
  timeout?: number | null
  /**
   * ansible module
   */
  module?: string | null
  /**
   * ansible module args
   */
  module_args?: string | null
  /**
   * playbook tempalate id
   */
  task_template_id?: string | null
  /**
   * playbook tempalate name
   */
  task_template_name?: string | null
  /**
   * playbook file
   */
  playbook?: string | null
  /**
   * tags
   */
  tags?: string | null
  /**
   * skip tags
   */
  skip_tags?: string | null
  /**
   * role name
   */
  role?: string | null
}

/** 读取任务输出参数*/
export type readTaskStdoutParams = {
  task_id: string
  private_dir: string
}
/** 读取任务输出响应*/
export interface readTaskStdoutResponse extends BaseResponse {
  data: string
}

/**
 * 任务历史统计结果
 */
export type HistoryStatisticsResult = {
  exec_count?: number;
  exec_success_count?: number;
  exec_fail_count?: number;
  exec_running_count?: number;
  exec_duration_max?: number;
  exec_duration_min?: number;
  exec_duration_avg?: number;
};
/**任务历史统计响应 */
export interface HistoryStatisticsResponse extends BaseResponse {
  data: HistoryStatisticsResult;
}