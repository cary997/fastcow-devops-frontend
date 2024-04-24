<template>
  <div class="flex flex-none flex-row justify-end space-x-4 p-2">
    <span class="flex-1 m:max-w-1/4">
      <n-input
        placeholder="%模版名称%"
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
    <span>
      <n-button type="primary" @click="createClickHandel">
        <template #icon>
          <n-icon>
            <Add12Filled />
          </n-icon>
        </template>
        添加模版
      </n-button>
    </span>
  </div>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="新建模版"
    :style="{ 'max-width': '25rem' }"
    :bordered="true"
    :segmented="{
      content: true,
      action: true,
    }"
    @after-leave="afterLeaveHandel"
  >
    <template #header-extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon :size="20">
            <InformationCircle />
          </n-icon>
        </template>
        <span class="text-xs">
          <ul class="list-outside">
            <li>Playbook类型用于存放相关执行文件,建议每个项目一个单独的模版</li>
            <li>FileStore类型适用于存放一些执行Ad-Hoc任务时可能用到的文件例如安装包</li>
          </ul>
        </span>
      </n-popover>
    </template>
    <n-form
      ref="formRef"
      :model="templateData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="任务名称" path="name">
        <n-input
          clearable
          maxlength="32"
          show-count
          v-model:value="templateData.name"
        />
      </n-form-item>
      <n-form-item label="任务类型" path="task_type">
        <n-select v-model:value="templateData.task_type" :options="options" />
      </n-form-item>
      <n-form-item label="任务描述" path="desc">
        <n-input
          clearable
          maxlength="64"
          show-count
          type="textarea"
          v-model:value="templateData.desc"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <div class="flex justify-end">
        <n-button size="small" type="success" @click="submitClickHandel">
          {{ $t("action.submit") }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import {
  FormInst,
  FormRules,
  NButton,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NModal,
  NPopover,
  NSelect,
} from "naive-ui"
import { ref, toRaw, unref } from "vue"
import { useI18n } from "vue-i18n"

import { InformationCircle } from "@vicons/ionicons5"
import { Add12Filled, Search20Regular } from "@vicons/fluent"

import {
  addTasksTemplateHandle,
  defaultTemplateData,
  refreshTemplateList,
  setTasksTemplateHandle,
  showModal,
  templateData,
} from "./extend"

const { t } = useI18n()
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: () => t("Form.required"),
  },
  task_type: {
    required: true,
    message: () => t("Form.required"),
  },
}
const options = [
  {
    label: "Playbook",
    value: "Playbook",
  },
  {
    label: "FileStore",
    value: "FileStore",
  },
]
const searchText = ref(null)
const handleSearch = () => {
  if (searchText.value) {
    refreshTemplateList({ name: searchText.value, limit: 12, page: 1 })
  } else {
    refreshTemplateList()
  }
}
const createClickHandel = () => {
  showModal.value = true
}
const afterLeaveHandel = () => {
  templateData.value = { ...defaultTemplateData }
}
const submitClickHandel = () => {
  formRef.value?.validate(async errors => {
    if (!errors) {
      const data = toRaw(unref(templateData.value))
      if (!data.id) {
        await addTasksTemplateHandle(data).then(res => {
          refreshTemplateList()
        })
      } else {
        await setTasksTemplateHandle(data.id, data).then(res => {
          refreshTemplateList()
        })
      }
      showModal.value = false
    }
  })
}
</script>
