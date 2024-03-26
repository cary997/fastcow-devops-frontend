import {
    getSystemSettingsApi,
    setSystemSettingsApi,
} from "@/api/system/settingsApi"
import { settingsInfo, settingsResponse } from "@/api/system/type"
import { ref } from "vue"
export const saveDisable = ref(false)
export const saveLoading = ref(false)

export const whiteListData = ref(null)
export const blackListData = ref(null)
/**获取系统配置*/
export async function getSystemSettingsHandle() {
    return new Promise<settingsInfo>((resolve, reject) => {
        getSystemSettingsApi()
            .then((res: settingsResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

/**更新系统配置*/
export async function setSystemSettingsHandle(data: settingsInfo) {
    return new Promise<settingsInfo>((resolve, reject) => {
        setSystemSettingsApi(data)
            .then((res: settingsResponse) => {
                if (res.code) {
                    window.$message.success(res.message)
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}
