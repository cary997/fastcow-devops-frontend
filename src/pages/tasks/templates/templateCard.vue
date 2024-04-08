<template>
  <div class="flex flex-1 flex-col">
    <div class="grid grid-cols-1 gap-8 m:grid-cols-4 m:grid-rows-3">
      <div v-for="item in templateList" class="col-span-1 row-span-1">
        <n-card hoverable class="h-full bg-base-100 shadow-md">
          <template #header>
            <!-- <textAvatar
                            :size="46"
                            :text="item.task_type"
                            :content="
                                item.task_type === 'Python'
                                    ? item.task_type.substring(0, 2)
                                    : item.task_type.charAt(0)
                            "
                        /> -->
            <n-avatar
              round
              :size="46"
              :class="[
                'text-xl',
                item.task_type == 'Playbook'
                  ? 'bg-primary'
                  : item.task_type == 'Ad-Hoc'
                    ? 'bg-info'
                    : item.task_type == 'Shell'
                      ? 'bg-warning'
                      : 'bg-success',
              ]"
            >
              {{
                item.task_type === "Python"
                  ? item.task_type.substring(0, 2)
                  : item.task_type.charAt(0)
              }}
            </n-avatar>
          </template>
          <template #header-extra>
            <router-link
              :to="{
                name: 'tasks_templates_meta',
                query: { id: item.id },
              }"
            >
              <n-button type="info" size="small">进入模版</n-button>
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

          <div class="flex flex-col space-y-2">
            <div
              :class="[
                'badge badge-sm text-white dark:text-black',
                item.task_type == 'Playbook'
                  ? 'badge-primary'
                  : item.task_type == 'Ad-Hoc'
                    ? 'badge-info'
                    : item.task_type == 'Shell'
                      ? 'badge-warning'
                      : 'badge-success',
              ]"
            >
              {{ item.task_type }}
            </div>
            <span class="flex-1 font-semibold">
              任务名称: {{ item.name }}
            </span>
            <span class="flex-1 text-xs opacity-75">
              任务描述: {{ item.desc }}
            </span>
          </div>
        </n-card>
      </div>
    </div>
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
import { NAvatar, NButton, NCard, NIcon, NPagination, NPopover } from "naive-ui"
import { useI18n } from "vue-i18n"

import { TaskTemplates } from "@/api/tasks/types"
import { MoreHorizontal48Regular } from "@vicons/fluent"

import {
  delTasksTemplateHandle,
  paginationReactive,
  refreshTemplateList,
  showModal,
  templateData,
  templateList,
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
