<template>
  <div class="default-bg flex flex-1">
    <n-layout has-sider>
      <n-layout-sider bordered class="pb-6 pt-6">
        <div
          @click="handleClick('hosts')"
          :class="[
            'div-select flex flex-row items-center space-x-2 pl-10 text-center',
            currentOptions == 'hosts' ? 'div-checked' : null,
          ]"
        >
          <NIcon :size="20"> <CloudServerOutlined /> </NIcon>
          <span>主机字段</span>
        </div>
        <div
          @click="handleClick('apps')"
          :class="[
            'div-select flex flex-row items-center space-x-2 pl-10 text-center',
            currentOptions == 'apps' ? 'div-checked' : null,
          ]"
        >
          <NIcon :size="20"> <Apps20Filled /> </NIcon>
          <span>应用字段</span>
        </div>
      </n-layout-sider>
      <n-layout>
        <n-layout-content content-style="padding: 24px;">
          <div class="p-2">
            <fieldsTables :option="currentOptions" />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
import { NIcon, NLayout, NLayoutContent, NLayoutSider } from "naive-ui"
import { CloudServerOutlined } from "@vicons/antd"
import { Apps20Filled } from "@vicons/fluent"

import { currentOptions } from "./extend"
import fieldsTables from "./fieldsTables.vue"

const handleClick = (value: string) => {
  currentOptions.value = value
}
</script>
