<template>
<div class="p-2">
  <BaseTables
    remote
    tableTitle="任务历史"
    v-model:columns="tableColumns"
    :data="historyList"
    :row-key="columnsRowKey"
    :refresData="handleRefreshHistoryList"
    :loading="loadingRef"
    :pagination="paginationReactive"
    :bordered="false"
    @update:checked-row-keys="handleCheckRow"
    :style="{ height: '780px' }"
    flex-height
  >
    <template v-slot:tableFitter>
      <div class="m-4">
      <n-form
        ref="formRef"
        :model="qureyParams"
        size="small"
        label-placement="left"
        label-width="auto"
      >
        <n-grid :cols="8" :x-gap="12" responsive="screen" item-responsive>
          <n-form-item-gi span="4 m:2" label="任务名" path="task_name">
            <n-input clearable v-model:value="qureyParams.task_name" />
          </n-form-item-gi>
          <n-form-item-gi span="4 m:2" label="任务状态" path="task_status">
            <n-select
              :options="taskStatusOptions"
              v-model:value="qureyParams.task_status"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi span="4 m:2" label="任务类型" path="task_type">
            <n-select
              :options="taskTypeOptions"
              v-model:value="qureyParams.task_type"
              clearable
            />
          </n-form-item-gi>
          <n-form-item-gi span="4 m:2">
            <NButton
              type="primary"
              size="tiny"
              @click="handleSearch"
              class="ml-2 mr-2"
            >
              <template #icon>
                <n-icon>
                  <Search />
                </n-icon>
              </template>
              {{ $t("action.search") }}
            </NButton>
            <NButton
              type="info"
              size="tiny"
              @click="handleResetFitter"
              class="ml-2 mr-2"
            >
              <template #icon>
                <n-icon>
                  <Reset />
                </n-icon>
              </template>
              {{ $t("action.reset") }}
            </NButton>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    </template>
    <template v-slot:tableHeaderAction>
      <n-button
        v-if="showDeleteBtn"
        type="error"
        size="small"
        @click="handleDelete"
        class="ml-2 mr-2"
      >
        <template #icon>
          <n-icon>
            <DeleteLines20Regular />
          </n-icon>
        </template>
        {{ $t("action.delete") }}
      </n-button>
      <n-button
        type="primary"
        size="small"
        @click="handleAddTask"
        class="ml-2 mr-2"
      >
        <template #icon>
          <n-icon>
            <TaskListSquareAdd24Regular />
          </n-icon>
        </template>
        新增任务
      </n-button>
    </template>
  </BaseTables>
</div>
  <config-modal
    title="新建任务"
    title-desc="此页面适用于执行一次性任务"
    v-model:show-modal="showModal"
    v-model:task-config="taskConfig"
    v-model:form-ref="formRef"
    v-model:show-tab-pane="showTabPane"
    :other-pane-disable="otherPaneDisable"
  >
    <template #action>
      <n-button type="primary" size="small" @click="handleExec">
        执行
      </n-button>
    </template>
  </config-modal>
</template>

<script lang="ts" setup>
import {
  DataTableRowKey,
  FormInst,
  NButton,
  NForm,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NSelect,
} from "naive-ui"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import BaseTables from "@components/Tables/BaseTables.vue"

import { TasksRunConfig } from "@/api/tasks/execution"
import { Reset, Search } from "@vicons/carbon"
import {
  DeleteLines20Regular,
  TaskListSquareAdd24Regular,
} from "@vicons/fluent"

import {
  checkRowKeys,
  columnsRowKey,
  createColumns,
  defaultQureyParams,
  delTasksHistoryHandle,
  handleRefreshHistoryList,
  historyList,
  historyToConfig,
  loadingRef,
  paginationReactive,
  qureyParams,
  revokeTasksHistoryHandle,
  taskRunHandle,
} from "./extend"
import { defaultTaskConfig } from "./runconfig/extend"
import configModal from "./runconfig/index.vue"

const { t } = useI18n()
const router = useRouter()
const formRef = ref<FormInst>()
const taskConfig = ref<TasksRunConfig>({ ...defaultTaskConfig })
const showDeleteBtn = ref(false)
const showModal = ref(false)
//选中回调
const handleCheckRow = (rowKeys: DataTableRowKey[]) => {
  rowKeys.length > 0
    ? (showDeleteBtn.value = true)
    : (showDeleteBtn.value = false)
  checkRowKeys.value = rowKeys
}
/**控制标签页显示 */
const showTabPane = ref("Ad-Hoc")
const otherPaneDisable = ref(false)

//表格列生成
const tableColumns = ref(
  createColumns({
    getTaskDetail(rowData) {
      router.push({
        name: "tasks_execution_details",
        query: { id: rowData.id },
      })
    },
    retryTask(rowData) {
      window.$dialog.warning({
        title: t("title.warning"),
        content: `重试任务不支持取消，并且任务（${rowData.task_name}) 执行记录在执行后将被重置`,
        positiveText: t("action.confirm"),
        negativeText: t("action.cancel"),
        onPositiveClick: () => {
          const config = historyToConfig(rowData)
          showTabPane.value = config.task_type
          taskConfig.value = { ...config }
          otherPaneDisable.value = true
          showModal.value = true
        },
      })
    },
    createTask(rowData) {
      const config = historyToConfig(rowData)
      config.ident = null
      showTabPane.value = config.task_type
      taskConfig.value = { ...config }
      otherPaneDisable.value = true
      showModal.value = true
    },
    getTemplate(rowData) {
      router.push({
        name: "tasks_templates_meta",
        query: { id: rowData.task_template_id },
      })
    },
    async revokeTask(rowData) {
      await revokeTasksHistoryHandle(rowData.task_id).then(async() => { 
        await handleRefreshHistoryList(qureyParams.value)
      })
    }
  }),
)
const taskStatusOptions = [
  {
    label: "running",
    value: "running",
  },
  {
    label: "starting",
    value: "starting",
  },
  {
    label: "successful",
    value: "successful",
  },
  {
    label: "failed",
    value: "failed",
  },
  {
    label: "canceled",
    value: "canceled",
  },
  {
    label: "timeout",
    value: "timeout",
  },
]
const taskTypeOptions = [
  {
    label: "Playbook",
    value: "Playbook",
  },
  {
    label: "Ad-Hoc",
    value: "Ad-Hoc",
  },
]
/**搜索 */
const handleSearch = async () => {
  qureyParams.value.page = 1
  await handleRefreshHistoryList(qureyParams.value)
}
/**重置 */
const handleResetFitter = () => {
  qureyParams.value = { ...defaultQureyParams }
}

/**删除任务记录 */
const handleDelete = () => {
  window.$dialog.warning({
    title: t("title.warning"),
    content: `确认删除${checkRowKeys.value.length}条记录？`,
    positiveText: t("action.confirm"),
    negativeText: t("action.cancel"),
    onPositiveClick: () => {
      delTasksHistoryHandle({ id_list: checkRowKeys.value }).then(async () => {
        showDeleteBtn.value = false
        await handleRefreshHistoryList(qureyParams.value)
      })
    },
  })
}



/**添加任务 */
const handleAddTask = () => {
  taskConfig.value = { ...defaultTaskConfig }
  otherPaneDisable.value = false
  showTabPane.value = "Ad-Hoc"
  showModal.value = true
}
const handleExec = () => {
  formRef.value.validate(async error => {
    if (!error) {
      taskConfig.value.task_queue_type = "asb_temp_task"
      await taskRunHandle(taskConfig.value).then(res => {
        showModal.value = false
        router.push({
          name: "tasks_execution_details",
          query: { id: res.id },
        })
      })
    }
  })
}

onMounted(async () => {
  await handleRefreshHistoryList(qureyParams.value)
})
</script>
