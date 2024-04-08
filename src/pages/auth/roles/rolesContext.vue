<template>
    <n-space vertical>
        <n-spin :show="loadingRef">
            <n-card
                :title="currentRolesData.nickname"
                :bordered="false"
                content-style="padding: 0;"
            >
                <template #header-extra>
                    <div class="flex flex-row space-x-4">
                        <n-tag strong :bordered="false">
                            {{ $t("status.userCont") }}:
                            {{ currentRolesData.user_count }}
                        </n-tag>

                        <Auth value="auth_roles_del">
                            <n-button
                                v-show="isSuperAdmin"
                                size="small"
                                type="error"
                                @click="handleDelClick"
                            >
                                {{ $t("action.delete") }}
                            </n-button>
                        </Auth>
                        <Auth value="auth_roles_set">
                            <n-button
                                v-show="isSuperAdmin"
                                size="small"
                                type="primary"
                                @click="handleEditClick"
                            >
                                {{ $t("action.edit") }}
                            </n-button>
                        </Auth>
                    </div>
                </template>

                <n-descriptions
                    :label-placement="isMobile ? 'top' : 'left'"
                    label-align="center"
                    :column="3"
                    bordered
                    class="pt-5"
                >
                    <n-descriptions-item :label="t('rolesPage.rolesFormName')">
                        {{ currentRolesData.name }}
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('rolesPage.rolesFormNickName')"
                    >
                        {{ currentRolesData.nickname }}
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('rolesPage.rolesFormStatus')"
                    >
                        {{
                            currentRolesData.role_status
                                ? $t("status.enable")
                                : $t("status.disable")
                        }}
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('rolesPage.rolesFormDesc')"
                        :span="3"
                    >
                        <span class="text-primary">
                            {{ currentRolesData.desc }}
                        </span>
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('action.create_at')"
                        :span="1.5"
                    >
                        {{ timestampFormat(currentRolesData.create_at) }}
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('action.update_at')"
                        :span="1.5"
                    >
                        {{ timestampFormat(currentRolesData.update_at) }}
                    </n-descriptions-item>
                    <n-descriptions-item
                        :label="t('rolesPage.rolesAccessPermission')"
                        :span="3"
                    >
                        <n-scrollbar style="max-height: 540px">
                            <div
                                class="flex flex-row flex-1 justify-center items-center"
                            >
                                <rolesMenusSelect />
                            </div>
                        </n-scrollbar>
                    </n-descriptions-item>
                </n-descriptions>
            </n-card>
        </n-spin>
    </n-space>
</template>

<script lang="ts" setup>
import {
    NTag,
    NCard,
    NButton,
    NDescriptions,
    NDescriptionsItem,
    NScrollbar,
    NSpin,
    NSpace,
} from "naive-ui"
import {
    showRolesModal,
    currentRolesData,
    delRolesHandle,
    rolesListData,
    loadingRef,
    rolesData,
} from "./rolesHandle"
import { timestampFormat } from "@/utils/tools"
import rolesMenusSelect from "./rolesMenusSelect.vue"
import { clone } from "@pureadmin/utils"
import { useI18n } from "vue-i18n"
import { computed } from "vue"
import { storeToRefs } from "pinia"
import usewebSiteStore from "@/store/modules/appWebSite"

const { t } = useI18n()
const { isMobile } = storeToRefs(usewebSiteStore())

const isSuperAdmin = computed(() => {
    return currentRolesData.value.id === 1 ? false : true
})

//编辑事件
const handleEditClick = () => {
    showRolesModal.value = true
}

//删除事件
const handleDelClick = () => {
    window.$dialog.warning({
        title: t("title.warning"),
        content:
            t("rolesPage.rolesDeleteMsg") +
            "—— " +
            currentRolesData.value.nickname,
        positiveText: t("action.confirm"),
        negativeText: t("action.cancel"),
        onPositiveClick: () => {
            let currentIndex = rolesListData.value.findIndex(
                v => v.id === currentRolesData.value.id,
            )
            delRolesHandle(currentRolesData.value.id)
                .then(() => {
                    loadingRef.value = true
                    rolesListData.value.splice(currentIndex, 1)
                    let newIndex =
                        currentIndex > 0 && rolesListData.value.length
                            ? currentIndex - 1
                            : currentIndex
                    if (newIndex !== -1) {
                        currentRolesData.value = rolesListData.value[newIndex]
                        rolesData.value = clone(currentRolesData.value, true)
                    }
                })
                .finally(() => {
                    loadingRef.value = false
                })
        },
    })
}
</script>
@/pages/auth/roles/useRolesPageHook
