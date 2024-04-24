<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :style="{ 'max-width': '70rem' }"
    :bordered="true"
    :segmented="{
      action: true,
    }"
    @after-leave="modalAfterLeaveHandel"
  >
    <template #header>
      <div class="flex flex-row">
        <span class="flex-none">
          <n-text class="text-primary">{{ title }}</n-text>
          <n-text depth="3" class="ml-2 text-xs">{{ titleDesc }}</n-text>
        </span>
        <slot name="header" />
      </div>
    </template>
    <template #header-extra>
      <n-button
        type="info"
        size="tiny"
        :disabled="otherPaneDisable"
        @click="handleResetConfig"
      >
        重置表单
      </n-button>
    </template>
    <n-tabs
      v-if="modalStep == 1"
      type="line"
      v-model:value="showTabPane"
      animated
      justify-content="space-evenly"
      @before-leave="handleTabsBeforeLeave"
    >
      <n-tab-pane
        :disabled="otherPaneDisable && showTabPane != 'Ad-Hoc'"
        name="Ad-Hoc"
        tab="Ad-Hoc"
        display-directive="if"
      >
      <n-scrollbar style="max-height: 550px; ">
          <div class="flex flex-auto">
            <taskRunForm
              v-model:form-ref="formRef"
              v-model:task-config="taskConfig"
              task-type="Ad-Hoc"
            />
          </div>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane
        :disabled="otherPaneDisable && showTabPane != 'Playbook'"
        name="Playbook"
        tab="Playbook"
        display-directive="if"
      >
      <n-scrollbar style="max-height: 550px;">
          <div class="flex flex-auto">
            <taskRunForm
              v-model:form-ref="formRef"
              v-model:task-config="taskConfig"
              task-type="Playbook"
            />
          </div>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <n-tabs
      v-if="modalStep == 2"
      type="line"
      animated
      v-model:value="showScheudleTabPane"
      justify-content="space-evenly"
    >
      <n-tab-pane name="interval" tab="间隔任务(interval)" display-directive="if">
          <scheduledFrom
            v-model:form-ref="formRef"
            v-model:scheduled-config="scheduledConfig"
            scheduled-type="interval"
          />
      </n-tab-pane>
      <n-tab-pane name="crontab" tab="定时任务(crontab)" display-directive="if">
          <scheduledFrom
            v-model:form-ref="formRef"
            v-model:scheduled-config="scheduledConfig"
            scheduled-type="crontab"
          />
        </n-tab-pane
    ></n-tabs>
    <template #action>
      <div class="flex flex-1 flex-row items-center justify-end space-x-4">
        <div
          class="flex flex-none flex-row space-x-2"
          v-if="checkResult.status && modalStep == 1"
        >
          <span>
            <NPopover trigger="hover" placement="top" :max-width="500">
              <template #trigger>
                <NIcon
                  v-if="checkResult.status == 'successful'"
                  :size="20"
                  :component="CommentCheckmark20Filled"
                  :class="checkResult.rc != 0 ? 'text-warning' : 'text-success'"
                />
                <NIcon
                  v-else
                  :component="CommentError20Filled"
                  :size="20"
                  class="text-error"
                />
              </template>
              <n-scrollbar style="max-height: 600px">
                <n-button
                  v-if="checkResult.stdout"
                  text
                  size="tiny"
                  @click="onCopy(checkResult.stdout)"
                >
                  <template #icon>
                    <n-icon :size="14" class="text-primary">
                      <Copy />
                    </n-icon>
                  </template>
                </n-button>
                <pre class="checkStdout" v-html="checkStdout" />
              </n-scrollbar>
            </NPopover>
          </span>
          <span> {{ checkResult.task_type }} : {{ checkResult.rc }} </span>
        </div>
        <n-button
          v-if="modalStep == 1"
          type="warning"
          size="small"
          :loading="checkLoading"
          :disabled="checkLoading"
          @click="handleConfigCheck"
        >
          配置测试
        </n-button>
        <slot name="action"></slot>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { AnsiUp } from "ansi_up"
import {
  FormInst,
  NButton,
  NIcon,
  NModal,
  NPopover,
  NScrollbar,
  NTabPane,
  NTabs,
  NText,
} from "naive-ui"
import { computed, PropType, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"

import { taskConfigCheckResult, TasksRunConfig } from "@/api/tasks/execution"
import {
  scheduledConfig, ScheduledType
} from "@/api/tasks/scheduled"
import { onCopy } from "@/utils/tools"
import { CommentCheckmark20Filled, CommentError20Filled } from "@vicons/fluent"
import { Copy } from "@vicons/ionicons5"

import { baseProps, defaultScheduledConfig, defaultTaskConfig, taskConfigCheckHandle } from "./extend"
import scheduledFrom from "./scheduledForm.vue"
import taskRunForm from "./taskRunForm.vue"

const props = defineProps({
  ...baseProps,
})
const { t } = useI18n()
const showTabPane = defineModel("showTabPane", {
  type: String as PropType<"Ad-Hoc" | "Playbook">,
  default: "Ad-Hoc",
})
const showScheudleTabPane = defineModel("showScheudleTabPane", {
  type: String as PropType<ScheduledType>,
  default: "interval",
})
const showModal = defineModel("showModal", {
  type: Boolean,
  required: true,
})
const formRef = defineModel("formRef", {
  type: Object as PropType<FormInst>,
})

const taskConfig = defineModel("taskConfig", {
  type: Object as PropType<TasksRunConfig>,
  required: true,
  default: () => defaultTaskConfig,
})
const scheduledConfig = defineModel("scheduledConfig", {
  type: Object as PropType<scheduledConfig>,
  default: () => {},
})
const handleResetConfig = () => {
  if (props.modalStep == 1) {
    const taskType = taskConfig.value.task_type
    taskConfig.value = { ...defaultTaskConfig }
    taskConfig.value.task_type = taskType
  }
  if (props.modalStep == 2) { 
    const scheduledType = scheduledConfig.value.types
    scheduledConfig.value = { ...defaultScheduledConfig }
    scheduledConfig.value.types = scheduledType
  }
}
const handleTabsBeforeLeave = () => {
  return new Promise<boolean>(resolve => {
    window.$dialog.warning({
      title: t("title.warning"),
      content: `表单内容将被重置`,
      positiveText: t("action.confirm"),
      negativeText: t("action.cancel"),
      onPositiveClick: () => {
        taskConfig.value = { ...defaultTaskConfig }
        resolve(true)
      },
      onNegativeClick: () => {
        resolve(false)
      },
    })
  })
}
const checkLoading = ref(false)
const checkResult = reactive<taskConfigCheckResult>({})
const handleConfigCheck = () => {
  formRef.value.validate(async error => {
    if (!error) {
      checkLoading.value = true
      await taskConfigCheckHandle(taskConfig.value)
        .then(res => {
          checkResult.rc = res.rc
          checkResult.status = res.status
          checkResult.stdout = res.stdout
          checkResult.task_type = res.task_type
        })
        .finally(() => {
          checkLoading.value = false
        })
    }
  })
}
const checkStdout = computed(() => {
  const ansi_up = new AnsiUp()

  const stdoutHtml = ansi_up.ansi_to_html(checkResult.stdout)
  return stdoutHtml
})
const modalAfterLeaveHandel = () => {
  checkResult.status = null
  // taskConfig.value = { ...defaultTaskConfig }
  // scheduledConfig.value = { ...defaultScheduledConfig }
}
</script>

<style scoped>
.checkStdout {
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* InternetExplorer5.5+ */
  white-space: -moz-pre-wrap; /* Mozilla,since1999 */
  white-space: -pre-wrap; /* Opera4-6 */
  white-space: -o-pre-wrap; /* Opera7 */
}
</style>
