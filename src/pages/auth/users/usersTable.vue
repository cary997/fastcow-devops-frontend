<template>
    <div class="flex flex-col">
        <BaseTables
            remote
            :tableTitle="t('usersPage.tableTitle')"
            v-model:columns="tableColumns"
            :data="usersListData"
            :row-key="columnsRowKey"
            :refresData="handleRefreshUsersData"
            :loading="loadingRef"
            :pagination="paginationReactive"
            :bordered="false"
            @update:checked-row-keys="handleCheckRow"
        >
            <template v-slot:tableFitter>
                <usersFitter />
            </template>
            <template v-slot:tableHeaderAction>
                <Auth value="auth_users_bulkset">
                    <n-dropdown
                        trigger="click"
                        :options="bulkSetOptions"
                        @select="handleBulkSetSelect"
                    >
                        <NButton
                            v-show="bulkButtonShow"
                            type="info"
                            size="small"
                        >
                            <template #icon>
                                <n-icon>
                                    <PersonEdit20Filled />
                                </n-icon>
                            </template>
                            {{ $t("usersPage.button.bulkEdit") }}
                        </NButton>
                    </n-dropdown>
                </Auth>
                <Auth value="auth_users_bulkdel">
                    <NButton
                        v-show="bulkButtonShow"
                        type="error"
                        size="small"
                        @click="handleBulkDelUsers"
                    >
                        <template #icon>
                            <n-icon>
                                <PersonDelete24Filled />
                            </n-icon>
                        </template>
                        {{ $t("usersPage.button.bulkDel") }}
                    </NButton>
                </Auth>
                <Auth value="auth_users_add">
                    <NButton
                        type="primary"
                        size="small"
                        @click="handleAddUsers"
                    >
                        <template #icon>
                            <n-icon>
                                <AddCircle16Filled />
                            </n-icon>
                        </template>
                        {{ $t("usersPage.button.addUser") }}
                    </NButton>
                </Auth>
            </template>
        </BaseTables>
        <n-modal
            v-model:show="showUsersModal"
            preset="card"
            :title="t('usersPage.modalTitle')"
            :style="{ 'max-width': '36rem' }"
            size="medium"
            :bordered="false"
            :closable="false"
            :close-on-esc="false"
            :mask-closable="false"
            :segmented="{
                content: true,
                action: true,
            }"
        >
            <usersForm />
            <template #action>
                <div class="flex justify-end space-x-4">
                    <n-button
                        size="small"
                        type="warning"
                        @click="handleCancelClick"
                    >
                        {{ $t("action.cancel") }}
                    </n-button>
                    <n-button
                        size="small"
                        type="primary"
                        @click="handleSubmitClick"
                    >
                        {{ $t("action.submit") }}
                    </n-button>
                </div>
            </template>
        </n-modal>
        <userBulkForm />
        <n-drawer
            v-model:show="showUsersDrawer"
            :default-width="400"
            resizable
            placement="right"
        >
            <n-drawer-content
                body-content-style="padding-left: 0; padding-right: 0;"
                :title="currentUsersData.nickname"
                closable
            >
                <usersForm />
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup lang="ts">
import usersFitter from "./usersFitter.vue"
import usersForm from "./usersForm.vue"
import {
    NButton,
    NModal,
    NDrawer,
    NDrawerContent,
    NIcon,
    NDropdown,
    DataTableRowKey,
} from "naive-ui"
import {
    usersListData,
    showUsersModal,
    addUsersHandle,
    refreshUsersList,
    usersFormRef,
    showUsersDrawer,
    setUsersHandle,
    delUsersHandle,
    setUsersPasswordHandle,
    paginationReactive,
    loadingRef,
    qureyParams,
    queryUsersTablesHandle,
    bulkDelUsersHandle,
} from "@/hooks/auth/useUsersPageHook"
import {
    createColumns,
    currentUsersData,
    userSetStatus,
    usersData,
    usersDefaultData,
    columnsRowKey,
    bulkButtonShow,
    bulkUserFormShow,
    bulkUserFormTypeIf,
    bulkUserFormStatusIf,
    bulkUserFormRolesIf,
    checkRowKeys,
} from "./extend"
import { clone } from "@pureadmin/utils"
import BaseTables from "@components/Tables/BaseTables.vue"
import userBulkForm from "./usersBulkForm.vue"
import {
    AddCircle16Filled,
    PersonEdit20Filled,
    PersonDelete24Filled,
} from "@vicons/fluent"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"
import useSettingsStore from "@/store/modules/appSettings"
import { initRolesList } from "@/hooks/auth/useRolesPageHook"
import { resetTotpApi } from "@/api/auth/UsersApi"

const { t } = useI18n()

//表格列生成
const tableColumns = ref(
    createColumns({
        //查看用户详情操作
        getUser(rowData) {
            currentUsersData.value = rowData
            showUsersDrawer.value = true
        },
        //编辑用户操作
        setUser(rowData) {
            userSetStatus.value = true
            usersData.value = clone(rowData, true)
            showUsersModal.value = true
        },
        delUser(rowData) {
            window.$dialog.warning({
                title: t("title.warning"),
                content:
                    t("usersPage.usersDeleteMsg") + "—— " + rowData.nickname,
                positiveText: t("action.confirm"),
                negativeText: t("action.cancel"),
                onPositiveClick: () => {
                    delUsersHandle(rowData.id).then(async () => {
                        await refreshUsersList(qureyParams.value)
                    })
                },
            })
        },
        rePassword(rowData) {
            window.$dialog.warning({
                title: t("title.warning"),
                content:
                    t("usersPage.usersRepwdMsg") + "—— " + rowData.nickname,
                positiveText: t("action.confirm"),
                negativeText: t("action.cancel"),
                onPositiveClick: () => {
                    const data = {
                        user_id: rowData.id,
                        is_reset: true,
                    }
                    setUsersPasswordHandle(data).then(res => {
                        window.$dialog.success({
                            title: t("title.success"),
                            content:
                                t("usersPage.usersResetPwdSuccessMsg") +
                                "—— " +
                                res.new_password,
                            positiveText: t("action.confirm"),
                        })
                    })
                },
            })
        },
        reTotp(rowData) {
            window.$dialog.warning({
                title: t("title.warning"),
                content:
                    t("usersPage.usersReTotpMsg") + "—— " + rowData.nickname,
                positiveText: t("action.confirm"),
                negativeText: t("action.cancel"),
                onPositiveClick: () => {
                    resetTotpApi(rowData.id).then(res => {
                        if (res.code) {
                            window.$dialog.success({
                                title: t("title.success"),
                                content: t(
                                    "usersPage.usersResetTotpSuccessMsg",
                                ),
                                positiveText: t("action.confirm"),
                            })
                        } else {
                            window.$message.error(res.message)
                        }
                    })
                },
            })
        },
    }),
)

//新建用户回调
const handleAddUsers = () => {
    let cloneusersData = clone(usersDefaultData, true)
    usersData.value = cloneusersData
    showUsersModal.value = true
}

//刷新表格数据
const handleRefreshUsersData = async () => {
    await refreshUsersList(qureyParams.value)
}

//提交事件
const handleSubmitClick = () => {
    usersFormRef.value?.validate(errors => {
        if (!errors) {
            //如果表单数据不包含ID则为新建，包含则为更新
            if (!usersData.value.id) {
                //创建用户
                addUsersHandle(usersData.value).then(async () => {
                    await refreshUsersList(qureyParams.value)
                    showUsersModal.value = false
                    userSetStatus.value = false
                })
            } else {
                const {
                    id: key,
                    nickname,
                    phone,
                    email,
                    user_type,
                    user_status,
                    roles,
                } = usersData.value
                const reqData = {
                    nickname: nickname,
                    phone: phone,
                    email: email,
                    user_type: user_type,
                    user_status: user_status,
                    roles: roles,
                    /**是否要更新角色，更新则必须设置为true*/
                    update_roles: true,
                }
                setUsersHandle(key, reqData).then(async () => {
                    await refreshUsersList(qureyParams.value)
                    showUsersModal.value = false
                    userSetStatus.value = false
                })
            }
        }
    })
}

//取消事件
const handleCancelClick = () => {
    showUsersModal.value = false
    userSetStatus.value = false
}

//选中回调
const handleCheckRow = (rowKeys: DataTableRowKey[]) => {
    checkRowKeys.value = rowKeys
    rowKeys.length > 1
        ? (bulkButtonShow.value = true)
        : (bulkButtonShow.value = false)
}

//批量编辑
const bulkSetOptions = [
    {
        label: () => t("usersPage.tableData.type"),
        key: "user_type",
    },
    {
        label: () => t("usersPage.tableData.status"),
        key: "user_status",
    },
    {
        label: () => t("usersPage.tableData.roles"),
        key: "roles",
    },
]
const handleBulkSetSelect = (key: string) => {
    bulkUserFormShow.value = true
    switch (key) {
        case "user_type": {
            bulkUserFormTypeIf.value = true
            break
        }
        case "user_status": {
            bulkUserFormStatusIf.value = true
            break
        }
        case "roles": {
            bulkUserFormRolesIf.value = true
            break
        }
    }
}
//批量删除
const handleBulkDelUsers = () => {
    window.$dialog.warning({
        title: t("title.warning"),
        content:
            t("usersPage.usersDeleteMsg") +
            "—— " +
            `A total of  ${checkRowKeys.value.length} users are selected.`,
        positiveText: t("action.confirm"),
        negativeText: t("action.cancel"),
        onPositiveClick: () => {
            const data = {
                user_list: checkRowKeys.value,
            }
            bulkDelUsersHandle(data).then(async () => {
                await refreshUsersList(qureyParams.value)
            })
        },
    })
}

//初始化分页
onBeforeMount(async () => {
    await queryUsersTablesHandle(qureyParams.value)
    //初始化角色列表
    await initRolesList()
})
</script>
