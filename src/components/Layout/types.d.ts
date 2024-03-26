import { FunctionalComponent } from "vue"

export type routeMetaType = {
    title?: string
    en_title?: string
    icon?: string | FunctionalComponent
    showLink?: boolean
    savedPosition?: boolean
}

export type RouteConfigs = {
    path?: string
    parentPath?: string
    query?: object
    params?: object
    meta?: routeMetaType
    children?: RouteConfigs[]
    name?: string
}

export const defaultTab = {
    key: "home",
    show: true,
    menu_type: 2,
    tab: "首页",
    en_tab: "Home",
    hiddenTag: false,
    checked: true,
}
