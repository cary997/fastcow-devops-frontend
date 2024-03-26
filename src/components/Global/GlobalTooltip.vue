<template>
    <n-tooltip :trigger="trigger" :placement="placement">
        <template #trigger>
            <slot></slot>
        </template>
        {{ value }}
    </n-tooltip>
</template>

<script lang="ts" setup>
import { NTooltip, PopoverTrigger } from "naive-ui"
import { Placement } from "naive-ui/es/drawer/src/DrawerBodyWrapper"

defineProps<{
    trigger?: PopoverTrigger
    placement?: Placement
    value: string
}>()
</script>

<style scoped></style>
