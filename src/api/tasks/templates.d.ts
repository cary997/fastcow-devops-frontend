/**
 * 任务模版删除
 */
export interface deleteTaskTemplatesResponse extends BaseResponse {
  data: {
    id: string
  }
}

/**
 * 任务模版表信息不包含files字段
 */
export interface TaskTemplates {
  id?: string
  create_at?: number | null
  update_at?: number | null
  /**
   * 模版名称
   */
  name?: string
  /**
   * 任务类型
   */
  task_type?: string
  /**
   * 任务描述
   */
  desc?: string | null
}

/**
 * 任务模版文件
 */
export type TemplateFiles = {
  /**
   * 文件名称
   */
  name: string
  /**
   * 相对路径
   */
  path: string
  /**
   * 文件类型
   */
  type?: number
  /**
   * 父路径
   */
  parent?: string | null
  /**子路径 */
  children?: Array<TemplateFiles>
}

/** 任务模版表信息包含files*/
export interface TaskTemplatesWithFiles extends TaskTemplates {
  files?: Array<TemplateFiles>
}
/**
 * 任务模版创建
 */
export interface CreateTaskTemplate extends TaskTemplates {}
/**
 * 任务模版响应
 */
export interface CreateTaskTemplateResponse extends BaseResponse {
  data: TaskTemplates
}
/**
 * 任务模版查询响应
 */
export interface getTaskTemplateResponse extends BaseResponse {
  data: TaskTemplatesWithFiles
}
/**
 * 任务模版过滤参数
 */
export interface tasksTemplateQueryParams {
  name?: string
  task_type?: string
  is_all?: boolean
  limit?: number
  page?: number
}
/**
 * 任务模版过滤结果
 */
export type tasksTemplateQueryResult = {
  result?: Array<TaskTemplates> | null
  total?: number | null
  page_total?: number | null
  page?: number | null
  limit?: number | null
}
/**
 * 任务模版过滤响应
 */
export interface tasksTemplateQueryResponse extends BaseResponse {
  data: TemplateQueryResult
}

/**任务模版更新 */
export interface UpdateTaskTemplate extends TaskTemplates {}
/**
 * 任务模版更新响应
 */
export interface UpdateTaskTemplateResponse
  extends CreateTaskTemplateResponse {}

/**任务模版元数据files更新 */
export interface UpdateTaskTemplateFiles {
  /**路径 */
  path: string
  /**操作类型 */
  action: string
  /**旧路径 */
  old_path?: string
  /**文件类型 */
  type?: number
}
