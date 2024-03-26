// src\stores\app.ts
import { defineStore } from "pinia"
import { zhCN, dateZhCN } from "naive-ui"
import { LANG_VALUE } from "@/settings/i18n/enum"
import { getLanguage } from "@/utils/storage/Language"

interface languageState {
    language: string
}

const useLanguageStore = defineStore({
    id: "app-language",
    state: (): languageState => ({
        language: getLanguage(),
    }),
    getters: {
        locale(state) {
            if (state.language === LANG_VALUE.En) {
                return null
            } else {
                return zhCN
            }
        },
        dateLocale(state) {
            if (state.language === LANG_VALUE.En) {
                return null
            } else {
                return dateZhCN
            }
        },
    },
})

export default useLanguageStore
