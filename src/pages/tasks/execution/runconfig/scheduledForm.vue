<template>
  <n-card :bordered="false" title="执行器参数">
    <n-form ref="formRef" :model="scheduledConfig" :rules="rules" size="small" label-placement="left"
      >
      <n-grid :cols="12" :x-gap="12">
        <n-form-item-gi v-if="scheduledType == 'interval'" :span="12" label="执行频率" path="every">
          <n-input-number v-model:value="scheduledConfig.every" clearable :show-button="false" />
          <n-select v-model:value="scheduledConfig.period
    " :options="everyOptions" class="w-20 ml-2" />
        </n-form-item-gi>
        <n-form-item-gi v-if="scheduledType == 'crontab'" :span="9" label="任务计划" path="crontab">
          <n-input-group>
            <n-input-group-label size="small" class="text-primary">分</n-input-group-label>
            <n-input v-model:value="scheduledConfig.minute"  />
            <n-input-group-label size="small" class="text-primary">时</n-input-group-label>
            <n-input v-model:value="scheduledConfig.hour" placeholder="*" />
            <n-input-group-label size="small" class="text-primary">日</n-input-group-label>
            <n-input v-model:value="scheduledConfig.day_of_week" placeholder="*" />
            <n-input-group-label size="small" class="text-primary">月</n-input-group-label>
            <n-input v-model:value="scheduledConfig.day_of_month" placeholder="*" />
            <n-input-group-label size="small" class="text-primary">年</n-input-group-label>
            <n-input v-model:value="scheduledConfig.month_of_year" placeholder="*" />
          </n-input-group>
        </n-form-item-gi>
        <slot name="form" />
        <n-form-item-gi v-if="scheduledType == 'crontab'" :span="3" label="时区" path="timezone">
          <n-input v-model:value="scheduledConfig.timezone" />
        </n-form-item-gi>
        <n-form-item-gi :span="2" label="立即启用" path="enabled">
          <n-switch v-model:value="scheduledConfig.enabled" />
        </n-form-item-gi>
        <n-form-item-gi :span="2" label="执行一次" path="one_off">
          <n-switch v-model:value="scheduledConfig.one_off" />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="队列优先级" path="priority">
          <n-input-number v-model:value="scheduledConfig.priority" clearable :show-button="false" :min="0" :max="9"
            placeholder="0最高 9最低 0-9" />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="队列过期时间(秒)" path="expire_seconds">
          <n-input-number v-model:value="scheduledConfig.expire_seconds" clearable :show-button="false" class="w-full"
            placeholder="超过此时间不再执行" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="备注信息" path="description">
          <n-input type="textarea" v-model:value="scheduledConfig.description" clearable /> 
        </n-form-item-gi>
        </n-grid>
    </n-form>
    <slot name="bottom"/>
  </n-card>

</template>

<script lang="ts" setup>
import {
  FormInst,
  NCard,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NInputGroup,
  NInputGroupLabel,
  FormItemRule
} from "naive-ui"
import { onMounted, PropType,computed } from "vue"

import {
  scheduledConfig,
  ScheduledType,
} from "@/api/tasks/scheduled"
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const props = defineProps({
  scheduledType: {
    type: String as PropType<ScheduledType>,
    default: "interval"
  },
})
const formRef = defineModel("formRef", {
  type: Object as PropType<FormInst>,
})

const scheduledConfig = defineModel("scheduledConfig", {
  type: Object as PropType<scheduledConfig>,
  required: true,
  default: () => { },
})
const crontabs = computed(() => { 
  return [scheduledConfig.value.minute,scheduledConfig.value.hour,scheduledConfig.value.day_of_month,scheduledConfig.value.day_of_week,scheduledConfig.value.month_of_year].filter(item => item!=null)
})
const everyOptions = [
  {
    label: "秒",
    value: "seconds",
  },
  {
    label: "分钟",
    value: "minutes",
  },
  {
    label: "小时",
    value: "hours",
  },
  {
    label: "天",
    value: "days",
  },
]
const rules = {
  every: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(t("Form.required"))
      }
      return true
    },
  },
  crontab: {
    required: true,
    trigger: ["blur", "input"],
    validator(rule: FormItemRule, value: string) {
      if (crontabs.value.length < 5) {
        return new Error("输入值不能为空")
      }
      return true
    },
  },
}

onMounted(() => {
  scheduledConfig.value.types = props.scheduledType
})
</script>
