<template>
    <div class="flex flex-row space-x-2 items-center p-4 mb-0 rounded-t-lg">
        <n-statistic
            :label="t('status.enable')"
            :value="getRolesStatus(0, true)"
            :style="{ '--n-value-font-size': '15px' }"
            class="flex-1"
        />
        <n-statistic
            :label="t('status.disable')"
            :value="getRolesStatus(0, false)"
            :style="{ '--n-value-font-size': '15px' }"
            class="flex-1"
        />
        <div class="flex-1">
            <Auth value="auth_roles_add">
                <n-button
                    size="tiny"
                    :focusable="false"
                    @click="handleAddRoles"
                >
                    <template #icon>
                        <n-icon>
                            <CreateFilled />
                        </n-icon>
                    </template>
                    {{ $t("rolesPage.createRoles") }}
                </n-button>
            </Auth>
        </div>
    </div>

    <n-list bordered clickable show-divider>
        <n-list-item
            v-for="item in rolesListData"
            @click="handleRolesClick(item)"
            :class="[
                item.id == currentRolesData.id
                    ? 'border-solid border-0 rounded-r-none border-r-4 border-primary'
                    : 'default-bg',
                'hover:bg-base-300 ',
            ]"
        >
            <template #prefix>
                <n-icon
                    :component="UsersRoles"
                    :class="[
                        'animate-pulse',
                        item.role_status ? 'text-success' : 'text-error',
                    ]"
                />
            </template>
            {{ item.nickname }}
            <template #suffix>
                <n-icon
                    :component="CircleSmall24Filled"
                    :class="[
                        'animate-pulse',
                        item.role_status ? 'text-success' : 'text-error',
                    ]"
                />
            </template>
        </n-list-item>
    </n-list>
</template>

<script lang="ts" setup>
import { NList, NListItem, NButton, NStatistic, NIcon } from "naive-ui"
import {
    SupervisorAccountFilled as UsersRoles,
    CreateFilled,
} from "@vicons/material"
import { CircleSmall24Filled } from "@vicons/fluent"
import {
    currentRolesData,
    rolesListData,
    showRolesModal,
    getRolesStatus,
    rolesDefaultModalData,
    rolesData,
} from "@/hooks/auth/useRolesPageHook"
import { useI18n } from "vue-i18n"
import { rolesCreateRequest } from "@/api/auth/types"
import { clone } from "@pureadmin/utils"

const { t } = useI18n()
//新建角色回调
const handleAddRoles = () => {
    let clonerolesData = clone(rolesDefaultModalData, true)
    rolesData.value = clonerolesData
    showRolesModal.value = true
}

//列表项点击回调
const handleRolesClick = (data: rolesCreateRequest) => {
    currentRolesData.value = data
    rolesData.value = clone(currentRolesData.value, true)
}
</script>
