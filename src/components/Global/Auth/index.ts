import { useMenusStoreHook } from "@/store/modules/appMenus"
import { isIncludeAllChildren, isString } from "@pureadmin/utils"
import { storeToRefs } from "pinia"
import Auth from "./Auth"

const { wholeMenusButton } = storeToRefs(useMenusStoreHook())

/**判断组件or按钮权限 */
function hasAuth(value: string | Array<string>): boolean {
    if (!value) return false
    if (wholeMenusButton.value.length === 0) return false
    const isAuths = isString(value)
        ? wholeMenusButton.value.includes(value)
        : isIncludeAllChildren(value, wholeMenusButton.value)
    return isAuths ? true : false
}

export { hasAuth, Auth }
