<template>
    <div class="flex flex-row space-x-8">
        <n-form
            ref="formRef"
            :model="qureyParams"
            size="small"
            label-placement="left"
            label-width="auto"
            class="mt-4 ml-4"
        >
            <n-grid :cols="8" :x-gap="12" responsive="screen" item-responsive>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.username')"
                    path="username"
                >
                    <n-input clearable v-model:value="qureyParams.username" />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.nickname')"
                    path="nickname"
                >
                    <n-input clearable v-model:value="qureyParams.nickname" />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.phone')"
                    path="phone"
                >
                    <n-input clearable v-model:value="qureyParams.phone" />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.email')"
                    path="email"
                >
                    <n-input clearable v-model:value="qureyParams.email" />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.type')"
                    path="user_type"
                >
                    <n-select
                        v-model:value="qureyParams.user_type"
                        :options="usersOptions"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.status')"
                    path="user_status"
                >
                    <n-select
                        :options="statusOptions"
                        v-model:value="userStatus"
                        @update:value="userStatusUpdateValue"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="4 m:2"
                    :label="t('usersPage.tableData.roles')"
                    path="user_type"
                >
                    <n-select
                        v-model:value="qureyParams.roles"
                        label-field="nickname"
                        value-field="id"
                        clearable
                        :options="rolesListData"
                    />
                </n-form-item-gi>
            </n-grid>
        </n-form>
        <div class="flex-none flex flex-col space-y-2 justify-center">
            <NButton type="primary" size="tiny" @click="handleFitterUsers">
                <template #icon>
                    <n-icon>
                        <Search />
                    </n-icon>
                </template>
                {{ $t("action.search") }}
            </NButton>
            <NButton type="info" size="tiny" @click="handleResetFitter">
                <template #icon>
                    <n-icon>
                        <Reset />
                    </n-icon>
                </template>
                {{ $t("action.reset") }}
            </NButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    defaultQureyParams,
    queryUsersTablesHandle,
    qureyParams,
} from "@/hooks/auth/useUsersPageHook"
import {
    NForm,
    FormInst,
    NGrid,
    NFormItemGi,
    NInput,
    NSelect,
    NButton,
    NIcon,
} from "naive-ui"
import { ref } from "vue"
import { rolesListData } from "@/hooks/auth/useRolesPageHook"
import { usersOptions, statusOptions } from "./extend"
import { Search, Reset } from "@vicons/carbon"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const formRef = ref<FormInst | null>(null)

const userStatus = ref()

const userStatusUpdateValue = (value: number) => {
    if (value === 1) {
        qureyParams.value.user_status = true
    } else if (value === 2) {
        qureyParams.value.user_status = false
    } else {
        qureyParams.value.user_status = null
    }
}

/**搜索 */
const handleFitterUsers = async () => {
    qureyParams.value.page = 1
    await queryUsersTablesHandle(qureyParams.value)
}
/**重置 */
const handleResetFitter = () => {
    userStatus.value = null
    qureyParams.value = { ...defaultQureyParams }
}
</script>
