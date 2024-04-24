<template>
  <div class="default-bg flex flex-1 flex-row">
    <div class="max-w-1/5 flex-none p-4">
      <n-descriptions
        bordered
        :column="1"
        label-placement="left"
        label-align="left"
      >
        <template #header>
          <div class="flex flex-row">
            <div class="flex flex-none items-center justify-start">
              <n-button text type="primary" @click="backClickHandle">
                <template #icon>
                  <n-icon :component="ArrowBackUp" />
                </template>
                返回
              </n-button>
            </div>
            <div class="flex flex-1 items-center justify-end">
              <n-select
                v-if="selectHistoryOptions.length > 0"
                v-model:value="selectHistoryValue"
                size="small"
                :options="selectHistoryOptions"
                class="w-48"
                :render-label="renderLabel"
                label-field="create_at"
                value-field="id"
                @update:value="handleUpdateValue"
              />
            </div>
          </div>
        </template>
        <n-descriptions-item :span="1" label="任务ID">
          <n-ellipsis
            style="max-width: 180px"
            line-clamp="2"
            expand-trigger="click"
            :tooltip="{ width: 500 }"
          >
            {{ taskDetail.task_id }}
          </n-ellipsis>
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="任务类型">
          <div
            :class="`badge  badge-sm text-white dark:text-black ${getTaskTypeBadgeClass(
              taskDetail.task_type,
            )}`"
          >
            {{ taskDetail.task_type }}
          </div>
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="任务名称">
          {{ taskDetail.task_name }}
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="任务状态">
          <div class="space-x-2">
            <span
              :class="
                ['successful'].includes(taskDetail.task_status)
                  ? 'text-success'
                  : ['failed', 'timeout'].includes(taskDetail.task_status)
                    ? 'text-error'
                    : 'text-info'
              "
            >
              {{ taskDetail.task_status }} => {{ taskDetail.task_rc }}
            </span>
            <span v-if="showSpin">
              <n-button
                type="primary"
                size="small"
                @click="revokeClickHandle"
              >
                取消
              </n-button>
            </span>
            <span>
              <n-spin :size="15" v-show="showSpin" />
            </span>
          </div>
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="开始时间">
          {{ timestampFormat(taskDetail.task_start_time) }}
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="结束时间">
          {{ timestampFormat(taskDetail.task_end_time) }}
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="持续时间">
          {{ taskDetail.task_duration }}s
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="关联模版">
          <n-ellipsis
            style="max-width: 180px"
            line-clamp="2"
            expand-trigger="click"
            :tooltip="{ width: 500 }"
          >
            <router-link
              :to="{
                name: 'tasks_templates_meta',
                query: { id: taskDetail.task_template_id },
              }"
            >
              <n-button type="primary" text size="small">
                {{ taskDetail.task_template_name }}</n-button
              >
            </router-link>
          </n-ellipsis>
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="模版ID">
          <n-ellipsis
            style="max-width: 180px"
            line-clamp="2"
            expand-trigger="click"
            :tooltip="{ width: 500 }"
          >
            {{ taskDetail.task_template_id }}
          </n-ellipsis>
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="执行用户">
          {{ taskDetail.exec_user }}
        </n-descriptions-item>
        <n-descriptions-item :span="1" label="执行节点">
          {{ taskDetail.exec_worker }}
        </n-descriptions-item>
      </n-descriptions>
    </div>
    <n-divider vertical style="height: 100%" />
    <div class="flex-1">
      <n-card :bordered="false" title="任务详情" style="margin-bottom: 16px">
        <n-tabs type="line" animated>
          <n-tab-pane name="sdtout" display-directive="if" tab="任务输出">
            <div class="default-stdout-bg rounded-md p-4">
              <div class="flex h-2 flex-row justify-end">
                <n-spin :size="20" v-show="showSpin" />
              </div>
              <n-scrollbar style="max-height: 600px">
                <pre
                  class="stdoutContent"
                  style="min-height: 600px"
                  v-html="taskStdoutHtml"
                />
              </n-scrollbar>
            </div>
          </n-tab-pane>
          <n-tab-pane name="kwargs" display-directive="if" tab="任务参数">
            <codeEditor
              v-model:code="taskKwargs"
              code-language="json"
              :loading="loadingRef"
              min-height="500px"
              max-height="650px"
              :show-action="false"
              :show-state="false"
            ></codeEditor>
          </n-tab-pane>
          <n-tab-pane
            v-if="taskDetail.task_error"
            name="error"
            display-directive="if"
            tab="错误信息"
          >
            <codeEditor
              v-model:code="taskDetail.task_error"
              code-language="python"
              :loading="loadingRef"
              min-height="500px"
              max-height="650px"
              :show-action="false"
              :show-state="false"
            ></codeEditor>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AnsiUp } from "ansi_up"
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NEllipsis,
  NIcon,
  NScrollbar,
  NSelect,
  NSpin,
  NTabPane,
  NTabs,
  SelectOption,
} from "naive-ui"
import { computed, h, onBeforeUnmount, onMounted, ref, VNodeChild } from "vue"
import { useRoute, useRouter } from "vue-router"

import codeEditor from "@components/Editor/index.vue"

import { TasksHistory } from "@/api/tasks/execution"
import { timestampFormat } from "@/utils/tools"
import { AdjustRound } from "@vicons/material"
import { ArrowBackUp } from "@vicons/tabler"

import { getTaskTypeBadgeClass } from "../../templates/extend"
import { queryTasksHistoryHandle, revokeTasksHistoryHandle } from "../extend"
import { getTasksHistoryHandle, readTaskStdoutHandle } from "./extend"

const router = useRouter()
const currentRoute = useRoute()
const showSpin = ref(true)
const taskDetail = ref<TasksHistory>({})
const backClickHandle = () => {
  router.back()
}

const selectHistoryValue = ref(0)
const selectHistoryOptions = ref([])
const handleUpdateValue = async () => {
  await refreshPage(selectHistoryValue.value)
}
const revokeClickHandle = async () => {
  await revokeTasksHistoryHandle(taskDetail.value.task_id).then(() => {
    showSpin.value = false
  })
}
const renderLabel = (option: SelectOption): VNodeChild => {
  return [
    h(
      "div",
      {
        class: "flex flex-row items-center justify-center space-x-2",
      },
      [
        h(
          "span",
          { class: "text-xs" },
          { default: () => timestampFormat(option.create_at) },
        ),
        h(NIcon, {
          class:
            option.task_status == "successful"
              ? " text-success"
              : ["running", "starting", "canceled"].includes(
                    option.task_status as string,
                  )
                ? "text-warning"
                : "text-error",
          component: AdjustRound,
          size: 14,
        }),
      ],
    ),
  ]
}

const taskPrivatePath = computed(() => {
  return taskDetail.value.task_kwargs.private_data_dir
})
const loadingRef = ref(false)
const taskKwargs = computed(() => {
  return JSON.stringify(taskDetail.value.task_kwargs, null, 2)
})
const taskStdout = ref<string>("")
const taskStdoutHtml = computed(() => {
  const ansi_up = new AnsiUp()

  const stdoutHtml = ansi_up.ansi_to_html(taskStdout.value)
  return stdoutHtml
})
const taskRunComplete = ref(false)
const refreshPage = async (id: number) => {
  await getTasksHistoryHandle(id)
    .then(async res => {
      taskDetail.value = res
      if (!taskRunComplete.value && res.task_rc != -1) {
        await readTaskStdoutHandle({
          task_id: res.task_id,
          private_dir: taskPrivatePath.value,
        }).then(res => {
          taskStdout.value = res
        })
      }
      if (taskRunComplete.value) {
        clearInterval(timer.value)
        timer.value = null
        showSpin.value = false
      }
      if (!["running", "starting"].includes(res.task_status)) {
        taskRunComplete.value = true
      }
    })
    .catch(() => {
      clearInterval(timer.value)
      timer.value = null
      showSpin.value = false
    })
}
const timer = ref(null)
onMounted(async () => {
  taskRunComplete.value = false
  if (currentRoute.query.name) {
    queryTasksHistoryHandle({
      task_name: currentRoute.query.name as string,
    }).then(async res => {
      selectHistoryOptions.value = res.result
      selectHistoryValue.value = res.result[0].id
      await refreshPage(selectHistoryValue.value)
    })
  } else {
    selectHistoryValue.value = parseInt(currentRoute.query.id as string)
    await refreshPage(selectHistoryValue.value)
  }

  if (["running", "starting"].includes(taskDetail.value.task_status)) {
    timer.value = setInterval(() => {
      showSpin.value = true
      refreshPage(selectHistoryValue.value)
    }, 2000)
  } else {
    showSpin.value = false
  }
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
  showSpin.value = false
})
</script>

<style scoped>
.stdoutContent {
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* InternetExplorer5.5+ */
  white-space: -moz-pre-wrap; /* Mozilla,since1999 */
  white-space: -pre-wrap; /* Opera4-6 */
  white-space: -o-pre-wrap; /* Opera7 */
}
</style>
