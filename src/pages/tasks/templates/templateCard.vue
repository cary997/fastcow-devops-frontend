<template>
  <div class="flex flex-1 flex-col">
    <n-spin size="large" :show="lodingRef">
      <div class="grid grid-cols-1 gap-8 m:grid-cols-4 m:grid-rows-3">
        <div v-for="item in templateList" class="col-span-1 row-span-1">
          <n-card hoverable class="h-full bg-base-100 shadow-md">
            <template #header>
              <n-avatar
                round
                size="large"
                :src="item.task_type == 'Playbook' ?asbLogo: filesLogo"
              />
            </template>
            <template #header-extra>
              <router-link
                :to="{
                  name: 'tasks_templates_meta',
                  query: { id: item.id },
                }"
              >
                <n-button type="primary" size="small">进入模版</n-button>
              </router-link>
              <n-popover placement="bottom" trigger="click">
                <template #trigger>
                  <n-icon
                    :size="20"
                    :component="MoreHorizontal48Regular"
                    class="ml-4"
                  />
                </template>
                <div class="flex flex-col space-y-4">
                  <n-button text size="small" @click="editClickHandle(item)">
                    编辑
                  </n-button>
                  <n-button size="small" text @click="delClickHandle(item.id)">
                    删除
                  </n-button>
                </div>
              </n-popover>
            </template>

            <div class="flex flex-col space-y-2" >
              <div
                :class="`badge  badge-sm text-white dark:text-black ${
                  getTaskTypeBadgeClass(item.task_type)
                }`"
              >
                {{ item.task_type }}
              </div>
              <span class="flex-1 font-semibold">
                <n-ellipsis> 任务名称: {{ item.name }} </n-ellipsis>
              </span>
              <span class="flex-1 text-xs opacity-75">
                <n-ellipsis> 任务描述: {{ item.desc }} </n-ellipsis>
              </span>
            </div>
          </n-card>
        </div>
      </div>
    </n-spin>
    <div
      v-if="templateList.length"
      class="flex flex-1 flex-row justify-end p-4"
    >
      <n-pagination
        v-model:page="paginationReactive.page"
        :item-count="paginationReactive.itemCount"
        :prefix="paginationReactive.prefix"
        :pageSize="paginationReactive.pageSize"
        @update-page="pageUpdateHandle"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  NAvatar,
  NButton,
  NCard,
  NEllipsis,
  NIcon,
  NPagination,
  NPopover,
  NSpin,
} from "naive-ui"
import { useI18n } from "vue-i18n"

import { TaskTemplates } from "@/api/tasks/templates"
import asbLogo from "@/assets/image/ansible_logo.png"
import filesLogo from "@/assets/image/files_logo.png"
import { MoreHorizontal48Regular } from "@vicons/fluent"

import {
  delTasksTemplateHandle,
  lodingRef,
  paginationReactive,
  refreshTemplateList,
  showModal,
  templateData,
  templateList,
  getTaskTypeBadgeClass
} from "./extend"

const { t } = useI18n()
const pageUpdateHandle = page => {
  refreshTemplateList({ page: page })
}

const editClickHandle = (item: TaskTemplates) => {
  templateData.value = { ...item }
  showModal.value = true
}

const delClickHandle = async (tid: string) => {
  window.$dialog.warning({
    title: t("title.warning"),
    content: "将删除模版以及所有关联文件，确认删除任务模版？",
    positiveText: t("action.confirm"),
    negativeText: t("action.cancel"),
    onPositiveClick: () => {
      delTasksTemplateHandle(tid).then(async () => {
        await refreshTemplateList()
      })
    },
  })
}
</script>
@/api/tasks/templates
