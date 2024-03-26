<template>
    <n-modal
        v-model:show="showPasswordModal"
        preset="card"
        :title="t('headers.changePwd')"
        :style="{ 'max-width': '25rem' }"
        size="medium"
        :closable="false"
        :close-on-esc="false"
        :mask-closable="false"
        :segmented="{
            content: true,
            action: true,
        }"
    >
        <n-form
            ref="formRef"
            label-placement="left"
            size="small"
            label-width="auto"
            :model="formValue"
            :rules="rules"
        >
            <n-form-item
                :label="t('headers.changePwdModal.pwdLabel')"
                path="password"
            >
                <n-input
                    v-model:value="formValue.password"
                    type="password"
                    show-password-on="click"
                    clearable
                />
            </n-form-item>
            <n-form-item
                :label="t('headers.changePwdModal.repwdLabel')"
                path="repassword"
            >
                <n-input
                    v-model:value="formValue.repassword"
                    type="password"
                    show-password-on="click"
                    clearable
                />
            </n-form-item>
        </n-form>
        <template #action>
            <div class="flex justify-end space-x-4">
                <n-button
                    size="small"
                    type="warning"
                    @click="handleCancelClick"
                >
                    {{ $t("action.cancel") }}
                </n-button>
                <n-button
                    size="small"
                    type="success"
                    @click="handleSubmitClick"
                >
                    {{ $t("action.submit") }}
                </n-button>
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts" setup>
import {
    FormInst,
    FormItemRule,
    FormRules,
    NModal,
    NForm,
    NFormItem,
    NButton,
    NInput,
} from "naive-ui"
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"
import { currentUser, showPasswordModal } from "."
import { setUsersPasswordHandle } from "@/hooks/auth/useUsersPageHook"
import { passwordPattern } from "@/utils/regularTools"

const { t } = useI18n()

const formRef = ref<FormInst | null>(null)
const formValue = reactive({
    user_id: null,
    password: null,
    repassword: null,
})

const rules: FormRules = {
    password: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error(t("Form.required"))
            } else if (!passwordPattern.test(value)) {
                return new Error(t("headers.changePwdModal.pwdErrorMsg"))
            }
            return true
        },
    },
    repassword: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error(t("Form.required"))
            } else if (!passwordPattern.test(value)) {
                return new Error(t("headers.changePwdModal.pwdErrorMsg"))
            } else if (value != formValue.password) {
                return new Error(t("headers.changePwdModal.repwdErrorMsg"))
            }
            return true
        },
    },
}

const handleSubmitClick = () => {
    formRef.value?.validate(async errors => {
        if (!errors) {
            formValue.user_id = currentUser.value.id
            await setUsersPasswordHandle(formValue).then(() => {
                showPasswordModal.value = false
                formValue.password = null
                formValue.repassword = null
                window.$dialog.success({
                    title: t("title.success"),
                    content: t("headers.changePwdModal.changePwdMsg"),
                    positiveText: t("action.confirm"),
                })
            })
        }
    })
}
//取消事件
const handleCancelClick = () => {
    formRef.value.restoreValidation()
    showPasswordModal.value = false
    formValue.password = null
    formValue.repassword = null
}
</script>
