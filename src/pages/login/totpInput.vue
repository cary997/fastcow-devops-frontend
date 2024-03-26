<template>
    <div class="flex-1 flex flex-col justify-center items-center space-y-6">
        <div class="flex-none">{{ $t("login.verifyCodeTip") }}</div>
        <code-input v-model="codes" :verifyClick="handleVerifyClick">
        </code-input>
        <div class="flex flex-row flex-1 w-full justify-center items-center">
            <NButton
                round
                type="primary"
                size="small"
                @click="handleVerifyClick"
                class="w-3/4"
                >{{ $t("action.verify") }}</NButton
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui"
import { HandleLoginClick } from "./extend"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
//双向绑定
const codes = defineModel()

//验证回调
const handleVerifyClick = async () => {
    await HandleLoginClick()
}
</script>
