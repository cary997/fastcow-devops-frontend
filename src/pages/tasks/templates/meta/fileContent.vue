<template>
  <div>
    <codeEditor
      v-model:code="code"
      v-model:code-language="fileLanguage"
      :loading="loading"
      :tab-size="tabSize"
      min-height="350px"
      max-height="700px"
      @update:code="handleUpdate"
    >
      <template #header>
        <div class="flex flex-none flex-row items-center justify-start">
          <n-icon v-if="fileType == 3" size="16" :component="DocumentText" />
          <n-icon
            v-if="fileType == 2"
            size="16"
            color="#ffca28"
            :component="FolderOpen"
          />
          <NText depth="3" class="ml-1">
            {{ title }}
          </NText>
        </div>
        <n-button
          v-if="fileType == 3"
          type="success"
          size="tiny"
          @click="handleSave"
        >
          <template #icon>
            <n-icon>
              <Save16Filled />
            </n-icon>
          </template>
          {{ t("action.save") }}
        </n-button>
      </template>
    </codeEditor>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NIcon,NText } from "naive-ui"
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import codeEditor from "@components/Editor/index.vue"

import { Save16Filled } from "@vicons/fluent"
import { DocumentText, FolderOpen } from "@vicons/ionicons5"

import {
  filePath,
  fileType,
  readTasksFileHandle,
  templateMetaData,
  writeTasksFileHandle,
} from "./extend"

const { t } = useI18n()
const code = ref("")
const title = computed(() => {
  return filePath.value
    ? filePath.value.split(templateMetaData.value.id)[1]
    : ""
})
const fileLanguage = ref("yaml")
const tabSize = ref(2)
const loading = ref(false)
const isChanged = ref(false)
const handleUpdate = (code: string) => {
  console.log(code)
  isChanged.value = true
}
const handleSave = async () => {
  loading.value = true
  const data = {
    path: filePath.value,
    code: code.value,
  }
  if (isChanged.value) {
    await writeTasksFileHandle(data).then(res => {
      code.value = res.code
      loading.value = false
    })
  } else {
    loading.value = false
    window.$message.info("No Changes")
  }
}
watch(filePath, async newQuestion => {
  loading.value = true
  if (fileType.value === 3) {
    const data = { path: filePath.value }
    await readTasksFileHandle(data).then(res => {
      fileLanguage.value = res.lang
      if (["python", "shell", "sql"].includes(res.lang)) {
        tabSize.value = 4
      } else {
        tabSize.value = 2
      }
      code.value = res.code
      loading.value = false
    })
  } else {
    code.value = ""
    loading.value = false
  }
})
</script>
