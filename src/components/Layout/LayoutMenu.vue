<template>
    <n-menu
        ref="menuInstRef"
        :options="menuOptions"
        :collapsed="props.collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="20"
        :indent="24"
        v-model:value="currentKey"
        :accordion="props.accordion"
        @update:value="handleUpdateValue"
    />
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { MenuOption, NMenu } from "naive-ui"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useMenusStore } from "@/store/modules/appMenus"
import { useTabsStoreHook } from "@/store/modules/appTabs"
import { getMenusHook } from "@/hooks/useRoutersHook"
import { getTagHook } from "@/hooks/useTagsHook"

const props = defineProps<{
    collapsed: boolean
    accordion: boolean
}>()
const { wholeMenus, currentKey, menuInstRef } = storeToRefs(useMenusStore())
const { multiTags } = storeToRefs(useTabsStoreHook())

//首页下面插入分割线
const getMenus = menus => {
    const index = menus.findIndex(item => item.key === "home")
    menus.splice(index + 1, 0, {
        key: "divider-1",
        type: "divider",
        props: {
            class: "mt-4 mb-4",
        },
    })
    return menus
}
//菜单
const menuOptions: MenuOption[] = getMenus(getMenusHook(wholeMenus.value))
//当前路由
const currentRoute = useRoute()

//菜单切换
const handleUpdateValue = (key: string, item: MenuOption) => {
    const tagObj = {
        key: key,
        show: item.show,
        menu_type: item.menu_type,
        tab: item.tab,
        en_tab: item.en_tab,
        hiddenTag: item.hiddenTag,
        checked: false,
    }
    useTabsStoreHook().handleTags("push", tagObj)
    multiTags.value.find(v => {
        v.key === key ? (v.checked = true) : (v.checked = false)
    })
}

//组件挂载后触发
onMounted(() => {
    const tagObj = getTagHook(currentRoute)
    currentKey.value = tagObj.key
    useTabsStoreHook().handleTags("push", tagObj)
    multiTags.value.find(v => {
        v.key === tagObj.key ? (v.checked = true) : (v.checked = false)
    })
})
</script>
