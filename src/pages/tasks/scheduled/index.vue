<template>
  <div class="flex flex-1 flex-col space-y-2">
    <div class="flex-none">
      <n-card style="background-color: transparent" :bordered="false">
        <template #header>
          <div class="flex flex-row items-center">
            <span class="relative flex h-5 w-5">
              <span
                style="animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75"
              />

              <span class="relative inline-flex h-5 w-5 rounded-full">
                <NIcon
                  :component="AccessTimeFilledRound"
                  class="text-primary"
                />
              </span>
            </span>
            <span class="ml-2 text-lg font-medium leading-6"> 计划任务 </span>
            <span class="ml-4 w-14"
              ><n-input-number
                placeholder=""
                v-model:value="inputPeriodic"
                :min="1"
                :max="366"
                size="tiny"
                :show-button="false"
                @keyup.enter="handleSearch"
                @blur="handleSearch"
              >
                <template #suffix> 天 </template>
              </n-input-number>
            </span>
          </div>
        </template>
        <div class="flex flex-row space-x-4">

            <stat
              class="flex-1 text-primary"
              title="次数统计"
              :value="`${historyStatistics.exec_count}次`"
              :desc="`${periodic}天内 - 执行任务总次数`"
              :loading="loading"
            />

          <stat
            class="flex-1 text-primary"
            title="正在执行"
            :value="`${historyStatistics.exec_running_count}`"
            desc="当前 - 正在执行的任务数量"
            :loading="loading"
          />

          <stat
            class="flex-1 text-primary"
            title="结果统计"
            :value="`${successRate}% - ${failRate}%`"
            :desc="`${periodic}天内 - 成功任务数:${historyStatistics.exec_success_count} 失败任务数:${historyStatistics.exec_fail_count}`"
            :loading="loading"
          />
          <stat
            class="flex-1 text-primary"
            title="耗时统计(平均)"
            :value="`${historyStatistics.exec_duration_avg}s`"
            :desc="`${periodic}天内 - 最长耗时:${historyStatistics.exec_duration_max}s 最短耗时:${historyStatistics.exec_duration_min}s`"
            :loading="loading"
          />
        </div>
      </n-card>
    </div>
    <div class="flex-1">
      <n-card style="background-color: transparent" :bordered="false">
        <n-tabs type="line" animated>
          <n-tab-pane name="interval" tab="间隔任务" display-directive="if">
            <scheduledTable scheduled-type="interval" />
          </n-tab-pane>
          <n-tab-pane name="crontab" tab="定时任务" display-directive="if">
            <scheduledTable scheduled-type="crontab" />
          </n-tab-pane>
          <n-tab-pane name="system" tab="系统默认" display-directive="if">
            <scheduledTable scheduled-type="system" />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NCard, NIcon, NInputNumber, NTabPane, NTabs } from "naive-ui"
import { computed, onMounted, ref, toRaw, unref } from "vue"

import { HistoryStatisticsResult } from "@/api/tasks/execution"
import { AccessTimeFilledRound } from "@vicons/material"

import { getHistoryStatisticsHandle } from "./extend"
import scheduledTable from "./scheduledTable.vue"

const periodic = ref(7)
const inputPeriodic = ref(7)
const loading = ref(false)
const historyStatistics = ref<HistoryStatisticsResult>({})
const successRate = computed(() => {
  const num =
    (historyStatistics.value.exec_success_count /
      historyStatistics.value.exec_count) *
    100
  return num.toFixed(2)
})
const failRate = computed(() => {
  const num =
    (historyStatistics.value.exec_fail_count /
      historyStatistics.value.exec_count) *
    100
  return num.toFixed(2)
})
const handleSearch = async () => {
  loading.value = true
  if (inputPeriodic.value < 1 || inputPeriodic.value > 366) {
    window.$message.warning("请输入1-366之间的数字")
    loading.value = false
  } else if (inputPeriodic.value !== periodic.value) {
    if (inputPeriodic.value % 1 !== 0) {
      inputPeriodic.value = Math.round(inputPeriodic.value)
    }
    periodic.value = toRaw(unref(inputPeriodic.value))
    await getHistoryStatisticsHandle(periodic.value).then(res => {
      historyStatistics.value = res
      loading.value = false
    })
  } else { 
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  await getHistoryStatisticsHandle(periodic.value).then(res => {
    historyStatistics.value = res
    loading.value = false
  })
})
</script>
