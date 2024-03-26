<template>
    <div class="flex flex-col items-center space-y-4">
        <n-form v-model:model="data" label-placement="left" label-width="auto">
            <n-form-item label="服务器" path="email.mail_server">
                <n-input
                    v-model:value="data.email.mail_server"
                    clearable
                    placeholder="smtp.example.com"
                />
                <n-input-number
                    v-model:value="data.email.mail_port"
                    :show-button="false"
                    placeholder="587"
                    class="ml-2 w-20"
                ></n-input-number>
            </n-form-item>
            <n-form-item label="用户名" path="email.mail_username">
                <n-input
                    v-model:value="data.email.mail_username"
                    clearable
                    placeholder="username"
                />
            </n-form-item>
            <n-form-item label="密码" path="email.mail_password">
                <n-input
                    v-model:value="data.email.mail_password"
                    type="password"
                    clearable
                    show-password-on="click"
                    placeholder="**********"
                    class="mr-2"
                />
                <show-password
                    v-if="data.email.mail_password"
                    :value="data.email.mail_password"
                ></show-password>
            </n-form-item>
            <n-form-item label="发件地址" path="email.mail_from">
                <n-input
                    v-model:value="data.email.mail_from"
                    clearable
                    placeholder="username"
                />
            </n-form-item>
            <n-form-item label="显示名称" path="email.mail_from_name">
                <n-input
                    v-model:value="data.email.mail_from_name"
                    clearable
                    placeholder="FastCow Devops"
                />
            </n-form-item>
            <n-form-item label="TLS连接" path="email.mail_start_tls">
                <n-switch v-model:value="data.email.mail_start_tls" />
            </n-form-item>
            <n-form-item label="TLS/SSL连接" path="email.mail_ssl">
                <n-switch v-model:value="data.email.mail_ssl" />
            </n-form-item>
            <n-form-item label="收件地址" path="testMail">
                <n-input
                    v-model:value="testMail"
                    clearable
                    placeholder="test@example.com"
                    class="mr-2"
                />
                <n-button @click="handleTestClick" :loading="testLoading">
                    <n-icon
                        v-if="testStatus == 1"
                        :size="18"
                        class="text-success"
                    >
                        <CheckmarkCircle20Filled />
                    </n-icon>
                    <n-icon
                        v-if="testStatus == 2"
                        :size="18"
                        class="text-error"
                    >
                        <ErrorCircle20Filled />
                    </n-icon>
                    测试连接
                </n-button>
            </n-form-item>
        </n-form>
        <span v-if="testStatus == 1" class="text-success">{{ testMsg }}</span>
        <span v-else class="text-error">{{ testMsg }}</span>
    </div>
</template>

<script lang="ts" setup>
import { channelsInfo } from "@/api/system/type"
import { PropType, ref, toRaw, unref } from "vue"
import {
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NButton,
    NIcon,
    NSwitch,
} from "naive-ui"
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from "@vicons/fluent"
import { checkEmailSettingsApi } from "@/api/system/apiCheck"

//双向绑定
const data = defineModel({
    type: Object as PropType<channelsInfo>,
})

//测试配置回调
const testStatus = ref<number>(0)
const testMail = ref<string>(null)
const testMsg = ref<string>(null)
const testLoading = ref<boolean>(false)
const handleTestClick = async () => {
    testLoading.value = true
    const testConfig = toRaw(unref(data.value))
    const testReceive = toRaw(unref(testMail.value))
    await checkEmailSettingsApi(testConfig.email, testReceive)
        .then(res => {
            if (res.code) {
                testStatus.value = 1
            }
            testMsg.value = res.message
        })
        .catch(error => {
            testStatus.value = 2
            if (error?.response?.data?.message) {
                testMsg.value = error.response.data.message
            } else {
                testMsg.value = error.message
            }
        })
        .finally(() => {
            testLoading.value = false
        })
}
</script>
@/api/system/testApi
