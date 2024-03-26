import { $t } from "@/settings/i18n"
import { FormItemRule, FormRules } from "naive-ui"

//表单验证规则
export const rolesFromRules: FormRules = {
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
    nickname: {
        required: true,
        trigger: ["blur", "input"],
        message: () => $t("Form.required"),
    },
}
