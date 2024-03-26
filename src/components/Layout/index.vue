<template>
    <n-layout has-sider class="flex flex-row">
        <!-- 侧边栏 -->
        <n-layout-sider
            v-if="!isMobile"
            bordered
            collapse-mode="width"
            :width="menuSetting.menuWidth"
            :collapsed-width="64"
            :collapsed="collapsed"
            @collapse="collapsed = true"
            @expand="collapsed = false"
            class="min-h-screen flex-none"
            :native-scrollbar="false"
        >
            <LayoutLogoVue :collapsed="collapsed" />
            <LayoutMenuVue :accordion="accordion" :collapsed="collapsed" />
            <div
                class="absolute inset-x-0 bottom-2 flex flex-row items-center justify-center"
            >
                <n-tooltip placement="top" trigger="hover">
                    <template #trigger>
                        <label class="swap swap-rotate">
                            <input
                                type="checkbox"
                                :checked="accordion"
                                @click="handleChangeAccordion"
                            />
                            <n-icon class="swap-off text-primary" :size="20">
                                <ArrowsMaximize />
                            </n-icon>
                            <n-icon class="swap-on text-info" :size="20">
                                <ArrowsMinimize />
                            </n-icon>
                        </label>
                    </template>
                    <span v-if="accordion">{{ $t("global.accordion") }}</span>
                    <span v-else>{{ $t("global.default") }}</span>
                </n-tooltip>
            </div>
        </n-layout-sider>

        <n-layout class="flex h-screen flex-1 flex-col">
            <!-- 顶部 -->
            <n-layout-header bordered class="flex-none">
                <LayoutHeaderVue>
                    <div class="flex flex-row space-x-4">
                        <span>
                            <label class="swap swap-flip">
                                <input type="checkbox" v-model="collapsed" />
                                <n-icon class="swap-on" :size="20">
                                    <MenuUnfoldOutlined />
                                </n-icon>
                                <n-icon class="swap-off" :size="20">
                                    <MenuFoldOutlined />
                                </n-icon>
                            </label>
                            <n-drawer
                                v-if="isMobile"
                                v-model:show="showSideDrawder"
                                :width="menuSetting.menuWidth"
                                :placement="'left'"
                            >
                                <LayoutLogoVue :collapsed="collapsed" />
                                <LayoutMenuVue
                                    :accordion="true"
                                    :collapsed="!collapsed"
                                />
                            </n-drawer>
                        </span>
                        <span v-if="!isMobile">
                            <n-tooltip
                                placement="bottom"
                                trigger="hover"
                                :z-index="0"
                            >
                                <template #trigger>
                                    <label class="swap swap-flip">
                                        <input
                                            type="checkbox"
                                            :checked="isTags"
                                            @click="handeleShowTagsClick"
                                        />
                                        <n-icon class="swap-on" :size="20">
                                            <Tag20Filled />
                                        </n-icon>
                                        <n-icon class="swap-off" :size="20">
                                            <TagOff20Filled />
                                        </n-icon>
                                    </label>
                                </template>
                                <span v-if="isTags">{{
                                    $t("global.tabs_display")
                                }}</span>
                                <span v-else>{{
                                    $t("global.tabs_hiding")
                                }}</span>
                            </n-tooltip>
                        </span>
                    </div>
                </LayoutHeaderVue>
            </n-layout-header>
            <!--标签页-->
            <div v-if="!isMobile && isTags" class="flex-none">
                <LayoutTabs />
            </div>
            <!-- 内容 -->
            <n-layout-content
                id="layoutContent"
                :native-scrollbar="false"
                class="flex-1"
            >
                <LayoutContent />
            </n-layout-content>
        </n-layout>
    </n-layout>
</template>

<script lang="ts" setup>
import {
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NLayoutContent,
    NDrawer,
    NIcon,
    NTooltip,
} from "naive-ui"
import { Tag20Filled, TagOff20Filled } from "@vicons/fluent"
import "animate.css"
import { ArrowsMaximize, ArrowsMinimize } from "@vicons/tabler"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@vicons/antd"
import { computed, onMounted } from "vue"
import LayoutHeaderVue from "./LayoutHeader.vue"
import LayoutMenuVue from "./LayoutMenu.vue"
import LayoutLogoVue from "./LayoutLogo.vue"
import LayoutTabs from "./LayoutTabs.vue"
import LayoutContent from "./LayoutContent.vue"
import usewebSiteStore from "@/store/modules/appWebSite"
import { storeToRefs } from "pinia"
import { useTabsStoreHook } from "@/store/modules/appTabs"
import { isMobileBrowserPattern } from "@/utils/regularTools"
import useSettingsStore from "@/store/modules/appSettings"

const { menuSetting, isMobile, isCollapsed, isaccordion } =
    storeToRefs(usewebSiteStore())
const { isTags } = storeToRefs(useTabsStoreHook())
const handelIsTags = useTabsStoreHook().handelIsTags
const handeleShowTagsClick = () => {
    isTags.value = !isTags.value
    handelIsTags(isTags.value)
}
//菜单是否展开
const collapsed = isCollapsed

//菜单是否开启手风琴模式
const accordion = isaccordion
const handleChangeAccordion = () => {
    accordion.value = !accordion.value
    usewebSiteStore().setIsAccordion(accordion.value)
}

//判断是否触发移动端模式
const checkMobileMode = () => {
    if (
        document.body.clientWidth <= menuSetting.value.mobileWidth ||
        isMobileBrowserPattern.test(navigator.userAgent)
    ) {
        usewebSiteStore().setIsMobile(true)
    } else {
        usewebSiteStore().setIsMobile(false)
    }
}
// 控制显示或隐藏移动端侧边栏
const showSideDrawder = computed({
    get: () => isMobile.value && collapsed.value,
    set: val => (collapsed.value = val),
})

onMounted(async () => {
    //检查是否移动端
    checkMobileMode()
    //获取系统配置
    await useSettingsStore()
        .getSettings()
        .then(res => {
            useSettingsStore().updateSettings(res)
        })
    //监听窗口尺寸变化
    window.addEventListener("resize", checkMobileMode)
})
</script>
