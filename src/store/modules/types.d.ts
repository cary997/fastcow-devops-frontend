import { RouteRecordName } from "vue-router"

export type userType = {
    user_id?: string | number
    username?: string
    nickname?: string
}

export type cacheType = {
    mode: string
    name?: RouteRecordName
}

export type multiType = {
    key: string
    tab: string
    en_tab: string
    hiddenTag: boolean
    show: boolean
    menu_type: number
    checked: boolean
}
