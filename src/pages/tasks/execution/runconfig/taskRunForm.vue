<template>
  <div class="flex flex-1 flex-row">
    <div class="flex-1">
      <n-card :bordered="false" title="任务参数">
        <template #header-extra>
          <div class="w-50">
            <n-select
              size="tiny"
              clearable
              v-model:value="fileHelpTemplateId"
              placeholder="快捷复制&查看模版文件"
              filterable
              :options="templateOptions"
              :loading="templateSelectLoading"
              label-field="name"
              value-field="id"
              :render-label="renderTemplateLabel"
              @focus="handelTemplateFocus"
              @update:value="handelFileHelpUpdate"
              @clear="handelFileHelpClear"
            />
          </div>
        </template>
        <n-form
          ref="formRef"
          :model="taskConfig"
          :rules="rules"
          size="small"
          label-placement="left"
          label-width="auto"
        >
          <n-grid :cols="12" :x-gap="12">
            <n-form-item-gi :span="12" label="任务名称" path="task_name">
              <n-input v-model:value="taskConfig.task_name" clearable />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Ad-Hoc'"
              :span="12"
              label="执行模块(-m)"
              path="module"
            >
              <n-auto-complete
                v-model:value="taskConfig.module"
                :input-props="{
                  autocomplete: 'disabled',
                }"
                :options="moduleOptions"
                clearable
                placeholder="shell"
                @update:value="modelUpdataHandle"
              />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Ad-Hoc'"
              :span="12"
              label="模块参数(-a)"
              path="module_args"
            >
              <n-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                v-model:value="taskConfig.module_args"
                placeholder="ps -ef | grep fastcow"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Playbook'"
              :span="12"
              label="任务模版"
              path="task_template_id"
            >
              <n-select
                v-model:value="taskConfig.task_template_id"
                placeholder="选择模版"
                :options="templateOptions"
                :loading="templateSelectLoading"
                label-field="name"
                value-field="id"
                filterable
                :render-label="renderTemplateLabel"
                @focus="handelTemplateFocus"
                @update:value="handelTemplateUpdate"
              />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Playbook'"
              :span="12"
              label="执行文件"
              path="playbook"
            >
              <n-tree-select
                v-model:value="taskConfig.playbook"
                :options="templateFileOptions"
                :loading="templateFileSelectLoading"
                label-field="name"
                key-field="path"
                show-path
                filterable
                default-expand-all
                :override-default-node-click-behavior="overrideFileTree"
                @focus="handelFileSelectFocus"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="执行参数" path="cmdline">
              <n-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                v-model:value="taskConfig.cmdline"
                clearable
                placeholder="-vvv --ssh-common-args=SSH_COMMON_ARGS"
              />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Playbook'"
              :span="12"
              label="执行Tags"
              path="tags"
            >
              <n-input
                v-model:value="taskConfig.tags"
                clearable
                placeholder="exec_tag"
              />
            </n-form-item-gi>
            <n-form-item-gi
              v-if="taskType == 'Playbook'"
              :span="12"
              label="忽略Tags"
              path="skip_tags"
            >
              <n-input
                v-model:value="taskConfig.skip_tags"
                clearable
                placeholder="ignore_tag"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="任务并发" path="forks">
              <n-input-number
                v-model:value="taskConfig.forks"
                :show-button="false"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="任务超时(秒)" path="timeout">
              <n-input-number
                v-model:value="taskConfig.timeout"
                :show-button="false"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="额外变量(-e)" path="extravars">
              <n-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                v-model:value="(taskConfig.extravars as string)"
                clearable
                placeholder='{"key":"value"} Json格式'
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-card>
    </div>
    <n-divider vertical style="height: 100%" />
    <div class="flex flex-1">
      <n-card :bordered="false" title="主机清单"> 111 </n-card>
    </div>
    <n-drawer v-model:show="draweActive" :width="450" placement="right">
      <n-drawer-content title="文件树">
        <div class="flex flex-col">
          <n-input v-model:value="fileTreePattern" placeholder="搜索" />
          <n-divider />
          <n-tree
            :data="templateFileOptions"
            default-expand-all
            block-line
            label-field="name"
            key-field="path"
            show-line
            :pattern="fileTreePattern"
            :render-suffix="renderFileTreeSuffix"
            :show-irrelevant-nodes="false"
          />
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  FormInst,
  FormItemRule,
  FormRules,
  NAutoComplete,
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NInputNumber,
  NPopover,
  NSelect,
  NTree,
  NTreeSelect,
  SelectRenderLabel,
  TreeOption,
  TreeSelectOverrideNodeClickBehavior,
} from "naive-ui"
import { computed, h, onMounted, PropType, ref } from "vue"
import { useI18n } from "vue-i18n"

import { TasksRunConfig } from "@/api/tasks/execution"
import { TaskTemplates, TemplateFiles } from "@/api/tasks/templates"
import asbLogo from "@/assets/image/ansible_logo.png"
import filesLogo from "@/assets/image/files_logo.png"
import useSettingsStore from "@/store/modules/appSettings"
import { onCopy } from "@/utils/tools"
import { InformationCircle } from "@vicons/ionicons5"
import { Copy } from "@vicons/ionicons5"

import { queryTasksTemplateHandle } from "../../templates/extend"
import {
  getFilesTreeHandle,
  getTasksTemplateHandle,
} from "../../templates/meta/extend"
import { defaultTaskConfig } from "./extend"

const props = defineProps({
  taskType: { type: String, required: true },
})
const formRef = defineModel("formRef", {
  type: Object as PropType<FormInst>,
})
const draweActive = ref(false)
const fileTreePattern = ref("")
const fileHelpTemplateId = ref(null)
const taskConfig = defineModel("taskConfig", {
  type: Object as PropType<TasksRunConfig>,
  required: true,
  default: () => defaultTaskConfig,
})
const templateOptions = ref<Array<TaskTemplates>>([])
const templateSelectLoading = ref(false)
const templateFileOptions = ref<Array<TemplateFiles>>([])
const templateFileSelectLoading = ref(false)
const overrideFileTree: TreeSelectOverrideNodeClickBehavior = ({ option }) => {
  if (option.type != 3) {
    return "toggleExpand"
  }
  return "default"
}
const { t } = useI18n()
const moduleOptions = ref<Array<string>>([])
const modelUpdataHandle = (value: string) => {
  if (value) {
    moduleOptions.value = useSettingsStore().ansible_model_list.filter(item => {
      return item.indexOf(value) === 0
    })
  } else {
    moduleOptions.value = []
  }
}
const templatePath = computed(() => {
  return useSettingsStore().system_path.tasks_templates_path
})
const renderFileTreeSuffix = ({ option }: { option: TreeOption }) => {
  const filePath = `${templatePath.value}/${option.path}`
  return h("div", { class: "space-x-2" }, [
    h(
      NPopover,
      { trigger: "hover" },
      {
        trigger: () =>
          h(NIcon, {
            class: "text-lightinfo",
            size: 16,
            component: InformationCircle,
          }),
        default: () => filePath,
      },
    ),
    h(
      NButton,
      {
        text: true,
        type: "primary",
        onClick: () => onCopy(filePath),
      },
      {
        icon: () =>
          h(NIcon, { class: "text-primary", size: 16, component: Copy }),
      },
    ),
  ])
}

const renderTemplateLabel: SelectRenderLabel = option => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: props.taskType == "Playbook" ? asbLogo : filesLogo,
        round: true,
        size: 20,
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        {
          default: () => option.name as string,
        },
      ),
    ],
  )
}
const templateType = computed(() => {
  return props.taskType == "Playbook" ? "Playbook" : "FileStore"
})
const rules: FormRules = {
  task_name: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      return true
    },
  },
  module: {
    required: true,
    trigger: ["blur"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      if (!useSettingsStore().ansible_model_list.includes(value)) {
        return new Error("不支持的模块")
      }
      return true
    },
  },
  task_template_id: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      return true
    },
  },
  playbook: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      if (value.endsWith(".yml") || value.endsWith(".yaml")) {
        return true
      } else {
        return new Error(t("可执行文件类型应为yaml"))
      }
    },
  },
  extravars: {
    required: false,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      try {
        if (!value) {
          return true
        }

        const jsonValue = JSON.parse(value) // 如果不是json字符串就会抛异常
        if (typeof jsonValue !== "object") {
          return new Error("Json格式不正确")
        }
        return true
      } catch (e) {
        return new Error("Json校验失败")
      }
    },
  },
}

const handelTemplateFocus = async () => {
  templateSelectLoading.value = true
  if (templateOptions.value.length === 0) {
    await queryTasksTemplateHandle({
      is_all: true,
      task_type: templateType.value,
    })
      .then(res => {
        templateOptions.value = res.result
      })
      .finally(() => {
        templateSelectLoading.value = false
      })
  } else {
    templateSelectLoading.value = false
  }
}
const handelTemplateUpdate = (value, option) => {
  taskConfig.value.task_template_name = option.name
}
const handelFileSelectFocus = async () => {
  if (!taskConfig.value.task_template_id) {
    window.$message.error("请选择任务模版")
  } else {
    templateFileSelectLoading.value = true
    await getTasksTemplateHandle(taskConfig.value.task_template_id)
      .then(res => {
        if (res.files) {
          templateFileOptions.value = getFilesTreeHandle(res.files)
        }
      })
      .finally(() => {
        templateFileSelectLoading.value = false
      })
  }
}
const handelFileHelpUpdate = async (value, option) => {
  if (value) {
    await getTasksTemplateHandle(value).then(res => {
      if (res.files) {
        templateFileOptions.value = getFilesTreeHandle(res.files)
        draweActive.value = true
        if (taskConfig.value.task_type != "Playbook") {
          taskConfig.value.task_template_id = value
          taskConfig.value.task_template_name = option.name
        }
      }
    })
  }
}
const handelFileHelpClear = async () => {
  if (taskConfig.value.task_type != "Playbook") {
    taskConfig.value.task_template_id = null
    taskConfig.value.task_template_name = null
  }
}
onMounted(async () => {
  taskConfig.value.task_type = props.taskType
  templateSelectLoading.value = true
  if (templateOptions.value.length === 0) {
    await queryTasksTemplateHandle({
      is_all: true,
      task_type: templateType.value,
    })
      .then(async res => {
        templateOptions.value = res.result
        if (taskConfig.value.task_template_id) {
          templateFileSelectLoading.value = true
          await getTasksTemplateHandle(taskConfig.value.task_template_id)
            .then(res => {
              if (res.files) {
                templateFileOptions.value = getFilesTreeHandle(res.files)
              }
            })
            .finally(() => {
              templateFileSelectLoading.value = false
            })
        }
      })
      .finally(() => {
        templateSelectLoading.value = false
      })
  }
})
</script>

<style scoped></style>
@/api/tasks/templates
