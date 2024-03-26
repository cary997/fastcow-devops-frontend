<template>
    <div class="flex-1 flex justify-center items-center">
        <n-result
            status="500"
            :title="t('result.title.err500')"
            :description="t('result.description.err500')"
        >
            <template #icon>
                <n-image width="200" :src="err500" />
            </template>
            <template #footer>
                <n-button type="info" @click="router.push('/')" class="m-2">{{
                    $t("result.goHome")
                }}</n-button>
                <n-button type="primary" @click="handleGoBack" class="m-2">{{
                    $t("result.goBack")
                }}</n-button>
            </template>
        </n-result>
    </div>
</template>

<script setup lang="ts">
import { NResult, NButton, NImage } from "naive-ui"
import err500 from "@/assets/err500.svg"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

defineOptions({
    name: "err500",
})
const router = useRouter()
const { t } = useI18n()

const handleGoBack = () => {
    // 有上一页则返回
    if (window.history.state.back) {
        router.go(-1)
    } else {
        // 没有上一页则返回到首页
        router.push({ path: "/" })
    }
}
</script>
