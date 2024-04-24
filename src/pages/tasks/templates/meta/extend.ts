import { ref } from "vue"

import {
  getTaskTemplateResponse,
  TaskTemplatesWithFiles,
  TemplateFiles,
  UpdateTaskTemplateFiles,
} from "@/api/tasks/templates"
import {
  getTasksTemplateApi,
  setTasksTemplateFilesApi,
} from "@/api/tasks/templatesApi"
import { renderIcon } from "@/utils/tools"
import { DocumentText, FolderOpen } from "@vicons/ionicons5"
import { SpaceDashboardFilled } from "@vicons/material"

export const templateMetaData = ref<TaskTemplatesWithFiles>({})
export const filePath = ref<string>(null)
export const fileType = ref<number>(1)
const workspaceIcon = renderIcon(SpaceDashboardFilled, {
  size: 20,
  color: "#5190f1",
})
const folderIcon = renderIcon(FolderOpen, {
  size: 18,
  color: "#ffca28",
})
const documentIcon = renderIcon(DocumentText, {
  size: 18,
})
//格式化文件树数据
export function getFilesTreeHandle(filesList: Array<TemplateFiles>) {
  return filesList.map(item => {
    const currentItem = {
      ...item,
      prefix:
        item.type == 1
          ? workspaceIcon
          : item.type == 2
            ? folderIcon
            : documentIcon,
      isedit:
        item.name === "new_file" || item.name === "new_directory"
          ? true
          : false,
    }
    if (item.children && item.children.length > 0) {
      // Recursion
      currentItem.children = getFilesTreeHandle(item.children)
    } else {
      delete currentItem["children"]
    }

    return currentItem
  })
}

/**查询任务模版**/
export async function getTasksTemplateHandle(tid: string) {
  return new Promise<TaskTemplatesWithFiles>((resolve, reject) => {
    getTasksTemplateApi(tid)
      .then((res: getTaskTemplateResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**更新任务模版元数据files**/
export async function setTasksTemplateFilesHandle(
  tid: string,
  data: UpdateTaskTemplateFiles,
) {
  return new Promise<TaskTemplatesWithFiles>((resolve, reject) => {
    setTasksTemplateFilesApi(tid, data)
      .then((res: getTaskTemplateResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

export const refreshTemplatedata = async (
  data: UpdateTaskTemplateFiles,
  tid: string = templateMetaData.value.id,
) => {
  await setTasksTemplateFilesHandle(tid, data).then(res => {
    templateMetaData.value = res
    if (res.files) {
      templateMetaData.value.files = getFilesTreeHandle(
        templateMetaData.value.files,
      )
    }
  })
}

export function getFilesPathList(data: TemplateFiles[]) {
  const pathList = []
  data.forEach(item => {
    pathList.push(item.path)
    if (item.children && item.children.length > 0) {
      pathList.push(...getFilesPathList(item.children))
    }
  })
  return pathList
}
