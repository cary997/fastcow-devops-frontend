import { UserCreateRequest, bulkSetUsersRequest } from "@/api/auth/types"
import { rolesListData } from "@/hooks/auth/useRolesPageHook"
import { $t } from "@/settings/i18n"
import {
    CircleSmall24Filled,
    Edit24Regular,
    Info24Regular,
    MoreHorizontal48Regular,
} from "@vicons/fluent"
import { Password, Delete } from "@vicons/carbon"
import { Password16Filled } from "@vicons/fluent"
import {
    FormItemRule,
    FormRules,
    NButton,
    NIcon,
    NTag,
    NPopover,
    NTooltip,
} from "naive-ui"
import { h, ref } from "vue"
import { clone } from "@pureadmin/utils"
import {
    httpUrlPattern,
    isEmailPattenrn,
    isMobilePattern,
    passwordPattern,
    usernamePattern,
} from "@/utils/regularTools"
import { hasAuth } from "@/components/Global"


//用户为编辑状态
export const userSetStatus = ref<boolean>(false)

/** 用户类型 1-local 2-ldap */
export const usersOptions = [
    {
        label: () => $t("usersPage.tableData.local"),
        value: 1,
    },
    {
        label: "ldap",
        value: 2,
    },
]
/** 用户状态  */
export const statusOptions = [
    {
        label: () => $t("status.enable"),
        value: 1,
    },
    {
        label: () => $t("status.disable"),
        value: 2,
    },
]

/**批量编辑表单默认数据 */
export const defaultBulkUsersData: bulkSetUsersRequest = {
    user_list: null,
    user_type: null,
    user_status: null,
    roles: [],
    /**是否要更新角色，更新则必须设置为true*/
    update_roles: true,
}
export const bulkUsersData = ref(clone(defaultBulkUsersData, true))

/**控制批量操作按钮隐藏 */
export const bulkButtonShow = ref<boolean>(false)
/**控制批量编辑表单显示 */
export const bulkUserFormShow = ref(false)
export const bulkUserFormTypeIf = ref(false)
export const bulkUserFormStatusIf = ref(false)
export const bulkUserFormRolesIf = ref(false)

/**用户表单默认数据 */
export const usersDefaultData: UserCreateRequest = {
    /** 用户名 （必填）*/
    username: null,
    /** 显示名称 （必填）*/
    nickname: null,
    /** 密码 （创建时必填）*/
    password: null,
    /** 手机号 */
    phone: null,
    /** 邮箱 */
    email: null,
    /** 用户类型 */
    user_type: 1,
    /** 用户状态 */
    user_status: true,
    /** 角色 */
    roles: [],
}
//表单绑定数据
export const usersData = ref<UserCreateRequest>(clone(usersDefaultData, true))

//当前用户
export const currentUsersData = ref<UserCreateRequest>(
    clone(usersDefaultData, true),
)

export const usersRules: FormRules = {
    username: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error($t("Form.required"))
            } else if (
                !usernamePattern.test(value) &&
                !httpUrlPattern.test(value)
            ) {
                return new Error($t("Form.format_error"))
            }
            return true
        },
    },
    nickname: {
        required: true,
        trigger: ["blur", "input"],
        message: () => $t("Form.required"),
    },
    password: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error($t("Form.required"))
            } else if (!passwordPattern.test(value)) {
                return new Error($t("headers.changePwdModal.pwdErrorMsg"))
            }
            return true
        },
    },
    email: {
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return true
            } else if (!isEmailPattenrn.test(value)) {
                return new Error($t("Form.format_error"))
            }
            return true
        },
    },
    phone: {
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return true
            } else if (!isMobilePattern.test(value)) {
                return new Error($t("Form.format_error"))
            }
            return true
        },
    },
}

/**表格列的key */
export const columnsRowKey = (row: UserCreateRequest) => row.id
/**选中的key */
export const checkRowKeys = ref([])
/**表格列*/
export const createColumns = ({
    getUser,
    setUser,
    delUser,
    rePassword,
    reTotp,
}: {
    getUser: (rowData: UserCreateRequest) => void
    setUser: (rowData: UserCreateRequest) => void
    delUser: (rowData: UserCreateRequest) => void
    rePassword: (rowData: UserCreateRequest) => void
    reTotp: (rowData: UserCreateRequest) => void
}): BaseTableColumns<UserCreateRequest> => {
    return [
        {
            title: $t("usersPage.tableData.selection"),
            key: "selection",
            type: "selection",
        },
        {
            title: $t("usersPage.tableData.username"),
            key: "username",
            align: "center",
        },
        {
            title: $t("usersPage.tableData.nickname"),
            key: "nickname",
            align: "center",
        },
        {
            title: $t("usersPage.tableData.email"),
            key: "email",
            align: "center",
        },
        {
            title: $t("usersPage.tableData.phone"),
            key: "phone",
            align: "center",
        },
        {
            title: $t("usersPage.tableData.type"),
            key: "user_type",
            align: "center",
            render(row) {
                return row.user_type == 1
                    ? $t("usersPage.tableData.local")
                    : "ldap"
            },
        },
        {
            title: $t("usersPage.tableData.roles"),
            key: "roles",
            align: "center",
            minWidth: 50,
            ellipsis: {
                tooltip: true,
            },
            resizable: true,
            render(row) {
                const tags = row.roles.map(key => {
                    return h(
                        NTag,
                        {
                            type: rolesListData.value.length
                                ? rolesListData.value.find(r => r.id === key)
                                      .role_status
                                    ? "primary"
                                    : "error"
                                : "default",
                            round: true,
                            size: "small",
                            bordered: false,
                            class: "mr-1",
                        },
                        {
                            default: () =>
                                rolesListData.value.length
                                    ? rolesListData.value.find(
                                          r => r.id === key,
                                      ).nickname
                                    : null,
                        },
                    )
                })
                return tags
            },
        },
        {
            title: $t("usersPage.tableData.status"),
            key: "user_status",
            align: "center",
            minWidth: 50,
            maxWidth: 100,
            resizable: true,
            render(row) {
                return h(NIcon, {
                    class: row.user_status ? "text-success" : "text-error",
                    component: CircleSmall24Filled,
                })
            },
        },
        {
            title: $t("usersPage.tableData.action"),
            key: "actions",
            align: "center",
            render(row) {
                return h(
                    "div",
                    {
                        class: "flex flex-row flex-wrap m:space-x-4",
                    },
                    [
                        hasAuth("auth_users_details")
                            ? h("span", { class: "flex flex-row space-x-1" }, [
                                  h(NIcon, {
                                      size: 15,
                                      component: Info24Regular,
                                  }),
                                  h(
                                      NButton,
                                      {
                                          size: "small",
                                          text: true,
                                          type: "primary",
                                          onClick: () => getUser(row),
                                      },
                                      {
                                          default: () =>
                                              $t("usersPage.button.details"),
                                      },
                                  ),
                              ])
                            : null,
                        hasAuth("auth_users_set")
                            ? h("span", { class: "flex flex-row space-x-1" }, [
                                  h(NIcon, {
                                      size: 15,
                                      component: Edit24Regular,
                                  }),
                                  h(
                                      NButton,
                                      {
                                          size: "small",
                                          text: true,
                                          type: "primary",
                                          onClick: () => setUser(row),
                                      },
                                      {
                                          default: () => $t("action.edit"),
                                      },
                                  ),
                              ])
                            : null,
                        h(
                            NTooltip,
                            { trigger: "hover" },
                            {
                                default: () => $t("action.more"),
                                trigger: () =>
                                    h(
                                        NPopover,
                                        {
                                            trigger: "hover",
                                            placement: "bottom",
                                        },
                                        {
                                            trigger: () =>
                                                h(NIcon, {
                                                    size: 20,
                                                    component:
                                                        MoreHorizontal48Regular,
                                                }),
                                            default: () =>
                                                h(
                                                    "div",
                                                    {
                                                        class: "flex flex-col space-y-2",
                                                    },
                                                    [
                                                        hasAuth(
                                                            "auth_users_del",
                                                        )
                                                            ? h(
                                                                  NButton,
                                                                  {
                                                                      size: "tiny",
                                                                      text: true,
                                                                      onClick:
                                                                          () =>
                                                                              delUser(
                                                                                  row,
                                                                              ),
                                                                  },
                                                                  {
                                                                      default:
                                                                          () =>
                                                                              $t(
                                                                                  "usersPage.button.delUser",
                                                                              ),
                                                                      icon: () =>
                                                                          h(
                                                                              NIcon,
                                                                              {
                                                                                  size: 15,
                                                                                  component:
                                                                                      Delete,
                                                                              },
                                                                          ),
                                                                  },
                                                              )
                                                            : null,
                                                        hasAuth(
                                                            "auth_users_pwdset",
                                                        )
                                                            ? h(
                                                                  NButton,
                                                                  {
                                                                      size: "tiny",
                                                                      text: true,
                                                                      onClick:
                                                                          () =>
                                                                              rePassword(
                                                                                  row,
                                                                              ),
                                                                  },
                                                                  {
                                                                      default:
                                                                          () =>
                                                                              $t(
                                                                                  "usersPage.button.resetPassword",
                                                                              ),
                                                                      icon: () =>
                                                                          h(
                                                                              NIcon,
                                                                              {
                                                                                  size: 15,
                                                                                  component:
                                                                                      Password,
                                                                              },
                                                                          ),
                                                                  },
                                                              )
                                                            : null,
                                                        hasAuth(
                                                            "auth_users_otpreset",
                                                        )
                                                            ? h(
                                                                  NButton,
                                                                  {
                                                                      size: "tiny",
                                                                      text: true,
                                                                      onClick:
                                                                          () =>
                                                                              reTotp(
                                                                                  row,
                                                                              ),
                                                                  },
                                                                  {
                                                                      default:
                                                                          () =>
                                                                              $t(
                                                                                  "usersPage.button.resetTotp",
                                                                              ),
                                                                      icon: () =>
                                                                          h(
                                                                              NIcon,
                                                                              {
                                                                                  size: 15,
                                                                                  component:
                                                                                      Password16Filled,
                                                                              },
                                                                          ),
                                                                  },
                                                              )
                                                            : null,
                                                    ],
                                                ),
                                        },
                                    ),
                            },
                        ),
                    ],
                )
            },
        },
    ]
}
