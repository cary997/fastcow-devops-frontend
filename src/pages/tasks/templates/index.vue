<template>
    <div class="flex-1 flex flex-col default-bg">
        <div class="flex-none pt-4 pb-4">
            <templateCreate />
        </div>
        <div v-if="templateList.length" class="flex-1 pl-2 pr-2">
            <templateCard />
        </div>
        <div v-else class="flex flex-1 flex-grow justify-center items-center">
            <n-empty :description="t('status.empty')" size="huge" />
        </div>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: "tasksTemplates",
})
import { refreshTemplateList, templateList } from "./extend"
import templateCreate from "./templateCreate.vue"
import templateCard from "./templateCard.vue"
import {NEmpty} from "naive-ui";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
const { t } = useI18n()

onMounted(async () => {
    await refreshTemplateList()
})
</script>
