<template>
  <div
    @click="handelClick('general')"
    :class="[
      'div-select m-1 ml-0 flex flex-none flex-row items-center default-bg justify-start space-x-2 p-4',
      clickStatus == 'general' ? 'div-checked rounded-r-none' : null,
    ]"
  >
    <span class="flex-1 font-semibold"> 常规配置</span>
    <span class="flex-1 text-xs opacity-75"> 通用默认配置，优化系统体验</span>
  </div>
  <div
    @click="handelClick('security')"
    :class="[
      'div-select m-1 ml-0 flex flex-none flex-row items-center default-bg justify-start space-x-2 p-4',
      clickStatus == 'security' ? 'div-checked rounded-r-none' : null,
    ]"
  >
    <span class="flex-1 font-semibold"> 安全配置</span>
    <span class="flex-1 text-xs opacity-75"> 系统安全配置，增强系统防护</span>
  </div>
  <div
    @click="handelClick('ldap')"
    :class="[
      'div-select m-1 ml-0 flex flex-none flex-row items-center default-bg justify-start space-x-2 p-4',
      clickStatus == 'ldap' ? 'div-checked rounded-r-none' : null,
    ]"
  >
    <span class="flex-1 font-semibold"> LDAP配置</span>
    <span class="flex-1 text-xs opacity-75"> LDAP配置，对接LDAP服务器</span>
  </div>
  <div
    @click="handelClick('channels')"
    :class="[
      'div-select m-1 ml-0 flex flex-none flex-row items-center default-bg justify-start space-x-2 p-4',
      clickStatus == 'channels' ? 'div-checked rounded-r-none' : null,
    ]"
  >
    <span class="flex-1 font-semibold"> 通知渠道</span>
    <span class="flex-1 text-xs opacity-75"> 通知渠道配置，发送系统通知</span>
  </div>
</template>

<script setup lang="ts">
import { saveDisable, saveLoading } from "./extend"

const title = defineModel("title")
const clickStatus = defineModel("clickStatus")

const handelClick = value => {
  if (value == "general") {
    title.value = "常规配置"
  }
  if (value == "security") {
    title.value = "安全配置"
  }
  if (value == "ldap") {
    title.value = "LDAP配置"
  }
  if (value == "channels") {
    title.value = "通知渠道"
  }
  clickStatus.value = value
  saveDisable.value = false
  saveLoading.value = false
}
</script>
