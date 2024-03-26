<template>
    <div
        @click="handelClick('general')"
        :class="[
            'flex-none flex flex-row justify-start items-center space-x-2 p-4 m-1 ml-0 default-bg hover:bg-base-300 active:bg-base-100',
            clickStatus == 'general'
                ? 'border-solid border-0 rounded-r-none border-r-4 border-info'
                : null,
        ]"
    >
        <span class="flex-1 font-semibold"> 常规配置</span>
        <span class="flex-1 text-xs opacity-75">
            通用默认配置，优化系统体验</span
        >
    </div>
    <div
        @click="handelClick('security')"
        :class="[
            'flex-none flex flex-row justify-start items-center space-x-2 p-4 m-1 ml-0 default-bg hover:bg-base-300 active:bg-base-100',
            clickStatus == 'security'
                ? 'border-solid border-0 rounded-r-none border-r-4 border-info'
                : null,
        ]"
    >
        <span class="flex-1 font-semibold"> 安全配置</span>
        <span class="flex-1 text-xs opacity-75">
            系统安全配置，增强系统防护</span
        >
    </div>
    <div
        @click="handelClick('ldap')"
        :class="[
            'flex-none flex flex-row justify-start items-center space-x-2 p-4 m-1 ml-0 default-bg hover:bg-base-300 active:bg-base-100',
            clickStatus == 'ldap'
                ? 'border-solid border-0 rounded-r-none border-r-4 border-info'
                : null,
        ]"
    >
        <span class="flex-1 font-semibold"> LDAP配置</span>
        <span class="flex-1 text-xs opacity-75"> LDAP配置，对接LDAP服务器</span>
    </div>
    <div
        @click="handelClick('channels')"
        :class="[
            'flex-none flex flex-row justify-start items-center space-x-2 p-4 m-1 ml-0 default-bg hover:bg-base-300 active:bg-base-100',
            clickStatus == 'channels'
                ? 'border-solid border-0 rounded-r-none border-r-4 border-info'
                : null,
        ]"
    >
        <span class="flex-1 font-semibold"> 通知渠道</span>
        <span class="flex-1 text-xs opacity-75">
            通知渠道配置，发送系统通知</span
        >
    </div>
</template>

<script setup lang="ts">
import { saveLoading, saveDisable } from "./extend"

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
