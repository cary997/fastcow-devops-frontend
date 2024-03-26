<template>
    <n-tabs type="line" :placement="tabsPlacement" animated>
        <n-tab-pane name="email" tab="邮件">
            <mailSettings v-model="data" />
        </n-tab-pane>
        <n-tab-pane name="dingtalk" tab="钉钉"> 待开发 </n-tab-pane>
        <n-tab-pane name="feishu" tab="飞书"> 待开发 </n-tab-pane>
        <n-tab-pane name="wecom" tab="企业微信"> 待开发 </n-tab-pane>
    </n-tabs>
</template>

<script lang="ts" setup>
import { channelsInfo } from "@/api/system/type"
import { PropType, computed } from "vue"
import { NTabs, NTabPane } from "naive-ui"
import usewebSiteStore from "@/store/modules/appWebSite"
import { storeToRefs } from "pinia"
import mailSettings from "./mailSettings.vue"
const { isMobile } = storeToRefs(usewebSiteStore())
//双向绑定
const data = defineModel({
    type: Object as PropType<channelsInfo>,
})

const tabsPlacement = computed(() => {
    return isMobile.value ? "top" : "left"
})
</script>
