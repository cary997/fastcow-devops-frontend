<template>
    <div class="flex flex-col">
        <div id="tableFitter" v-if="showFitter" class="flex-none">
            <slot name="tableFitter"></slot>
        </div>
        <div class="flex flex-1 flex-col">
            <div
                id="tableHeaderAction"
                class="flex flex-none flex-row items-center space-x-4"
            >
                <div class="flex flex-none justify-start items-center">
                    <span>
                        <h2>{{ tableTitle }}</h2>
                    </span>
                    <slot name="tableHeader"></slot>
                </div>
                <div class="flex flex-1 justify-end space-x-3 items-center">
                    <slot name="tableHeaderAction"></slot>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <n-button text @click="handleRefreshUsersData">
                                <n-icon :size="18">
                                    <Refresh />
                                </n-icon>
                            </n-button>
                        </template>
                        {{ $t("action.refresh") }}
                    </n-tooltip>
                    <n-divider vertical />
                    <n-dropdown
                        trigger="click"
                        :options="resizeOptions"
                        @select="resizeHandleSelect"
                    >
                        <n-tooltip trigger="hover">
                            <template #trigger>
                                <n-button text>
                                    <n-icon :size="18">
                                        <Resize />
                                    </n-icon>
                                </n-button>
                            </template>
                            {{ $t("action.density") }}
                        </n-tooltip>
                    </n-dropdown>
                    <n-divider vertical />
                    <columnsSettings v-model:columns="tableColumns" />
                </div>
            </div>
            <div class="flex flex-auto">
                <n-data-table
                    v-bind="getBindValues"
                    :size="tableResize"
                    v-model:columns="tableColumns"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref, unref } from "vue"
import {
    NButton,
    NDataTable,
    NIcon,
    NDivider,
    NTooltip,
    NDropdown,
} from "naive-ui"

import { Refresh, Resize } from "@vicons/ionicons5"
import { BaseProps } from "./BaseProps"
import columnsSettings from "./columnsSettings.vue"
import { useI18n } from "vue-i18n"

const props = defineProps({
    ...BaseProps,
})
const { t } = useI18n()
//双向绑定
const tableColumns = defineModel("columns", {
    type: Array as PropType<BaseTableColumns>,
    default: () => [],
    required: true,
})
const tableTitle = props.tableTitle
const refresData = props.refresData

//组装表格信息
const getBindValues = computed(() => {
    return { ...props }
})

//刷新表格数据
const handleRefreshUsersData = () => {
    refresData()
}

//表格大小选项
const tableResize = ref<"medium" | "small" | "large">(
    unref(props.size) as "small",
)
const resizeOptions = [
    {
        label: "紧凑",
        key: "small",
    },
    {
        label: "默认",
        key: "medium",
    },
    {
        label: "宽松",
        key: "large",
    },
]
const resizeHandleSelect = (key: "small" | "medium" | "large") => {
    tableResize.value = key
}

onMounted(() => {
    tableResize.value = "medium"
})
</script>
