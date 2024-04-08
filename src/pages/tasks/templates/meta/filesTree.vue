<template>
  <div class="flex flex-col">
    <n-card :bordered="false">
      <template #header>
        <div class="flex flex-row items-center space-x-2">
          <NText class="text-base">文件信息</NText>
          <n-popover placement="bottom" trigger="hover">
            <template #trigger>
              <n-icon :component="InfoRound" :size="18" class="text-primary" />
            </template>
            <n-card :bordered="false" content-style="padding: 0px;">
              <div class="flex flex-col space-y-2 p-2">
                <span class="text-xs">
                  模版 ID: {{ templateMetaData.id }}
                </span>
                <span class="text-xs">
                  模版名称: {{ templateMetaData.name }}
                </span>
                <span class="text-xs">
                  模版类型: {{ templateMetaData.task_type }}
                </span>
                <span class="text-xs">
                  模版描述: {{ templateMetaData.desc }}
                </span>
                <span class="text-xs">
                  创建时间: {{ timestampFormat(templateMetaData.create_at) }}
                </span>
                <span class="text-xs">
                  更新时间: {{ timestampFormat(templateMetaData.update_at) }}
                </span>
              </div>
            </n-card>
          </n-popover>
        </div>
      </template>
      <template #header-extra>
        <n-button text type="primary" @click="backClickHandle">
          <template #icon>
            <n-icon :component="ArrowBackUp" />
          </template>
          返回
        </n-button>
      </template>
      <div class="flex flex-col space-y-2 p-2">
        <div
          class="flex flex-row justify-end space-x-2 border-0 border-b border-solid border-primary border-opacity-50 p-2"
        >
          <n-button size="tiny" @click="handleShowUploadModal">
            上传文件
          </n-button>
          <n-button v-if="!expandall" size="tiny" @click="expandall = true">
            {{ $t("global.expandall") }}
          </n-button>
          <n-button v-else size="tiny" @click="expandall = false">
            {{ $t("global.collapseall") }}
          </n-button>
        </div>

        <n-tree
          block-line
          show-line
          :draggable="nodeDraggable"
          expand-on-click
          :keyboard="false"
          :default-expand-all="expandall"
          :data="templateMetaData.files"
          key-field="path"
          label-field="name"
          :render-label="renderNodeLabel"
          :selected-keys="selectedKeys"
          :node-props="nodeProps"
          @drop="handleDrop"
        />
        <n-dropdown
          trigger="manual"
          placement="bottom-start"
          :show="showDropdown"
          :options="options"
          :x="xRef"
          :y="yRef"
          @select="handleSelect"
          @clickoutside="handleClickoutside"
        />
      </div>
    </n-card>
    <n-modal
      v-model:show="showUploadModal"
      preset="card"
      :title="t('title.upload')"
      :style="{ 'max-width': '60rem' }"
      :bordered="false"
      :close-on-esc="false"
      :mask-closable="false"
    >
      <uploadFiles
        v-model:file-list="uploadFileList"
        :targetPath="uploadTargetPath"
        @finish="onFinishUpload"
      />
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  NButton,
  NCard,
  NDropdown,
  NIcon,
  NInput,
  NModal,
  NPopover,
  NText,
  NTree,
} from "naive-ui"
import { FormValidationStatus } from "naive-ui/es/form/src/interface"
import { computed, h, nextTick, onMounted, ref, toRaw, unref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

import { UpdateTaskTemplateFiles } from "@/api/tasks/types"
import { UploadFileInfoCustom } from "@/components/Files/type"
import uploadFiles from "@/components/Files/uploadFiles.vue"
import useSettingsStore from "@/store/modules/appSettings"
import { renderIcon, timestampFormat } from "@/utils/tools"
import { CreateFilled, DeleteSweepFilled, InfoRound } from "@vicons/material"
import { ArrowBackUp } from "@vicons/tabler"

import {
  filePath,
  fileType,
  getFilesPathList,
  getFilesTreeHandle,
  getTasksTemplateHandle,
  refreshTemplatedata,
  templateMetaData,
} from "./extend"
import {
  filesTreeDropInfo,
  filesTreeOption,
  filesTreeRenderProps,
} from "./types"

const { t } = useI18n()

const router = useRouter()
const currentRoute = useRoute()
//文件上传路径
const templatePath = computed(() => {
  return useSettingsStore().system_path.tasks_templates_path
})
const filesPathList = computed(() => {
  return getFilesPathList(templateMetaData.value.files)
})
const uploadTargetPath = ref<string>(null)
//控制节点选择
const selectedKeys = ref([])
//控制节点拖拽
const nodeDraggable = ref<boolean>(true)
//当前选中节点
const currentNode = ref<filesTreeOption>()
//更新内容
const updateData = ref<UpdateTaskTemplateFiles>({
  path: null,
  action: null,
  old_path: null,
  type: 1,
})
//控制树是否展开全部
const expandall = ref<boolean>(true)
//控制隐藏下拉菜单
const showDropdown = ref<boolean>(false)
// 文件上传列表
const uploadFileList = ref<UploadFileInfoCustom[]>([])
//控制文件上传模态框
const showUploadModal = ref<boolean>(false)
//下拉菜单选项
const options = [
  {
    label: "创建",
    key: "add",
    icon: renderIcon(CreateFilled),
    children: [
      {
        label: "文件",
        key: "add_file",
      },
      {
        label: "目录",
        key: "add_dir",
      },
    ],
  },
  {
    label: () => t("action.delete"),
    key: "del",
    icon: renderIcon(DeleteSweepFilled),
  },
]
//下拉菜单出现位置
const xRef = ref(0)
const yRef = ref(0)
//控制下拉菜单隐藏事件
const handleClickoutside = () => {
  showDropdown.value = false
}
//下拉菜单回调
const handleSelect = async (key: string) => {
  showDropdown.value = false
  if (updateData.value.type === 3 && key != "del") {
    window.$message.warning("目标路径不是目录")
    return
  }
  switch (key) {
    case "add_file":
      updateData.value.path = `${updateData.value.path}/new_file`
      updateData.value.action = "add"
      updateData.value.type = 3
      break
    case "add_dir":
      updateData.value.path = `${updateData.value.path}/new_directory`
      updateData.value.action = "add"
      updateData.value.type = 2
      break
    case "del":
      updateData.value.action = "del"
      break
    default:
      break
  }
  if (filesPathList.value.includes(updateData.value.path) && key != "del") {
    window.$message.warning("路径已存在")
  }
  if (updateData.value.type === 1 && updateData.value.action === "del") {
    window.$message.error("不能删除workspace")
  } else {
    const data = toRaw(unref(updateData.value))
    await refreshTemplatedata(data)
  }
}
//节点label渲染
const inputRef = ref()
const inputStatus = ref<FormValidationStatus>(null)
const renderNodeLabel = ({ option }: filesTreeRenderProps<filesTreeOption>) => {
  //  console.log(option.key)
  return h(
    "div",
    { class: "node" },
    option.isedit == true && option.type != 1
      ? h(NInput, {
          autofocus: true,
          ref: inputRef,
          size: "small",
          status: inputStatus.value,
          value: option.name,
          onUpdateValue: v => {
            option.name = v
          },
          onKeyup: async e => {
            if (e.key != "Enter") return
            inputRef.value.blur()
            // 阻止 事件冒泡
            e.stopPropagation()
            // 阻止该元素默认的 keyup 事件
            e.preventDefault()
          },

          onBlur: async () => {
            if (option.name == currentNode.value.name) {
              option.isedit = false
            } else {
              if (option.name) {
                currentNode.value.name = option.name
                if (updateData.value.action == "rename") {
                  updateData.value.old_path = option.path
                  updateData.value.path = `${option.parent}/${option.name}`
                }
                const data = toRaw(unref(updateData.value))
                await refreshTemplatedata(data)
                option.isedit = false
              } else {
                inputStatus.value = "warning"
              }
            }

            nodeDraggable.value = true
          },
        })
      : option.name,
  )
}
const updateNodeData = (option: filesTreeOption) => {
  currentNode.value = { ...toRaw(option) }
  updateData.value.type = option.type
  updateData.value.path = option.path
  selectedKeys.value = [option.id]
}
//节点事件
const nodeProps = ({ option }: { option: filesTreeOption }) => {
  return {
    onClick() {
      if (option.type != 3) {
        uploadTargetPath.value = `${templatePath.value}/${option.path}`
      }
      updateNodeData(option)
      filePath.value = `${templatePath.value}/${option.path}`
      fileType.value = option.type
    },
    ondblclick() {
      updateData.value.action = "rename"
      updateNodeData(option)
      //双击事件
      option.isedit = true
      nodeDraggable.value = false
      nextTick(() => {
        inputRef.value.focus()
      })
    },
    onContextmenu(e: MouseEvent): void {
      if (option.type != 3) {
        uploadTargetPath.value = `${templatePath.value}/${option.path}`
      }
      updateNodeData(option)
      showDropdown.value = true
      xRef.value = e.clientX
      yRef.value = e.clientY
      e.preventDefault()
    },
  }
}
//拖拽事件
async function handleDrop({
  node,
  dragNode,
}: filesTreeDropInfo<filesTreeOption>) {
  if (node.type == 3) {
    window.$message.warning("目标不是目录")
    return
  }
  const data = {
    path: `${node.path}/${dragNode.name}`,
    action: "move",
    old_path: dragNode.path,
    type: node.type,
  }
  await refreshTemplatedata(data)
}
const backClickHandle = () => {
  router.back()
}

const handleShowUploadModal = () => {
  if (!uploadTargetPath.value) {
    uploadTargetPath.value = `${templatePath.value}/${templateMetaData.value.id}`
  }
  showUploadModal.value = true
}
//上传完成回调
const uploadCount = ref(0)
const onFinishUpload = async (file: UploadFileInfoCustom) => {
  uploadCount.value++
  if (uploadCount.value == uploadFileList.value.length) {
    uploadCount.value = 0
    await getTasksTemplateHandle(currentRoute.query.id as string).then(res => {
      templateMetaData.value = res
      if (res.files) {
        templateMetaData.value.files = getFilesTreeHandle(
          templateMetaData.value.files,
        )
      }
    })
  }
}
onMounted(async () => {
  await getTasksTemplateHandle(currentRoute.query.id as string).then(res => {
    templateMetaData.value = res
    if (res.files) {
      templateMetaData.value.files = getFilesTreeHandle(
        templateMetaData.value.files,
      )
    }
  })
})
</script>
