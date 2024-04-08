<template>
  <div class="ml-2 mr-2 mt-2 flex flex-row rounded-md p-1">
    <div class="mr-2 flex flex-none items-center justify-start">
      <span
        v-for="item in multiTags"
        class="mr-4 transform rounded-md border border-solid border-gray-400/20 transition hover:scale-110"
      >
        <n-tag
          v-if="getTab"
          closable
          :bordered="false"
          :checked="item.checked"
          @click="handleClick(item.key)"
          @close="handleClose(item.key)"
          :class="[
            'border-opacity-25 bg-gray-400 bg-opacity-10 pl-4 pr-4 dark:border-gray-300 dark:border-opacity-25 dark:bg-gray-300 dark:bg-opacity-10',
            item.checked ? ' text-primary' : '',
          ]"
        >
          {{ item.tab }}
        </n-tag>
        <n-tag
          v-else
          closable
          :bordered="false"
          :checked="item.checked"
          @click="handleClick(item.key)"
          @close="handleClose(item.key)"
          :class="[
            'border-opacity-25 bg-gray-400 bg-opacity-10 pl-4 pr-4 dark:border-gray-300 dark:border-opacity-25 dark:bg-gray-300 dark:bg-opacity-10',
            item.checked ? ' text-primary' : '',
          ]"
        >
          {{ item.en_tab }}
        </n-tag>
        <!-- <n-button text @click="handleClose(item.key)" class="mr-1 flex-none">
          <n-icon>
            <CloseOutline />
          </n-icon>
        </n-button> -->
      </span>
    </div>
    <div
      class="ml-4 mr-4 flex flex-1 items-center justify-end m:ml-8 m:mr-8 xl:ml-8 xl:mr-8"
    >
      <n-dropdown
        trigger="hover"
        placement="bottom-start"
        :options="dropDownOptions"
        @select="handleSelect"
      >
        <n-button text>
          <dropDownIcon />
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NDropdown, NIcon, NTag } from "naive-ui"
import { storeToRefs } from "pinia"
import { computed, unref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { router } from "@/router"
import { handleAliveRoute } from "@/router/routerUtils"
import useLanguageStore from "@/store/modules/appLanguage"
import { useMenusStore } from "@/store/modules/appMenus"
import { useTabsStoreHook } from "@/store/modules/appTabs"
import { renderIcon } from "@/utils/tools"
import { ChevronDown, Close, CloseCircle, Refresh } from "@vicons/ionicons5"

import { defaultTab } from "./types.d"

const { currentKey, menuInstRef } = storeToRefs(useMenusStore())

const { t } = useI18n()
const currentRoute = useRoute()
const { multiTags } = storeToRefs(useTabsStoreHook())
const { language } = storeToRefs(useLanguageStore())
const getTab = computed(() => {
  return language.value === "en" ? false : true
})
const dropDownIcon = renderIcon(ChevronDown, { size: 18 })
const dropDownOptions = [
  {
    label: () => t("status.reload"),
    key: "Reload",
    icon: renderIcon(Refresh),
  },
  {
    label: () => t("status.close_other"),
    key: "CloseOther",
    icon: renderIcon(Close),
  },
  {
    label: () => t("status.close_all"),
    key: "CloseAll",
    icon: renderIcon(CloseCircle),
  },
]

//标签切换
const handleClick = key => {
  multiTags.value.find(v => {
    v.key === key ? (v.checked = true) : (v.checked = false)
    currentKey.value = key
    menuInstRef.value?.showOption(key)
    router.push({
      name: key,
    })
  })
}

//标签关闭
const handleClose = key => {
  handleAliveRoute(key, "delete")
  const LastIndex = useTabsStoreHook().handleTags("delete", key) - 1
  let Lastkey = null
  if (LastIndex === -1 && multiTags.value.length === 0) {
    useTabsStoreHook().handleTags("push", defaultTab)
    Lastkey = defaultTab.key
  } else if (LastIndex === -1 && multiTags.value.length > 0) {
    Lastkey = multiTags.value[LastIndex + 1].key
  } else {
    Lastkey = multiTags.value[LastIndex].key
  }
  //如果关闭的是当前页面则切换
  if (currentKey.value === key) {
    handleClick(Lastkey)
  }
}

//右侧菜单
const handleSelect = (key: string | number) => {
  switch (key) {
    case "Reload": {
      const { fullPath, query } = unref(currentRoute)
      router.replace({
        path: "/redirect" + fullPath,
        query,
      })
      handleAliveRoute(currentRoute.name, "refresh")
      break
    }
    case "CloseOther": {
      const tagKey = currentRoute.name
      let currentTags = null
      multiTags.value.find(v => {
        if (v.key === tagKey) {
          currentTags = v
        }
      })
      useTabsStoreHook().handleTags("clear")
      useTabsStoreHook().handleTags("push", currentTags)
      break
    }
    case "CloseAll": {
      useTabsStoreHook().handleTags("clear")
      useTabsStoreHook().handleTags("push", defaultTab)
      handleClick(defaultTab.key)
      break
    }
  }
}
</script>
