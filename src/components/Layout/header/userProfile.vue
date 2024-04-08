<template>
    <n-modal
        v-model:show="showProfileModal"
        preset="card"
        :title="t('headers.userProfile')"
        :style="{ 'max-width': '25rem' }"
        content-style="padding: 0;"
        size="medium"
        @after-leave="afterLeaveHandel"
        :bordered="true"
        :segmented="{
            action: true,
        }"
    >
        <n-descriptions label-placement="left" :column="1" bordered>
            <n-descriptions-item :label="t('usersPage.tableData.id')">
                {{ currentUser.id }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.username')">
                {{ currentUser.username }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.nickname')">
                {{ currentUser.nickname }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.email')">
                <div v-if="!showInpt">
                    {{ currentUser.email }}
                    <NButton
                        type="info"
                        size="tiny"
                        @click="handelEditClick"
                        text
                    >
                        <template #icon>
                            <n-icon>
                                <Edit20Regular />
                            </n-icon>
                        </template>
                    </NButton>
                </div>
                <n-form-item
                    v-else
                    label-placement="left"
                    :show-feedback="!emailRuleValue"
                    :rule="emailRule"
                >
                    <n-input
                        size="small"
                        :loading="inputLoading"
                        v-model:value="inputValue.email"
                    ></n-input>
                </n-form-item>
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.phone')">
                <div v-if="!showInpt">
                    {{ currentUser.phone }}
                    <NButton
                        type="info"
                        size="tiny"
                        text
                        @click="handelEditClick"
                    >
                        <template #icon>
                            <n-icon>
                                <Edit20Regular />
                            </n-icon>
                        </template>
                    </NButton>
                </div>
                <n-form-item
                    v-else
                    label-placement="left"
                    :show-feedback="!phoneRuleValue"
                    :rule="phoneRule"
                >
                    <n-input
                        size="small"
                        :loading="inputLoading"
                        v-model:value="inputValue.phone"
                    ></n-input>
                </n-form-item>
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.type')">
                {{
                    currentUser.user_type == 1
                        ? $t("usersPage.tableData.local")
                        : "ldap"
                }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.roles')">
                <div v-for="roles in currentUser.roles">
                    <n-tag
                        type="info"
                        :round="true"
                        size="small"
                        :bordered="false"
                        class="mr-1"
                    >
                        {{ roles.nickname }}
                    </n-tag>
                    <br />
                </div>
            </n-descriptions-item>
            <n-descriptions-item :label="t('usersPage.tableData.status')">
                {{
                    currentUser.user_status
                        ? $t("status.enable")
                        : $t("status.disable")
                }}
            </n-descriptions-item>
        </n-descriptions>

        <template #action>
            <div
                v-if="emailRuleValue && phoneRuleValue && showInpt"
                class="flex justify-end"
            >
                <n-button size="small" type="success" @click="handleSaveClick">
                    {{ $t("action.save") }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts" setup>
import {
    NDescriptions,
    NDescriptionsItem,
    NModal,
    NTag,
    NButton,
    NIcon,
    NInput,
    NFormItem,
} from "naive-ui"
import { Edit20Regular } from "@vicons/fluent"
import { showProfileModal, currentUser } from "."
import { useI18n } from "vue-i18n"

import { ref } from "vue"
import { isEmailPattenrn, isMobilePattern } from "@/utils/regularTools"
import { setUsersHandle } from "@/hooks/useAuthHook"

const { t } = useI18n()
const inputValue = ref({
    phone: null,
    email: null,
})
const inputLoading = ref<boolean>(false)
const showInpt = ref<boolean>(false)
const handelEditClick = () => {
    inputValue.value.email = currentUser.value.email
    inputValue.value.phone = currentUser.value.phone
    showInpt.value = true
}

const afterLeaveHandel = () => {
    inputValue.value.email = null
    inputValue.value.phone = null
    showInpt.value = false
}

//表单验证
const emailRuleValue = ref<boolean>(true)
const emailRule = {
    trigger: ["input", "blur"],
    validator() {
        if (!inputValue.value.email) {
            emailRuleValue.value = false
            return new Error(t("Form.required"))
        } else if (!isEmailPattenrn.test(inputValue.value.email)) {
            emailRuleValue.value = false
            return Error(t("Form.format_error"))
        } else {
            emailRuleValue.value = true
        }
    },
}
const phoneRuleValue = ref<boolean>(true)
const phoneRule = {
    trigger: ["input", "blur"],
    validator() {
        if (!inputValue.value.phone) {
            phoneRuleValue.value = false
            return new Error(t("Form.required"))
        } else if (!isMobilePattern.test(inputValue.value.phone)) {
            phoneRuleValue.value = false
            return new Error(t("Form.format_error"))
        } else {
            phoneRuleValue.value = true
        }
    },
}

//保存
const handleSaveClick = () => {
    inputLoading.value = true
    setUsersHandle(currentUser.value.id, inputValue.value).then(res => {
        currentUser.value.email = res.email
        currentUser.value.phone = res.phone
        inputLoading.value = false
        showInpt.value = false
    })
}
</script>
@/pages/auth/users/useUsersPageHook
