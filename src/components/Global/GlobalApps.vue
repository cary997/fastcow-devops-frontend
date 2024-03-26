<template>
    <NDialogProvider>
        <NNotificationProvider>
            <NMessageProvider>
                <GlobalNaiveui />
                <slot name="default" />
            </NMessageProvider>
        </NNotificationProvider>
    </NDialogProvider>
</template>

<script lang="ts" setup>
import {
    NMessageProvider,
    NDialogProvider,
    NNotificationProvider,
} from "naive-ui"
import GlobalNaiveui from "./GlobalNaiveui.vue"
</script>
