<template>
    <NDropdown
        :options="options"
        :show-arrow="true"
        trigger="click"
        @select="handleUpdateValue"
    >
        <NButton text>
            <n-tooltip placement="bottom" trigger="hover" :z-index="0">
                <template #trigger>
                    <langIcon class="mr-2 animate-pulse" />
                </template>
                <span> {{ $t("global.language_tooltip") }} </span>
            </n-tooltip>
            <span v-show="showLabel" class="invisible w-0 m:visible m:w-full">
                {{ langLabel }}
            </span>
        </NButton>
    </NDropdown>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import useLanguageStore from "@store/modules/appLanguage"
import { LANG_VALUE } from "@/settings/i18n/enum"
import { NDropdown, NButton, NTooltip } from "naive-ui"
import { Earth } from "@vicons/ionicons5"
import { getLanguage, setLanguage } from "@/utils/storage/Language"
import { useI18n } from "vue-i18n"
import { renderIcon } from "@/utils/tools"

defineProps<{
    showLabel: boolean
}>()

const { locale } = useI18n()

// 获取当前语言
const langStore = useLanguageStore()

const { language } = storeToRefs(langStore)
const options = [
    {
        label: "简体中文",
        key: "zh-CN",
        icon: renderIcon(Earth, {
            size: "20",
            class: "text-primary",
        }),
    },
    {
        label: "English",
        key: "en",
        icon: renderIcon(Earth, {
            size: "20",
            class: "text-info",
        }),
    },
]

function getInstance() {
    for (var i = 0; i < options.length; i++) {
        if (getLanguage() === options[i].key) {
            return {
                icon: options[i].icon,
                label: options[i].label,
            }
        }
    }
}

let langIcon: any = getInstance()?.icon
let langLabel = getInstance()?.label
let lang
function handleUpdateValue(key: string) {
    if (key === "en") {
        lang = LANG_VALUE.En
    } else {
        lang = LANG_VALUE.Zh
    }
    locale.value = lang
    language.value = lang
    setLanguage(lang)
    langIcon = getInstance()?.icon
    langLabel = getInstance()?.label
}
</script>
