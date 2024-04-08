<template>
    <div class="flex flex-1 flex-col">
        <div class="flex flex-row flex-1">
            <div v-if="!isMobile" class="flex-none min-w-1/5 default-bg">
                <rolesList />
            </div>
            <div v-else class="flex-none">
                <n-drawer
                    v-model:show="showSideDrawder"
                    :default-height="400"
                    :placement="'bottom'"
                >
                    <rolesList />
                </n-drawer>
            </div>

            <div class="flex flex-col flex-1 default-bg m:ml-2">
                <n-button
                    v-if="isMobile"
                    size="small"
                    @click="showSideDrawder = !showSideDrawder"
                >
                    <template #icon>
                        <n-icon class="text-info">
                            <MenuSharp />
                        </n-icon>
                    </template>
                </n-button>
                <rolesContext
                    v-if="rolesListData.length"
                    class="flex-1 flex-grow"
                />
                <div
                    v-else
                    class="flex flex-1 flex-grow justify-center items-center"
                >
                    <n-empty :description="t('status.empty')" size="huge" />
                </div>
            </div>
        </div>
        <rolesModal />
    </div>
</template>

<script lang="ts" setup>
import rolesList from "./rolesList.vue"
import rolesModal from "./rolesModal.vue"
import rolesContext from "./rolesContext.vue"
import { storeToRefs } from "pinia"
import usewebSiteStore from "@/store/modules/appWebSite"
import { NDrawer, NButton, NIcon, NEmpty } from "naive-ui"
import { MenuSharp } from "@vicons/ionicons5"
import { onMounted, ref } from "vue"
import { initRolesList, rolesListData } from "./rolesHandle"
import { useI18n } from "vue-i18n"

defineOptions({
    name: "authRoles",
})

const { t } = useI18n()

const { isMobile } = storeToRefs(usewebSiteStore())

const showSideDrawder = ref<boolean>(false)

//初始化角色列表
onMounted(async () => {
    await initRolesList()
})
</script>
@/pages/auth/roles/useRolesPageHook
