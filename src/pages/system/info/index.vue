<template>
    <div class="flex-1 default-bg">
        <n-card embedded size="small" :bordered="false">
            <n-descriptions
                title="平台信息"
                label-placement="left"
                label-align="left"
                :column="column"
                bordered
                size="small"
                class="pt-5"
            >
                <n-descriptions-item label="系统版本">
                    {{ pkg.version }}
                </n-descriptions-item>
                <n-descriptions-item label="最后编译时间">
                    {{ pkg.lastBuildTime }}
                </n-descriptions-item>
                <n-descriptions-item label="推荐Node版本">
                    {{ pkg.engines.node }}
                </n-descriptions-item>
                <n-descriptions-item label="推荐Npm版本">
                    {{ pkg.engines.npm }}
                </n-descriptions-item>
                <n-descriptions-item label="代码仓库">
                    <a
                        href="https://github.com/Cary1997/fastcow-devops"
                        target="_blank"
                        class="link link-primary mr-2"
                        >GitHub</a
                    >
                    <a
                        href="https://gitee.com/guoyaolei/fastcow-devops"
                        target="_blank"
                        class="link link-primary ml-2"
                        >Gitee</a
                    >
                </n-descriptions-item>
                <n-descriptions-item label="预览地址">
                    {{ pkg.engines.npm }}
                </n-descriptions-item>
            </n-descriptions>
            <n-descriptions
                title="生产环境依赖"
                label-placement="left"
                label-align="left"
                :column="column"
                size="small"
                bordered
                class="pt-5"
            >
                <n-descriptions-item v-for="item in schema" :label="item.label">
                    {{ item.version }}
                </n-descriptions-item>
            </n-descriptions>
            <n-descriptions
                title="开发环境依赖"
                label-placement="left"
                label-align="left"
                :column="column"
                size="small"
                bordered
                class="pt-5"
            >
                <n-descriptions-item
                    v-for="item in devSchema"
                    :label="item.label"
                >
                    {{ item.version }}
                </n-descriptions-item>
            </n-descriptions>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: "systemInfo",
})
import usewebSiteStore from "@/store/modules/appWebSite"
import { computed } from "vue"
import { NDescriptions, NDescriptionsItem, NCard } from "naive-ui"
import { storeToRefs } from "pinia"
const { isMobile } = storeToRefs(usewebSiteStore())
const column = computed(() => {
    return isMobile.value ? 1 : 4
})
const { pkg } = __APP_INFO__
const { dependencies, devDependencies } = pkg
export interface schemaItem {
    version: string
    label: string
}
const schema: schemaItem[] = []
const devSchema: schemaItem[] = []
Object.keys(dependencies).forEach(key => {
    schema.push({ version: dependencies[key], label: key })
})

Object.keys(devDependencies).forEach(key => {
    devSchema.push({ version: devDependencies[key], label: key })
})
</script>

<style scoped></style>
