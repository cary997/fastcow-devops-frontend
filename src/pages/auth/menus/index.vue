<template>
    <div class="flex flex-col flex-1">
        <div class="flex flex-row flex-1">
            <div v-if="!isMobile" class="flex-none min-w-1/4 default-bg">
                <menusTree />
            </div>
            <div v-else class="flex-none default-bg">
                <n-drawer
                    v-model:show="showSideDrawder"
                    :default-height="400"
                    :placement="'bottom'"
                >
                    <menusTree />
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
                <div
                    v-if="!menusList.length && formDisabled"
                    class="flex flex-1 flex-grow justify-center items-center"
                >
                    <n-empty :description="t('status.empty')" size="huge" />
                </div>
                <div v-else class="flex flex-1 flex-grow">
                    <menusForm />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import menusTree from "./menusTree.vue"
import menusForm from "./menusForm.vue"
import { storeToRefs } from "pinia"
import usewebSiteStore from "@/store/modules/appWebSite"
import { onMounted, ref } from "vue"
import { NDrawer, NButton, NIcon, NEmpty } from "naive-ui"
import { MenuSharp } from "@vicons/ionicons5"
import {
    menusList,
    formDisabled,
    initMenuList,
} from "@/hooks/auth/useMenusPageHook"
import { useI18n } from "vue-i18n"

defineOptions({
    name: "authMenus",
})
const { t } = useI18n()

const { isMobile } = storeToRefs(usewebSiteStore())

const showSideDrawder = ref<boolean>(false)

//初始化菜单数据
onMounted(async () => {
    await initMenuList()
})
</script>
