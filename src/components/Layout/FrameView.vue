<template>
    <div class="flex-1 default-bg">
        <n-spin :show="loading" :description="t('status.loading')">
            <div class="w-full h-screen">
                <iframe
                    :src="frameSrc"
                    class="w-full h-full overflow-hidden border-0 box-border"
                    ref="frameRef"
                />
            </div>
        </n-spin>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { ref, unref, onMounted, nextTick } from "vue"
import { NSpin } from "naive-ui"

defineOptions({
    name: "FrameView",
})

const { t } = useI18n()
const loading = ref(true)
const currentRoute = useRoute()
const frameSrc = ref<string>("")
const frameRef = ref<HTMLElement | null>(null)

if (unref(currentRoute.meta)?.frameSrc) {
    frameSrc.value = unref(currentRoute.meta)?.frameSrc as string
}
unref(currentRoute.meta)?.frameLoading === false && hideLoading()

function hideLoading() {
    loading.value = false
}

function init() {
    nextTick(() => {
        const iframe = unref(frameRef)
        if (!iframe) return
        const _frame = iframe as any
        if (_frame.attachEvent) {
            _frame.attachEvent("onload", () => {
                hideLoading()
            })
        } else {
            iframe.onload = () => {
                hideLoading()
            }
        }
    })
}

onMounted(() => {
    init()
    loading.value = true
})
</script>
