<template>
  <n-upload
    ref="uploadRef"
    :accept="accept"
    multiple
    directory-dnd
    :show-file-list="false"
    v-model:file-list="fileList"
    :directory="uploadDirectory"
    :default-upload="false"
    :custom-request="handleUpload"
    @update:file-list="handleFileListChange"
    @before-upload="onBeforeUpload"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text style="font-size: 16px"> 拖动文件或文件夹到该区域来上传 </n-text>
      <n-p depth="2" style="margin: 10px 0 0 0">
        支持文件类型：{{ accept ? accept.split(",").join(" | ") : "*" }}
      </n-p>
    </n-upload-dragger>
  </n-upload>

  <NCard header-style="padding: 10px" content-style="padding: 10px;">
    <template #header>
      <div class="flex flex-row items-center space-x-4">
        <n-checkbox v-model:checked="uploadDirectory"> 选择目录 </n-checkbox>
        <n-button
          size="small"
          :disabled="!fileList.length"
          @click="handleClearClick"
        >
          清空列表
        </n-button>
        <n-text depth="3" class="text-xs">
          文件总数: {{ fileList.length }}
        </n-text>
        <n-text depth="3" class="text-xs">
          总大小: {{ bytesToSize(totalFileSize) }}</n-text
        >
      </div>
    </template>
    <template #header-extra>
      <div class="flex flex-row items-center space-x-4">
        <n-button
          size="small"
          :disabled="!fileList.length || !submitDisable"
          @click="handleRefreshSubmitClick"
        >
          全部重传
        </n-button>
        <n-button
          size="small"
          :disabled="!fileList.length || submitDisable"
          @click="handleSubmitClick"
        >
          开始上传
        </n-button>
      </div>
    </template>
    <n-scrollbar style="max-height: 500px">
      <n-table
        single-column
        size="small"
        :bordered="false"
        :single-line="true"
        :bottom-bordered="false"
      >
        <thead>
          <tr>
            <th>文件名</th>
            <th>路径</th>
            <th>大小</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in fileList">
            <td>{{ item.name }}</td>
            <td>{{ item.fullPath.replace(item.name, "") }}</td>
            <td>{{ bytesToSize(item.file.size) }}</td>
            <td>
              <div v-if="item.status == 'uploading'">
                <n-progress
                  type="line"
                  :height="10"
                  :percentage="item.percentage"
                  :indicator-placement="'inside'"
                  processing
                />
              </div>
              <div v-else class="flex flex-row items-center">
                <span class="mr-2">
                  {{
                    item.status === "pending"
                      ? "等待上传"
                      : item.status === "error"
                        ? "上传失败"
                        : " 上传成功"
                  }}
                </span>
                <tip
                  v-if="item.status == 'error'"
                  :value="item.error"
                  placement="top-center"
                >
                  <n-icon :size="16" class="text-error">
                    <ExclamationCircleFilled />
                  </n-icon>
                </tip>
                <n-icon
                  v-if="item.status == 'finished'"
                  :size="16"
                  class="text-success"
                >
                  <CloudDone />
                </n-icon>
              </div>
            </td>
            <td>
              <div class="flex flex-row space-x-4">
                <tip value="重传" placement="top-center">
                  <n-button
                    size="small"
                    text
                    :disabled="!item.refresh"
                    @click="handleRefreshClick(item)"
                  >
                    <n-icon :size="16">
                      <Refresh />
                    </n-icon>
                  </n-button>
                </tip>
                <tip value="移除" placement="top-center">
                  <n-button
                    size="small"
                    text
                    @click="handleRemoveClick(item )"
                  >
                    <n-icon :size="16">
                      <DeleteFilled />
                    </n-icon>
                  </n-button>
                </tip>
              </div>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-scrollbar>
  </NCard>
</template>

<script lang="ts" setup>
import {
  NButton,
  NCard,
  NCheckbox,
  NIcon,
  NP,
  NProgress,
  NScrollbar,
  NTable,
  NText,
  NUpload,
  NUploadDragger,
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst,
} from "naive-ui"
import { computed, PropType, ref } from "vue"

import { uploadFileFrom } from "@/api/files/types"
import useSettingsStore from "@/store/modules/appSettings"
import { bytesToSize } from "@/utils/tools"
import { DeleteFilled, ExclamationCircleFilled } from "@vicons/antd"
import {
  ArchiveOutline as ArchiveIcon,
  CloudDone,
  Refresh,
} from "@vicons/ionicons5"

import { BaseProps } from "./BaseProps"
import {
  createChunks,
  createHash,
  mergeFileHandle,
  uploadFileHandle,
  verifyFileHandle,
} from "./filesTools"
import { UploadFileInfoCustom } from "./type"

const props = defineProps({
  ...BaseProps,
})
const fileList = defineModel("fileList", {
  type: Array as PropType<UploadFileInfoCustom[]>,
  default: [],
})

const uploadDirectory = ref<boolean>(false)
const submitDisable = ref<boolean>(false)
const totalFileSize = computed(() => {
  return fileList.value.reduce((total, item) => {
    return total + item.file.size
  }, 0)
})
const targetPath = computed(() => {
  let path = props.targetPath
  if (!path) {
    path = useSettingsStore().system_path.upload_temp_path
  }
  return path.endsWith("/")
    ? path.substring(0, props.targetPath.length - 1)
    : path
})
const uploadRef = ref<UploadInst | null>(null)

const handleFileListChange = (fileListInfo: UploadFileInfoCustom[]) => {
  fileList.value = fileListInfo.filter(
    item => !props.ingoreFiles.includes(item.name),
  )
  console.log(fileListInfo)
}
const handleRemoveClick = async (file: UploadFileInfoCustom ) => {
  const index = fileList.value.findIndex(item => item.id == file.id)
  console.log(index)
  fileList.value.splice(index, 1)
}

const handleSubmitClick = () => {
  uploadRef.value?.submit()
  submitDisable.value = true
}
const handleRefreshSubmitClick = () => {
  fileList.value.forEach(item => {
    item.status = "pending"
  })
  handleSubmitClick()
}
const handleClearClick = () => {
  fileList.value = []
}

// 分片上传
const uploadChunks = async (
  chunks: Array<Blob>,
  existsChunks: string[],
  file_index: number,
  onFinish?: Function,
) => {
  fileList.value[file_index].status = "uploading"
  const data = chunks.map((chunk, index) => {
    return {
      fileHash: fileList.value[file_index].hash,
      chunkHash: fileList.value[file_index].hash + "_" + index,
      chunk: chunk,
    }
  })

  const formDatas = data
    .filter(item => !existsChunks.includes(item.chunkHash))
    .map(item => {
      const formData: uploadFileFrom = {
        file_hash: item.fileHash,
        chunk_hash: item.chunkHash,
        chunk: item.chunk,
      }
      return formData
    })

  const max = 6 // 最大并行请求数
  const taskPool: any = [] // 请求队列
  let dataIndex = 0

  while (dataIndex < formDatas.length) {
    const task = uploadFileHandle(formDatas[dataIndex])
    task.then(() => {
      // 执行完后把当前任务从任务队列中删除
      taskPool.splice(taskPool.findIndex((item: any) => item === task))
    })
    taskPool.push(task)
    if (taskPool.length === max) {
      await Promise.race(taskPool)
    }
    fileList.value[file_index].percentage = Math.floor(
      (dataIndex / formDatas.length) * 100,
    )
    dataIndex++
  }

  await Promise.all(taskPool)
    .then(async () => {
      const target_path =
        targetPath.value +
        fileList.value[file_index].fullPath.replace(
          fileList.value[file_index].name,
          "",
        )
      // 所有分片上传完成后，通知服务器合并
      await mergeFileHandle({
        file_name: fileList.value[file_index].name,
        file_hash: fileList.value[file_index].hash,
        target_path: target_path,
      })
        .then(() => {
          fileList.value[file_index].status = "finished"
          onFinish(fileList.value[file_index])
        })
        .catch(error => {
          fileList.value[file_index].status = "error"
          fileList.value[file_index].error = error.response.data.message
        })
        .finally(() => {
          fileList.value[file_index].refresh = true
        })
    })
    .catch(error => {
      fileList.value[file_index].status = "error"
      fileList.value[file_index].error = error
    })
}

const handleUpload = async ({ file }: UploadCustomRequestOptions) => {
  const index = fileList.value.findIndex(v => v.id === file.id)
  fileList.value[index].error = null
  // 文件分片
  const chunks = createChunks(fileList.value[index].file, props.chunkSize)
  // 计算hash值
  const hash = await createHash(chunks, props.chunkSize)
  fileList.value[index].hash = hash as string
  // 校验是否需要上传
  const existsChunks = await verifyFileHandle({ file_hash: hash })
  // 分片上传
  await uploadChunks(chunks, existsChunks.chunks, index, props.onFinish)
}

const handleRefreshClick = async (item: UploadFileInfoCustom) => {
  item.error = null
  const index = fileList.value.findIndex(v => v.id === item.id)
  // 文件分片
  const chunks = createChunks(item.file, props.chunkSize)
  // 计算hash值
  const hash = await createHash(chunks, props.chunkSize)
  fileList.value[index].hash = hash as string
  // 分片上传
  await uploadChunks(chunks, [], index, props.onFinish)
}
</script>
