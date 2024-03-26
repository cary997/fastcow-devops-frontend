<template>
    <n-form
        v-if="showUsersModal"
        ref="formRef"
        :model="usersData"
        :rules="rules"
        size="small"
        label-placement="left"
        label-width="auto"
        class="m-4"
    >
        <n-grid cols="6 m:12" :x-gap="12" responsive="screen" item-responsive>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.username')"
                path="username"
            >
                <n-input
                    clearable
                    :disabled="userSetStatus"
                    v-model:value="usersData.username"
                />
            </n-form-item-gi>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.nickname')"
                path="nickname"
            >
                <n-input clearable v-model:value="usersData.nickname" />
            </n-form-item-gi>
            <n-form-item-gi
                v-if="!userSetStatus"
                :span="6"
                :label="t('usersPage.tableData.password')"
                path="password"
            >
                <n-input
                    type="password"
                    :disabled="true"
                    v-model:value="usersData.password"
                />
            </n-form-item-gi>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.email')"
                path="email"
            >
                <n-input clearable v-model:value="usersData.email" />
            </n-form-item-gi>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.phone')"
                path="phone"
            >
                <n-input clearable v-model:value="usersData.phone" />
            </n-form-item-gi>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.type')"
                path="meta.menu_type"
            >
                <n-select
                    v-model:value="usersData.user_type"
                    :options="usersOptions"
                />
            </n-form-item-gi>
            <n-form-item-gi
                :span="12"
                :label="t('usersPage.tableData.roles')"
                path="roles"
            >
                <n-select
                    multiple
                    v-model:value="usersData.roles"
                    label-field="nickname"
                    value-field="id"
                    :options="rolesListData"
                />
            </n-form-item-gi>
            <n-form-item-gi
                :span="6"
                :label="t('usersPage.tableData.status')"
                path="user_status"
            >
                <n-switch
                    v-model:value="usersData.user_status"
                    size="small"
                    :round="false"
                >
                    <template #checked> {{ $t("status.enable") }} </template>
                    <template #unchecked> {{ $t("status.disable") }} </template>
                </n-switch>
            </n-form-item-gi>
        </n-grid>
    </n-form>
    <n-descriptions
        v-if="showUsersDrawer"
        label-placement="left"
        :column="1"
        bordered
    >
        <n-descriptions-item :label="t('action.create_at')">
            {{ timestampFormat(currentUsersData.create_at) }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('action.update_at')">
            {{ timestampFormat(currentUsersData.update_at) }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.id')">
            {{ currentUsersData.id }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.username')">
            {{ currentUsersData.username }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.nickname')">
            {{ currentUsersData.nickname }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.email')">
            {{ currentUsersData.email }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.phone')">
            {{ currentUsersData.phone }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.type')">
            {{
                currentUsersData.user_type == 1
                    ? $t("usersPage.tableData.local")
                    : "ldap"
            }}
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.roles')">
            <div v-for="key in currentUsersData.roles">
                <n-tag
                    :type="
                        rolesListData.find(r => r.id === key).role_status
                            ? 'primary'
                            : 'error'
                    "
                    :round="true"
                    size="small"
                    :bordered="false"
                    class="mr-1"
                >
                    {{ rolesListData.find(r => r.id == key).nickname }}
                </n-tag>
                <br />
            </div>
        </n-descriptions-item>
        <n-descriptions-item :label="t('usersPage.tableData.status')">
            {{
                usersData.user_status
                    ? $t("status.enable")
                    : $t("status.disable")
            }}
        </n-descriptions-item>
    </n-descriptions>
</template>

<script lang="ts" setup>
import {
    usersData,
    currentUsersData,
    usersRules,
    userSetStatus,
    usersOptions,
} from "./extend"
import {
    NForm,
    NGrid,
    NFormItemGi,
    NInput,
    NSelect,
    NSwitch,
    NTag,
    NDescriptions,
    NDescriptionsItem,
} from "naive-ui"
import {
    showUsersModal,
    usersFormRef,
    showUsersDrawer,
} from "@/hooks/auth/useUsersPageHook"
import { rolesListData } from "@/hooks/auth/useRolesPageHook"
import useSettingsStore from "@/store/modules/appSettings"
import { useI18n } from "vue-i18n"
import { timestampFormat } from "@/utils/tools"
import { onMounted } from "vue"
import { aesDecrypt } from "@/utils/aes"
const { t } = useI18n()
const rules = usersRules
const formRef = usersFormRef

onMounted(() => {
    usersData.value.password = aesDecrypt(
        useSettingsStore().general.user_default_password,
    )
})
</script>
