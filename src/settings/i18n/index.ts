import { I18n, createI18n } from "vue-i18n"
import { LANG_VALUE } from "./enum"
import { getLanguage } from "@/utils/storage/Language"
import { App } from "vue"

function siphonI18n(prefix = "zh-CN") {
    return Object.fromEntries(
        Object.entries(
            import.meta.glob("./lang/*.y(a)?ml", { eager: true }),
        ).map(([key, value]: any) => {
            const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1]
            return [matched, value.default]
        }),
    )[prefix]
}

export function $t(message: any = "") {
    if (!message) {
        return ""
    }
    return i18n.global.t.call(i18n.global.locale, message)
}

/** 加载全部yaml语言配置 */
export const localesConfigs = {
    zh: {
        ...siphonI18n("zh-CN"),
    },
    en: {
        ...siphonI18n("en"),
    },
}

export const i18n: I18n = createI18n({
    legacy: false,
    locale: getLanguage(),
    globalInjection: true,

    fallbackLocale: "en",
    messages: {
        [LANG_VALUE.Zh]: localesConfigs.zh,
        [LANG_VALUE.En]: localesConfigs.en,
    },
})

export function setupI18n(app: App<Element>) {
    app.use(i18n)
}
