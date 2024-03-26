<template>
    <n-tabs type="line" :placement="tabsPlacement" animated>
        <n-tab-pane name="email" tab="连接配置">
            <ldapConfig v-model="data.config" />
        </n-tab-pane>
        <n-tab-pane name="dingtalk" tab="同步配置">
            <ldapSync v-model="data" />
        </n-tab-pane>
    </n-tabs>
</template>

<script lang="ts" setup>
import { ldapInfo } from "@/api/system/type"
import { PropType, computed } from "vue"
import { NTabs, NTabPane } from "naive-ui"
import usewebSiteStore from "@/store/modules/appWebSite"
import { storeToRefs } from "pinia"
import ldapConfig from "./ldapConfig.vue"
import ldapSync from "./ldapSync.vue"

const { isMobile } = storeToRefs(usewebSiteStore())
//双向绑定
const data = defineModel({
    type: Object as PropType<ldapInfo>,
})

const tabsPlacement = computed(() => {
    return isMobile.value ? "top" : "left"
})
</script>
