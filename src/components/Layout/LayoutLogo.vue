<template>
    <div
        class="flex mb-2 h-16 flex-row items-center justify-center overflow-hidden whitespace-nowrap"
    >
        <NImage
            :src="theme === null ? lightLogo : darkLogo"
            alt=""
            class="mr-2 h-8 w-auto"
        />
        <span
            v-show="!collapsed"
            class="invisible text-lg font-bold m:visible m:w-auto"
        >
            {{ title }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { getConfig } from "@/settings/config"
import { NImage } from "naive-ui"
import darkLogo from "@/assets/image/darkLogo.svg"
import lightLogo from "@/assets/image/lightLogo.svg"
import { storeToRefs } from "pinia"
import useThemesStore from "@/store/modules/appThemes"
defineProps<{
    collapsed: boolean
}>()

const title = getConfig().title
const { theme } = storeToRefs(useThemesStore())
</script>
@/settings/config
