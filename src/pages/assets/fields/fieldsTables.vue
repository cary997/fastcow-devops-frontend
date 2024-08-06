<template>
  <div class="flex flex-1 flex-col space-y-4">
    <n-tabs type="segment" v-model:value="tabValue" animated>
      <n-tab-pane name="extension" tab="扩展字段">
        <BaseTables
          v-model:columns="tableColumns"
          :data="extensionFieldsList"
          :refresData="refreshAssetsFieldsHandle"
          :bordered="false"
        >
          <template v-slot:tableHeaderAction>
            <n-button
              type="primary"
              size="small"
              class="mb-1 ml-2 mr-2"
              @click="handleAddFields"
            >
              <template #icon>
                <n-icon>
                  <IosCreate />
                </n-icon>
              </template>
              新建字段
            </n-button>
          </template>
        </BaseTables>
      </n-tab-pane>
      <n-tab-pane name="default" tab="默认字段">
        <BaseTables
          v-model:columns="tableColumns"
          :data="defaultFiledsList"
          :refresData="refreshAssetsFieldsHandle"
          :bordered="false"
        >
        </BaseTables>
      </n-tab-pane>
    </n-tabs>
  </div>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="字段信息"
    :style="{ 'max-width': '30rem' }"
    :bordered="true"
    :segmented="{
      action: true,
    }"
  >
    <n-form
      ref="formRef"
      :rules="formRules"
      :model="fieldModel"
      size="small"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item path="field_name" label="字段名">
        <n-input
          v-model:value="fieldModel.field_name"
          :disabled="fieldNameDisabled"
        />
      </n-form-item>
      <n-form-item path="field_display_name" label="显示名">
        <n-input v-model:value="fieldModel.field_display_name" />
      </n-form-item>
      <n-form-item path="link_field" label="关联字段">
        <n-input v-model:value="fieldModel.link_field" />
      </n-form-item>
      <n-form-item path="joint_mark" label="拼接符号">
        <n-input v-model:value="fieldModel.joint_mark" />
      </n-form-item>
      <n-form-item path="unit" label="单位">
        <n-input v-model:value="fieldModel.unit" />
      </n-form-item>
      <n-form-item path="automatic" label="自动获取">
        <n-switch
          v-model:value="fieldModel.automatic"
          :default-value="fieldModel.automatic"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <div class="flex flex-row justify-end">
        <n-button type="primary" size="small" @click="handleSave">
          {{ t("action.save") }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  FormInst,
  FormItemRule,
  NButton,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NModal,
  NSwitch,
  NTabPane,
  NTabs,
} from "naive-ui"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import BaseTables from "@components/Tables/BaseTables.vue"

import { BaseFields } from "@/api/assets/type"
import { clone } from "@pureadmin/utils"
import { IosCreate } from "@vicons/ionicons4"

import {
  allFileds,
  createColumns,
  defaultFiledsList,
  extensionFieldsList,
  refreshAssetsFieldsHandle,
  setAssetsFieldsHandle,
} from "./extend"

const props = defineProps({
  option: {
    type: String,
    default: "hosts",
  },
})
const tabValue = ref("extension")
const { t } = useI18n()
const showModal = ref(false)
const fieldModel = ref<BaseFields>({
  field_name: null,
  field_display_name: null,
})

const formRef = ref<FormInst>(null)
const formRules = {
  field_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      return true
    },
  },
  field_display_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      return true
    },
  },
}
const fieldNameDisabled = ref(false)

const submitAllFileds = async () => {
  const defaultObject = Object.fromEntries(
    defaultFiledsList.value.map(item => [item.field_name, item]),
  )
  const extensionObject = Object.fromEntries(
    extensionFieldsList.value.map(item => [item.field_name, item]),
  )
  if (props.option === "hosts") {
    allFileds.value.hosts_default_fields = defaultObject
    allFileds.value.hosts_extension_fields = extensionObject
  }

  await setAssetsFieldsHandle(allFileds.value).then(async () => {
    showModal.value = false
    fieldNameDisabled.value = false
    fieldModel.value = {
      field_name: null,
      field_display_name: null,
    }
    await refreshAssetsFieldsHandle()
  })
}

const tableColumns = ref(
  createColumns({
    delFields(rowData: BaseFields) {
      window.$dialog.warning({
        title: t("title.warning"),
        content: "确认删除字段？",
        positiveText: t("action.confirm"),
        negativeText: t("action.cancel"),
        onPositiveClick: async () => {
          if (tabValue.value === "default") {
            const index = defaultFiledsList.value.findIndex(
              item => item.field_name === rowData.field_name,
            )
            defaultFiledsList.value.splice(index, 1)
          }
          if (tabValue.value === "extension") {
            const index = extensionFieldsList.value.findIndex(
              item => item.field_name === rowData.field_name,
            )
            extensionFieldsList.value.splice(index, 1)
          }
          await submitAllFileds()
        },
      })
    },
    setFields(rowData: BaseFields) {
      fieldModel.value = clone(rowData, true)
      showModal.value = true
      fieldNameDisabled.value = true
    },
  }),
)

const handleAddFields = () => {
  showModal.value = true
}

const handleSave = () => {
  formRef.value.validate().then(async () => {
    if (tabValue.value === "default") {
      if (fieldNameDisabled.value) {
        const index = defaultFiledsList.value.findIndex(
          item => item.field_name === fieldModel.value.field_name,
        )
        defaultFiledsList.value.splice(index, 1)
      }
      defaultFiledsList.value.push(fieldModel.value)
    }
    if (tabValue.value === "extension") {
      if (fieldNameDisabled.value) {
        const index = extensionFieldsList.value.findIndex(
          item => item.field_name === fieldModel.value.field_name,
        )
        extensionFieldsList.value.splice(index, 1)
      }
      extensionFieldsList.value.push(fieldModel.value)
    }
    await submitAllFileds()
  })
}

onMounted(async () => {
  await refreshAssetsFieldsHandle()
})
</script>
