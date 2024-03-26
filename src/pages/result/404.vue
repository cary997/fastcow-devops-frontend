<template>
    <div class="flex-1 flex justify-center items-center">
        <n-result
            status="404"
            :title="t('result.title.err404')"
            :description="t('result.description.err404')"
        >
            <template #icon>
                <n-image width="200" :src="err404" />
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
import err404 from "@/assets/err404.svg"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
defineOptions({
    name: "err404",
})
const router = useRouter()
console.log(router)
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
