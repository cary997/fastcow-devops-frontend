<template>
    <div class="flex flex-col space-y-4">
        <div class="flex flex-none">
            <n-input
                size="small"
                v-model:value="searchPattern"
                :placeholder="$t('global.search')"
                clearable
                class="ml-4 mr-2 mt-4"
            >
                <template #prefix>
                    <n-icon :component="Search20Regular" />
                </template>
            </n-input>
        </div>
        <div class="flex flex-row flex-none justify-end items-center mt-4">
            <Auth value="auth_menus_add">
                <n-button
                    size="tiny"
                    @click="handleCreateClick(true)"
                    class="mr-2"
                >
                    {{ $t("menusPage.createRoot") }}
                </n-button>
            </Auth>
            <n-button
                v-if="!expandall"
                size="tiny"
                @click="expandall = true"
                class="mr-2"
            >
                {{ $t("global.expandall") }}
            </n-button>
            <n-button
                v-else
                size="tiny"
                @click="expandall = false"
                class="mr-2"
            >
                {{ $t("global.collapseall") }}
            </n-button>
        </div>

        <n-divider />
        <div class="flex-1">
            <n-scrollbar style="max-height: 600px">
                <n-tree
                    block-line
                    draggable
                    expand-on-click
                    show-line
                    :pattern="searchPattern"
                    :default-expand-all="expandall"
                    :data="menusList"
                    :selected-keys="selectedKeys"
                    :default-selected-keys="defaultKeys"
                    :node-props="nodeProps"
                    @drop="handleDrop"
                    class="ml-4"
                />
                <n-dropdown
                    trigger="manual"
                    placement="bottom-start"
                    :show="showDropdown"
                    :options="options"
                    :x="xRef"
                    :y="yRef"
                    @select="handleSelect"
                    @clickoutside="handleClickoutside"
                />
            </n-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import {
    TreeOption,
    NTree,
    NDropdown,
    NButton,
    NDivider,
    NInput,
    NIcon,
    TreeDropInfo,
    NScrollbar,
} from "naive-ui"
import { useI18n } from "vue-i18n"
import {
    formDisabled,
    menusList,
    defaultKeys,
    selectedKeys,
    delMenusHandle,
    refreshMenusList,
    setMenusHandle,
} from "./menusHandle"
import { menuFormData, currentMenus, menuFormDefaultData } from "./extend"
import { Search20Regular } from "@vicons/fluent"
import { clone } from "@pureadmin/utils"
import { renderIcon } from "@/utils/tools"
import {
    CreateFilled,
    DeleteSweepFilled,
    VerticalAlignTopFilled,
} from "@vicons/material"
import { hasAuth } from "@/components/Global"

const { t } = useI18n()

//控制树是否展开全部
const expandall = ref(false as boolean)
//控制隐藏下拉菜单
const showDropdown = ref(false as boolean)
//搜索框内容
const searchPattern = ref(null)

//下拉菜单选项
const options = [
    {
        label: () => t("action.create"),
        key: "create",
        icon: renderIcon(CreateFilled),
        show: hasAuth("auth_menus_add"),
    },
    {
        label: () => t("action.pinned"),
        key: "pinned",
        icon: renderIcon(VerticalAlignTopFilled),
        show: hasAuth("auth_menus_set"),
    },
    {
        label: () => t("action.delete"),
        key: "delete",
        icon: renderIcon(DeleteSweepFilled),
        show: hasAuth("auth_menus_del"),
    },
]

//下拉菜单出现位置
const xRef = ref(0)
const yRef = ref(0)

//下拉菜单回调
const handleSelect = (key: string) => {
    showDropdown.value = false
    switch (key) {
        //新建菜单
        case "create": {
            //按钮类型和外链类型不能继续新建
            const menuTypeArr = [3, 4]
            if (menuTypeArr.includes(currentMenus.value.meta.menu_type)) {
                window.$message.warning(t("menusPage.createWarningMsg"), {
                    closable: true,
                    duration: 0,
                })
            } else {
                handleCreateClick(false)
            }
            break
        }
        //删除菜单
        case "delete": {
            let { key, children } = currentMenus.value
            if (children) {
                window.$message.error(() => t("TreeTip.noempty"))
            } else {
                window.$dialog.warning({
                    title: t("title.warning"),
                    content: t("menusPage.menusDeleteMsg"),
                    positiveText: t("action.confirm"),
                    negativeText: t("action.cancel"),
                    onPositiveClick: () => {
                        delMenusHandle(key).then(async () => {
                            await refreshMenusList()
                        })
                    },
                })
            }
            break
        }
        //菜单置顶
        case "pinned": {
            if (currentMenus.value.parent) {
                //按钮类型和外链类型不能置顶
                const menuTypeArr = [3, 4]
                if (menuTypeArr.includes(currentMenus.value.meta.menu_type)) {
                    window.$message.warning(t("menusPage.pinnedWarningMsg"), {
                        closable: true,
                        duration: 0,
                    })
                } else {
                    //更新内容
                    let data = { parent: null }
                    ;() => {
                        setMenusHandle(
                            currentMenus.value.key as number,
                            data,
                        ).then(async () => {
                            currentMenus.value.parent = null
                            menuFormData.value = clone(currentMenus.value, true)
                            selectedKeys.value = [menuFormData.value.id]
                            //重新请求刷新菜单列表
                            await refreshMenusList()
                        })
                    }
                }
            } else {
                window.$message.info(t("menusPage.pinnedInfoMsg"), {
                    closable: true,
                    duration: 0,
                })
            }
            break
        }
    }
}

//控制下拉菜单隐藏事件
const handleClickoutside = () => {
    showDropdown.value = false
}

//新建菜单事件回调
const handleCreateClick = (isRoot: boolean) => {
    formDisabled.value = false
    const cloneFormDefaultData = clone(menuFormDefaultData, true)
    if (!isRoot) {
        cloneFormDefaultData.parent = currentMenus.value.id
    }
    menuFormData.value = cloneFormDefaultData
}

//节点绑定事件
const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
        onClick() {
            //如果表单为编写状态则不改变表单的值
            if (formDisabled.value) {
                currentMenus.value = option
                menuFormData.value = clone(currentMenus.value, true)
            } else {
                currentMenus.value = option
            }
            //更改菜单的选中状态
            selectedKeys.value = [menuFormData.value.id]
        },
        onContextmenu(e: MouseEvent): void {
            //如果表单为编写状态则不改变表单的值
            if (formDisabled.value) {
                currentMenus.value = option
            }
            showDropdown.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
            e.preventDefault()
        },
    }
}

//节点拖放
async function handleDrop({ node, dragNode }: TreeDropInfo) {
    //更新内容
    let data = { parent: node.key as number }
    await setMenusHandle(dragNode.key as number, data).then(async () => {
        currentMenus.value = dragNode
        menuFormData.value = clone(currentMenus.value, true)
        selectedKeys.value = [menuFormData.value.id]
        //重新请求刷新菜单列表
        await refreshMenusList()
    })
}
</script>
@/pages/auth/menus/useMenusPageHook
