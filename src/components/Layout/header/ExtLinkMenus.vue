<template>
    <n-tooltip placement="bottom" trigger="hover" :z-index="0">
        <template #trigger>
            <n-popover trigger="click">
                <template #trigger>
                    <NButton text>
                        <NIcon
                            size="20"
                            class="mr-2 animate-pulse text-primary"
                        >
                            <GridDots28Regular />
                        </NIcon>
                    </NButton>
                </template>
                <n-grid :cols="3">
                    <n-grid-item :span="1" v-for="item in wholeMenusExtlink">
                        <div class="flex p-1 m-2 justify-center items-center">
                            <RouterLink
                                :to="item.path"
                                class="m-2 p-1 flex flex-col items-center justify-center no-underline"
                            >
                                <NAvatar
                                    :round="true"
                                    :src="
                                        item.meta?.icon
                                            ? item.meta?.icon
                                            : 'default.png'
                                    "
                                    :size="48"
                                    :fallbackSrc="
                                        theme === null ? lightLogo : darkLogo
                                    "
                                />
                                <n-text depth="2">
                                    {{
                                        language === "en"
                                            ? item.meta?.en_title
                                            : item.meta?.title
                                    }}
                                </n-text>
                            </RouterLink>
                        </div>
                    </n-grid-item>
                </n-grid>
            </n-popover>
        </template>
        <span> {{ $t("global.extlink_tooltip") }} </span>
    </n-tooltip>
</template>

<script setup lang="ts">
import {
    NIcon,
    NPopover,
    NButton,
    NTooltip,
    NAvatar,
    NText,
    NGrid,
    NGridItem,
} from "naive-ui"

import { GridDots28Regular } from "@vicons/fluent"
import { useMenusStore } from "@/store/modules/appMenus"
import { storeToRefs } from "pinia"
import useLanguageStore from "@/store/modules/appLanguage"
import { RouterLink } from "vue-router"
import useThemesStore from "@/store/modules/appThemes"
import darkLogo from "@/assets/image/darkLogo.png"
import lightLogo from "@/assets/image/lightLogo.png"
const { language } = storeToRefs(useLanguageStore())
const { wholeMenusExtlink } = storeToRefs(useMenusStore())
const { theme } = storeToRefs(useThemesStore())
</script>
