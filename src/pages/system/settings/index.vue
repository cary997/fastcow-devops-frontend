<template>
    <div class="flex-1 flex flex-col">
        <n-button
            v-if="isMobile"
            size="small"
            @click="showSideDrawder = !showSideDrawder"
            class="default-bg"
        >
            <template #icon>
                <n-icon class="text-info">
                    <MenuSharp />
                </n-icon>
            </template>
        </n-button>
        <div class="flex-1 flex flex-row">
            <div v-if="!isMobile" class="flex-none w-1/5">
                <settingsTabs
                    v-model:clickStatus="clickStatus"
                    v-model:title="title"
                />
            </div>
            <div v-else class="flex-none">
                <n-drawer
                    v-model:show="showSideDrawder"
                    :default-height="400"
                    :placement="'bottom'"
                >
                    <settingsTabs
                        v-model:clickStatus="clickStatus"
                        v-model:title="title"
                    />
                </n-drawer>
            </div>

            <div class="flex-1 default-bg m:ml-2">
                <div :class="isMobile ? null : 'p-10'">
                    <n-card :title="title" :bordered="false">
                        <template #header-extra>
                            <Auth value="system_settings_set">
                                <NButton
                                    type="info"
                                    :disabled="saveDisable"
                                    :loading="saveLoading"
                                    @click="handelSaveClick"
                                    >{{ $t("action.save") }}</NButton
                                >
                            </Auth>
                        </template>
                        <n-divider />
                        <generalSettings
                            v-if="clickStatus == 'general'"
                            v-model="general"
                        />
                        <ldapSettings
                            v-if="clickStatus == 'ldap'"
                            v-model="ldap"
                        />
                        <securitySettings
                            v-if="clickStatus == 'security'"
                            v-model="security"
                        />
                        <channelsSettings
                            v-if="clickStatus == 'channels'"
                            v-model="channels"
                        />
                    </n-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, unref, toRaw, onMounted } from "vue"
import { NDrawer, NButton, NIcon, NDivider, NCard } from "naive-ui"
import { MenuSharp } from "@vicons/ionicons5"
import {
    setSystemSettingsHandle,
    saveLoading,
    saveDisable,
} from "./extend"
import usewebSiteStore from "@/store/modules/appWebSite"
import { storeToRefs } from "pinia"
import generalSettings from "./generalSettings/index.vue"
import securitySettings from "./securitySettings/index.vue"
import channelsSettings from "./channelsSettings/index.vue"
import ldapSettings from "./ldapSettings/index.vue"
import settingsTabs from "./settingsTabs.vue"
import useSettingsStore from "@/store/modules/appSettings"
defineOptions({
    name: "systemSettings",
})

const { isMobile } = storeToRefs(usewebSiteStore())
const { general, ldap, security, channels } = storeToRefs(useSettingsStore())
const showSideDrawder = ref(false)
const title = ref("常规设置")
const clickStatus = ref("general")

const handelSaveClick = async () => {
    saveDisable.value = true
    saveLoading.value = true
    let reqData = null
    if (clickStatus.value == "general") {
        const data = toRaw(unref(general.value))
        reqData = { general: data }
    }
    if (clickStatus.value == "ldap") {
        const data = toRaw(unref(ldap.value))
        reqData = { ldap: data }
    }
    if (clickStatus.value == "security") {
        const data = toRaw(unref(security.value))
        reqData = { security: data }
    }
    if (clickStatus.value == "channels") {
        const data = toRaw(unref(channels.value))
        reqData = { channels: data }
    }
    await setSystemSettingsHandle(reqData)
        .then(res => {
            useSettingsStore().updateSettings(res)
        })
        .finally(() => {
            saveDisable.value = false
            saveLoading.value = false
        })
}
</script>
