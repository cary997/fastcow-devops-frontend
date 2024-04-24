<template>
  <div
    class="flex h-16 flex-row items-center justify-center space-x-4 overflow-hidden whitespace-nowrap"
  >
    <span>
      <NImage :src="theme === null ? lightLogo : darkLogo" class="h-8 w-auto" />
    </span>
    <span
      v-show="!collapsed"
      class="invisible text-lg font-bold m:visible m:w-auto"
    >
      {{ title }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { NImage } from "naive-ui"
import { storeToRefs } from "pinia"

import darkLogo from "@/assets/image/darkLogo.svg"
import lightLogo from "@/assets/image/lightLogo.svg"
import { getConfig } from "@/settings/config"
import useThemesStore from "@/store/modules/appThemes"

defineProps<{
  collapsed: boolean
}>()

const title = getConfig().title
const { theme } = storeToRefs(useThemesStore())
</script>
@/settings/config
