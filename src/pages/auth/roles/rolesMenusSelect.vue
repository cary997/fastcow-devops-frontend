<template>
    <div v-if="menusList.length" class="flex space-x-6 items-center ml-2 mb-2">
        <n-button
            v-if="!expandall"
            size="tiny"
            @click="expandall = true"
            class="mr-2"
        >
            {{ $t("global.expandall") }}
        </n-button>
        <n-button v-else size="tiny" @click="expandall = false" class="mr-2">
            {{ $t("global.collapseall") }}
        </n-button>
    </div>
    <div class="ml-2">
        <n-tree
            block-line
            :cascade="false"
            checkable
            :disabled="!showRolesModal"
            show-line
            :selectable="false"
            :data="menusList"
            :default-expand-all="expandall"
            :checked-keys="rolesData.menus"
            @update:checked-keys="updateCheckedKeys"
        />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { NTree, NButton } from "naive-ui"
import { initMenuList, menusList } from "@/hooks/useAuthHook"
import { showRolesModal, rolesData } from "./rolesHandle"

//控制树是否展开全部
const expandall = ref(true as boolean)

//勾选状态变化时的回调
const updateCheckedKeys = (keys: Array<string | number>) => {
    rolesData.value.menus = keys as number[]
}

//初始化菜单列表
onMounted(async () => {
    await initMenuList()
})
</script>
@/pages/auth/roles/useRolesPageHook @/pages/auth/menus/useMenusPageHook
