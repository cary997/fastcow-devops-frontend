<template>
  <NDropdown
    :options="options"
    :show-arrow="true"
    trigger="click"
    @select="handleSelect"
  >
    <NButton text>
      <n-tooltip placement="bottom" trigger="hover" :z-index="0">
        <template #trigger>
          <themeIcon class="animate-pulse" />
        </template>
        <span> {{ $t("global.theme_tooltip") }} </span>
      </n-tooltip>
    </NButton>
  </NDropdown>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NTooltip, useOsTheme } from "naive-ui"
import { watch } from "vue"
import { useI18n } from "vue-i18n"

import useThemesStore from "@/store/modules/appThemes.js"
import { getTheme } from "@/utils/storage/Theme"
import { renderIcon } from "@/utils/tools"
import { DesktopMac24Filled } from "@vicons/fluent"
import { Moon, Sunny } from "@vicons/ionicons5"

const { t } = useI18n()
const updateThemeValue = useThemesStore().updateThemeValue

const options = [
  {
    label: () => t("global.theme_light"),
    key: "light",
    icon: renderIcon(Sunny, {
      size: "20",
      class: "text-primary",
    }),
  },
  {
    label: () => t("global.theme_dark"),
    key: "dark",
    icon: renderIcon(Moon, {
      size: "20",
      class: "text-primary",
    }),
  },
  {
    label: () => t("global.theme_useOS"),
    key: "os",
    icon: renderIcon(DesktopMac24Filled, {
      size: "20",
      class: "text-primary",
    }),
  },
]

// 获取当前主题的图标
function getThemeIcon() {
  if (getTheme()) {
    for (var i = 0; i < options.length; i++) {
      if (getTheme() === options[i].key) {
        return options[i].icon
      }
    }
  } else {
    return renderIcon(DesktopMac24Filled, {
      size: "20",
    })
  }
}

let themeIcon = getThemeIcon()

// const updateDocumentTheme = () => {
//   const transition = document.startViewTransition(() => {})
//   transition.ready.then(() => {
//     document.documentElement.animate(
//       { clipPath: [`circle(0% at 50% 50%)`, `circle(100% at 50% 50%)`] },
//       {
//         duration: 1500,
//         pseudoElement: "::view-transition-new(root)",
//       },
//     )
//   })
// }
// 切换主题方法
function handleSelect(key: string) {
  updateThemeValue(key)

  for (var i = 0; i < options.length; i++) {
    if (key === options[i].key) {
      themeIcon = getThemeIcon()
    }
  }
}

// 添加侦听器，监听系统主题变化
const osTheme = useOsTheme()
watch(
  osTheme,
  () => {
    const localTheme = getTheme()
    updateThemeValue(localTheme ? localTheme : "os")
  },
  { immediate: true },
)
</script>
<!-- <style >
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
}
</style> -->
