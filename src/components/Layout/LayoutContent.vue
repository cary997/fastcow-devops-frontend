<template>
    <div class="flex flex-auto h-full w-full">
        <n-watermark
            v-if="general.watermark"
            :content="watermarkContent"
            cross
            :fullscreen="true"
            :font-size="16"
            :line-height="16"
            :width="watermarkSize"
            :height="watermarkSize"
            :x-offset="12"
            :y-offset="60"
            :rotate="-15"
        />
        <div :class="['flex', 'flex-auto', isMobile ? '' : 'm-2 p-1']">
            <router-view>
                <template #default="{ Component, route }">
                    <transitionMain :route="route">
                        <keep-alive
                            v-if="keepAlive"
                            :include="useMenusStoreHook().cachePageList"
                        >
                            <component :is="Component" :key="route.fullPath" />
                        </keep-alive>
                        <component
                            v-else
                            :is="Component"
                            :key="route.fullPath"
                        />
                    </transitionMain>
                </template>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMenusStoreHook } from "@/store/modules/appMenus.js"
import usewebSiteStore from "@/store/modules/appWebSite"
import { NWatermark } from "naive-ui"
import { storeToRefs } from "pinia"
import useSettingsStore from "@/store/modules/appSettings"
import useUserStore from "@/store/modules/appLogin"
import { h, computed, Transition, defineComponent } from "vue"
const { general } = storeToRefs(useSettingsStore())
const { isMobile } = storeToRefs(usewebSiteStore())
const { username, nickname } = storeToRefs(useUserStore())
const watermarkContent = computed(() => {
    const content = general.value.watermarkContent
    return content == 1
        ? username.value
        : content == 2
          ? nickname.value
          : `${username.value}-${nickname.value}`
})

const watermarkSize = computed(() => {
    const content = general.value.watermarkSize
    return content == 1 ? 200 : content == 2 ? 250 : 300
})

const keepAlive = computed(() => {
    return route => {
        route.meta?.KeepAlive
        return route.meta.KeepAlive === true ? true : false
    }
})

const transitionMain = defineComponent({
    render() {
        return h(
            Transition,
            {
                name: "fade-transform",
                enterActiveClass: this.route.meta.enterTransition
                    ? `animate__animated ${this.route.meta.enterTransition}`
                    : `animate__animated animate__fadeInLeft`,
                leaveActiveClass: this.route.meta.leaveTransition
                    ? `animate__animated ${this.route.meta.leaveTransition}`
                    : `animate__animated animate__fadeOutRight`,
                mode: "out-in",
                appear: true,
            },
            {
                default: () => [this.$slots.default()],
            },
        )
    },
    props: {
        route: {
            type: undefined,
            required: true,
        },
    },
})
</script>
