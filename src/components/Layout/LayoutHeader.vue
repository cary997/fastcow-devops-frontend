<template>
    <div class="flex flex-row">
        <div
            class="ml-2 mr-2 flex flex-none flex-row items-center justify-start m:ml-4 m:mr-4"
        >
            <slot></slot>
        </div>
        <div class="flex flex-1 flex-row items-center justify-end">
            <!-- 快捷方式下拉菜单 -->
            <div class="ml-2 mr-2 m:ml-8 m:mr-8">
                <ExtLinkMenus />
            </div>
            <!-- 语言选择下拉菜单 -->
            <div class="ml-2 mr-2 m:ml-8 m:mr-8">
                <LanguageSelectVue :show-label="false" />
            </div>
            <!-- 主题选择下拉菜单 -->
            <div class="ml-2 mr-2 m:ml-8 m:mr-8 xl:ml-8 xl:mr-8">
                <ThemeSelectVue />
            </div>
            <!-- 头像 -->
            <div
                class="border-lighrBorder ml-4 mr-0 border-l border-r border-opacity-25 bg-gray-400 bg-opacity-10 pl-2 pr-2 dark:border-gray-300 dark:border-opacity-25 dark:bg-gray-300 dark:bg-opacity-10 m:ml-8 m:mr-8"
            >
                <UserAvtarVue />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ThemeSelectVue,
    LanguageSelectVue,
    UserAvtarVue,
    ExtLinkMenus,
} from "./header"
</script>
