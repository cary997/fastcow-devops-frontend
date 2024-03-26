import { menuType } from "@/api/auth/types"
import { $t } from "@/settings/i18n"
import { httpUrlPattern } from "@/utils/regularTools"
import { FormItemRule, FormRules } from "naive-ui"
import { ref } from "vue"

//表单默认数据 初始化表单使用
export const menuFormDefaultData: menuType = {
    path: null,
    name: null,
    redirect: null,
    component: null,
    meta: {
        title: null,
        en_title: null,
        menu_type: null,
        icon: null,
        showLink: true,
        showParent: true,
        keepAlive: false,
        frameSrc: null,
        frameLoading: true,
        hiddenTag: false,
        enterTransition: null,
        leaveTransition: null,
        rank: null,
    },
    parent: null,
}

//表单数据
export const menuFormData = ref<menuType>({ ...menuFormDefaultData })

//当前选中的菜单
export const currentMenus = ref(null)

//表单验证规则
export const menuRules: FormRules = {
    name: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error($t("Form.required"))
            } else if (
                !/^[a-zA-Z]+[a-zA-Z0-9_-]{2,32}$/.test(value) &&
                !/^https?:\/\/.+/.test(value)
            ) {
                return new Error($t("Form.format_error"))
            }
            return true
        },
    },
    path: {
        required: true,
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return new Error($t("Form.required"))
            } else if (!/^\//.test(value)) {
                return new Error($t("Form.format_error") + " /path/xxx")
            }
            return true
        },
    },
    redirect: {
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return true
            } else if (!/^\//.test(value)) {
                return new Error($t("Form.format_error") + " /path/xxx")
            }
            return true
        },
    },
    component: {
        trigger: ["blur", "input"],
        validator(rule: FormItemRule, value: string) {
            if (!value) {
                return true
            } else if (!/^\//.test(value)) {
                return new Error($t("Form.format_error") + " /path/xxx")
            }
            return true
        },
    },
    meta: {
        title: {
            required: true,
            trigger: ["blur", "input"],
            message: () => $t("Form.required"),
        },
        en_title: {
            required: true,
            trigger: ["blur", "input"],
            message: () => $t("Form.required"),
        },
        menu_type: {
            required: true,
            trigger: "blur",
            validator(rule: FormItemRule, value: number) {
                if (!value) {
                    return new Error($t("Form.required"))
                }
                return true
            },
        },
        frameSrc: {
            trigger: "blur",
            validator(rule: FormItemRule, value: string) {
                if (!value) {
                    return true
                } else if (!httpUrlPattern.test(value)) {
                    return new Error($t("Form.format_error"))
                }
                return true
            },
        },
    },
}
