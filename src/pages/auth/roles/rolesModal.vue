<template>
    <n-modal
        v-model:show="showRolesModal"
        preset="card"
        :title="t('rolesPage.rolesInfo')"
        :style="{ 'max-width': '36rem' }"
        size="medium"
        :bordered="false"
        :closable="false"
        :close-on-esc="false"
        :mask-closable="false"
        :segmented="{
            content: true,
            action: true,
        }"
    >
        <n-split
            :direction="isMobile ? 'vertical' : 'horizontal'"
            style="min-height: 50dvh"
            :default-size="0.4"
            :max="0.7"
            :min="0.3"
        >
            <template #1>
                <n-form
                    label-placement="top"
                    ref="formRef"
                    size="small"
                    :model="rolesData"
                    :rules="rolesFromRules"
                    label-width="auto"
                >
                    <n-form-item
                        path="name"
                        :label="t('rolesPage.rolesFormName')"
                    >
                        <n-input
                            clearable
                            autosize
                            style="min-width: 80%"
                            v-model:value="rolesData.name"
                        />
                    </n-form-item>
                    <n-form-item
                        path="nickname"
                        :label="t('rolesPage.rolesFormNickName')"
                    >
                        <n-input
                            clearable
                            autosize
                            style="min-width: 80%"
                            v-model:value="rolesData.nickname"
                        />
                    </n-form-item>
                    <n-form-item
                        path="desc"
                        :label="t('rolesPage.rolesFormDesc')"
                    >
                        <n-input
                            clearable
                            autosize
                            style="min-width: 80%"
                            v-model:value="rolesData.desc"
                        />
                    </n-form-item>
                    <n-form-item
                        path="role_status"
                        :label="t('rolesPage.rolesFormStatus')"
                    >
                        <n-switch
                            v-model:value="rolesData.role_status"
                            size="small"
                            :round="false"
                        >
                            <template #checked>
                                {{ $t("status.enable") }}
                            </template>
                            <template #unchecked>
                                {{ $t("status.disable") }}
                            </template>
                        </n-switch>
                    </n-form-item>
                </n-form>
            </template>
            <template #2>
                <n-scrollbar style="max-height: 50dvh" x-scrollable>
                    <rolesMenusSelect />
                </n-scrollbar>
            </template>
        </n-split>

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
                    type="primary"
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
    NButton,
    NModal,
    FormInst,
    NForm,
    NFormItem,
    NInput,
    NSwitch,
    NSplit,
    NScrollbar,
} from "naive-ui"

import {
    currentRolesData,
    addRolesHandle,
    refreshRolesList,
    showRolesModal,
    setRolesHandle,
    rolesData,
} from "./rolesHandle"
import { useI18n } from "vue-i18n"
import { rolesFromRules } from "./extend"
import { clone } from "@pureadmin/utils"
import rolesMenusSelect from "./rolesMenusSelect.vue"
import { storeToRefs } from "pinia"
import usewebSiteStore from "@/store/modules/appWebSite"
import { delObjectProps } from "@/utils/tools"
import { ref } from "vue"

const { t } = useI18n()
const { isMobile } = storeToRefs(usewebSiteStore())

//用于validate验证结果
const formRef = ref<FormInst | null>(null)

//提交表单内容
const handleSubmitClick = () => {
    formRef.value?.validate(errors => {
        if (!errors) {
            //如果表单数据不包含ID则为新建，包含则为更新
            if (!rolesData.value.id) {
                //创建角色
                addRolesHandle(rolesData.value).then(async res => {
                    await refreshRolesList()
                    rolesData.value = res
                    currentRolesData.value = res
                    showRolesModal.value = false
                })
            } else {
                let key = rolesData.value.id
                let data = delObjectProps(clone(rolesData.value, true), [
                    "id",
                    "create_at",
                    "update_at",
                    "user_count",
                    "roles_users",
                ])
                //更新角色
                setRolesHandle(key, data).then(async res => {
                    //重新请求刷新角色列表
                    await refreshRolesList()
                    rolesData.value = res
                    currentRolesData.value = res
                    showRolesModal.value = false
                })
            }
        }
    })
}
//取消事件
const handleCancelClick = () => {
    formRef.value?.restoreValidation()
    showRolesModal.value = false
    if (currentRolesData.value) {
        rolesData.value = clone(currentRolesData.value, true)
    }
}
</script>

<style scoped></style>
@/pages/auth/roles/useRolesPageHook
