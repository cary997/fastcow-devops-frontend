<template>
    <n-popover trigger="click" @update:show="handelClick">
        <template #trigger>
            <n-button :type="props.type" :size="props.size">{{
                $t("action.viewPlaintext")
            }}</n-button>
        </template>
        <div class="flex flex-row space-x-2 items-center">
            <span>
                {{ plainText }}
            </span>
            <n-button v-if="plainText" text size="tiny" @click="onCopy(plainText)">
                <template #icon>
                    <n-icon class="text-primary">
                        <Copy />
                    </n-icon>
                </template>
            </n-button>
        </div>
    </n-popover>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue"
import { NPopover, NButton, NIcon } from "naive-ui"
import { Copy } from "@vicons/ionicons5"
import { useI18n } from "vue-i18n"
import { onCopy } from "@/utils/tools"
import { aesDecrypt } from "@/utils/aes"
import { Size, Type } from "naive-ui/es/button/src/interface"
const props = defineProps({
    value: {
        type: String,
        required: true,
    },
    size: {
        type: String as PropType<Size>,
        default: "tiny",
    },
    type: {
        type: String as PropType<Type>,
        default: "primary",
    },
})

const { t } = useI18n()

const plainText = ref<string>(null)
const show = ref(false)
const handelClick = () => {
    show.value = !show.value
    if (show.value) {
        plainText.value = aesDecrypt(props.value)
    } else {
        plainText.value = null
    }
}
</script>

<style scoped></style>
