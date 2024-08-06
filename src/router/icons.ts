import {
    PersonAccounts24Filled,
    Settings24Filled,
    ClipboardTaskListLtr24Filled,
} from "@vicons/fluent"
import { Home } from "@vicons/ionicons5"
import { renderIcon } from "@/utils/tools"
import { Server } from "@vicons/fa"

//前端路由图标映射表
export const RouterIcon = {
    HomeIcon: Home,
    AssetsIcon: Server,
    AuthIcon: PersonAccounts24Filled,
    SettingsIcon: Settings24Filled,
    TasksIcon: ClipboardTaskListLtr24Filled,
}

export function IconSelect(name) {
    return renderIcon(RouterIcon[name], { size: 18 })
}
