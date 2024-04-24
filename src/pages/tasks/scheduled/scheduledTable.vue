<template>
  <BaseTables
    remote
    v-model:columns="tableColumns"
    :data="scheduledList"
    :refresData="handleRefreshScheduledList"
    :loading="loadingRef"
    :pagination="paginationReactive"
    :bordered="false"
    :style="{ height: '500px' }"
    flex-height
  >
    <template v-slot:tableHeader>
      <div class="mb-2 mt-2 flex flex-row space-x-4">
        <span>
          <n-input
            placeholder="名称"
            size="small"
            v-model:value="searchText"
            @keyup.enter="handleSearch"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search20Regular" />
            </template>
            <template #suffix>
              <NButton text @click="handleSearch">搜索</NButton>
            </template>
          </n-input>
        </span>
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="self-center rounded-md border-2 border-dashed border-primary/40 pl-4 pr-4 text-xs"
            >
              + 筛选
            </div>
          </template>
          <div class="flex flex-col space-y-2 p-2">
            <span class="text-xs">
              任务状态：
              <n-switch
                size="small"
                :round="false"
                v-model:value="qureyParams.enabled"
              >
                <template #checked> 状态启用 </template>
                <template #unchecked>状态禁用 </template>
              </n-switch>
            </span>
            <span class="text-xs">
              单次执行：
              <n-switch
                size="small"
                :round="false"
                v-model:value="qureyParams.one_off"
              >
                <template #checked> 单次执行 </template>
                <template #unchecked> 重复执行 </template>
              </n-switch>
            </span>
            <span class="flex flex-row items-center text-xs">
              <span> 任务类型： </span>
              <span class="w-28">
                <n-select
                  size="tiny"
                  :options="taskTypeOptions"
                  v-model:value="qureyParams.task_type"
                  clearable
                />
              </span>
            </span>
          </div>
        </n-popover>
      </div>
    </template>
    <template v-slot:tableHeaderAction>
      <n-button
        type="primary"
        size="small"
        class="ml-2 mr-2"
        @click="handleAddSchedule"
      >
        <template #icon>
          <n-icon>
            <EventSchedule />
          </n-icon>
        </template>
        新建计划
      </n-button>
    </template>
  </BaseTables>
  <config-modal
    title="计划任务"
    title-desc="创建重复运行的计划任务"
    v-model:show-modal="showModal"
    v-model:task-config="taskConfig"
    v-model:form-ref="formRef"
    v-model:show-tab-pane="showTabPane"
    v-model:show-scheudle-tab-pane="showScheudleTabPane"
    v-model:scheduled-config="scheduledConfig"
    :other-pane-disable="otherPaneDisable"
    :modal-step="modalStep"
  >
    <template #action>
      <n-button
        v-if="modalStep == 2"
        type="primary"
        size="small"
        @click="handleBackClick"
      >
        上一步
      </n-button>
      <n-button
        v-if="modalStep == 1"
        type="primary"
        size="small"
        @click="handleNextClick"
      >
        下一步
      </n-button>
      <n-button
        v-if="modalStep == 2"
        type="primary"
        size="small"
        @click="handleSaveClick"
      >
        保存
      </n-button>
    </template>
  </config-modal>
  <n-modal
    v-model:show="showSystemModal"
    preset="card"
    :style="{ 'max-width': '70rem' }"
    :bordered="true"
    :segmented="{
      action: true,
    }"
  ><scheduledFrom     v-model:form-ref="formRef" :scheduled-type="checkSystemScheduledType" v-model:scheduled-config="scheduledConfig">
    <template #form>
      <n-form-item-gi :span="12" label="任务参数">
          <n-input type="textarea" v-model:value="systemTaskKwargs" clearable /> 
        </n-form-item-gi>
    </template>
    <template #bottom>
      <div class="flex flex-1 flex-row justify-end">
    <NButton type="primary" size="small" @click="handelSystemModalSave">保存</NButton>
  </div>
    </template>

  </scheduledFrom></n-modal>
</template>

<script lang="ts" setup>
import {
  FormInst,
  NFormItemGi,
  NButton,
  NIcon,
  NInput,
  NPopover,
  NSelect,
  NModal,
  NSwitch
} from "naive-ui"
import { onMounted, PropType, ref, toRaw, unref,computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import BaseTables from "@components/Tables/BaseTables.vue"

import { TasksRunConfig } from "@/api/tasks/execution"
import { scheduledConfig, ScheduledType } from "@/api/tasks/scheduled"
import { EventSchedule } from "@vicons/carbon"
import { Search20Regular } from "@vicons/fluent"

import {
  defaultScheduledConfig,
  defaultTaskConfig,
} from "../execution/runconfig/extend"
import configModal from "../execution/runconfig/index.vue"
import {
  addScheduledHandle,
  createColumns,
  delScheduledHandle,
  handleRefreshScheduledList,
  loadingRef,
  paginationReactive,
  PeriodicTaskToScheduledConfig,
  qureyParams,
  scheduledList,
  setScheduledHandle,
  setSysScheduledHandle,
} from "./extend"
import scheduledFrom from "../execution/runconfig/scheduledForm.vue"
const props = defineProps({
  scheduledType: {
    type: String as PropType<ScheduledType>,
    default: "interval",
  },
})
const { t } = useI18n()
const formRef = ref<FormInst>()
const showSystemModal = ref<boolean>(false)
const checkSystemScheduledType = computed(() => {
  if (scheduledConfig.value.types != "system") { 
    return scheduledConfig.value.types
  }
  if (scheduledConfig.value.every) {
    return "interval"
  } else { 
    return "crontab"
  }
})
const systemTaskKwargs = ref<any>(null)
const taskConfig = ref<TasksRunConfig>({ ...defaultTaskConfig })
const scheduledConfig = ref<scheduledConfig>({ ...defaultScheduledConfig })
const resetConfig = () => {
  taskConfig.value = { ...defaultTaskConfig }
  scheduledConfig.value = { ...defaultScheduledConfig }
  modalStep.value = 1
}
const showModal = ref(false)
const modalStep = ref(1)
const searchText = ref(null)
const handleSearch = () => {
  qureyParams.value.name = searchText.value
  handleRefreshScheduledList(qureyParams.value)
}
const handleNextClick = () => {
  formRef.value.validate(error => {
    if (!error) {
      modalStep.value++
    }
  })
}
const handleBackClick = () => {
  modalStep.value--
}

const handleSaveClick = () => {
  formRef.value.validate(async error => {
    if (!error) {
      const data = {
        scheduled_config: toRaw(unref(scheduledConfig.value)),
        task_run_config: toRaw(unref(taskConfig.value)),
      }
      if (!scheduledConfig.value.id) {
        await addScheduledHandle(data).then(() => {
          handleRefreshScheduledList(qureyParams.value)
          resetConfig()
          showModal.value = false
        })
      } else {
        if (currentScheudTab.value != showScheudleTabPane.value) {
          window.$dialog.warning({
            title: t("title.warning"),
            content: `检测到将任务类型由${currentScheudTab.value}变更为${showScheudleTabPane.value}，请确认是否继续. 更新后请前往${showScheudleTabPane.value}任务页面查看`,
            positiveText: t("action.confirm"),
            negativeText: t("action.cancel"),
            onPositiveClick: async () => {
              await setScheduledHandle(scheduledConfig.value.id, data).then(
                () => {
                  handleRefreshScheduledList(qureyParams.value)
                  resetConfig()
                  showModal.value = false
                },
              )
            },
          })
        } else {
          await setScheduledHandle(scheduledConfig.value.id, data).then(() => {
            handleRefreshScheduledList(qureyParams.value)
            resetConfig()
            showModal.value = false
          })
        }
      }
    }
  })
}
/**控制标签页显示 */
const router = useRouter()
const showTabPane = ref("Ad-Hoc")
const showScheudleTabPane = ref("interval")
const currentScheudTab = ref("interval")
const otherPaneDisable = ref(false)
const taskTypeOptions = [
  {
    label: "Playbook",
    value: "Playbook",
  },
  {
    label: "Ad-Hoc",
    value: "Ad-Hoc",
  },
  {
    label: "Script",
    value: "Script",
  },
  {
    label: "Files",
    value: "Files",
  },
  {
    label: "SysApi",
    value: "SysApi",
  },
]
//表格列生成
const tableColumns = ref(
  createColumns({
    delScheduled(rowData) {
      window.$dialog.warning({
        title: t("title.warning"),
        content: `删除计划任务 ${rowData.name}`,
        positiveText: t("action.confirm"),
        negativeText: t("action.cancel"),
        onPositiveClick: () => {
          delScheduledHandle(rowData.id).then(() => {
            handleRefreshScheduledList(qureyParams.value)
          })
        },
      })
    },
    setScheduled(rowData) {
      if (rowData.task_type != "SysApi") {
        showTabPane.value = rowData.task_type
      currentScheudTab.value = rowData.types
      showScheudleTabPane.value = rowData.types
      taskConfig.value = rowData.kwargs
      scheduledConfig.value = PeriodicTaskToScheduledConfig(rowData)
      showModal.value = true
      } else {
        systemTaskKwargs.value = JSON.stringify(rowData.kwargs)
        scheduledConfig.value = PeriodicTaskToScheduledConfig(rowData)
        showSystemModal.value = true
       }

    },
    getHistory(rowData) {
      router.push({
        name: "tasks_execution_details",
        query: { name: rowData.name },
      })
    },
  }),
)
const handelSystemModalSave = () => { 
  formRef.value.validate(async error => { 
    if (!error) { 
      scheduledConfig.value.types = "system"
      const data = {
        scheduled_config: toRaw(unref(scheduledConfig.value)),
        kwargs: toRaw(unref(systemTaskKwargs.value)),
      }
      await setSysScheduledHandle(scheduledConfig.value.id, data).then(() => { 
        handleRefreshScheduledList(qureyParams.value)
        resetConfig()
            showSystemModal.value = false
      })
    }
  })
}
const handleAddSchedule = () => {
  showModal.value = true
}
onMounted(() => {
  qureyParams.value.name = null
  qureyParams.value.types = props.scheduledType
  handleRefreshScheduledList(qureyParams.value)
})
</script>
