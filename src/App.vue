<template>
    <NConfigProvider
        :theme="theme"
        :breakpoints="breakpoints"
        :theme-overrides="
            theme === null ? lightThemeOverrides : darkThemeOverrides
        "
        :locale="locale"
        :date-locale="dateLocale"
        :hljs="hljs"
    >
        <GlobalApps>
            <RouterView />
        </GlobalApps>
    </NConfigProvider>
</template>

<script lang="ts" setup>
import { NConfigProvider } from "naive-ui"
import { GlobalApps } from "@components/Global"
import { storeToRefs } from "pinia"
import useLanguageStore from "@/store/modules/appLanguage"
import useThemesStore from "@/store/modules/appThemes"
import {
    breakpoints,
    lightThemeOverrides,
    darkThemeOverrides,
} from "@/settings/themes/index"
import hljs from "@/utils/hljs"

const { locale, dateLocale } = storeToRefs(useLanguageStore())
const { theme } = storeToRefs(useThemesStore())
</script>
