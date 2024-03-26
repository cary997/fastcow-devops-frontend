import axios from "axios"
import { App } from "vue"

//网站的一些默认配置
export const simpleConfig = Object.freeze({
    //后端路由白名单，不需要token验证
    whiteListBackend: ["/refresh-token", "/access-token"],
    //前端路由白名单，不需要token验证
    whiteListFrontend: ["/login"],
})

let config: object = {}
const { VITE_PUBLIC_PATH } = import.meta.env

export const setConfig = (cfg?: unknown) => {
    config = Object.assign(config, cfg)
}

export const getConfig = (key?: string): PlatformConfigs => {
    if (typeof key === "string") {
        const arr = key.split(".")
        if (arr && arr.length) {
            let data = config
            arr.forEach(v => {
                if (data && typeof data[v] !== "undefined") {
                    data = data[v]
                } else {
                    data = null
                }
            })
            return data
        }
    }
    return config
}

/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
    app.config.globalProperties.$config = getConfig()
    return axios({
        method: "get",
        url: `${VITE_PUBLIC_PATH}platform-config.json`,
    })
        .then(({ data: config }) => {
            let $config = app.config.globalProperties.$config
            // 自动注入项目配置
            if (app && $config && typeof config === "object") {
                $config = Object.assign($config, config)
                app.config.globalProperties.$config = $config
                // 设置全局配置
                setConfig($config)
            }
            return $config
        })
        .catch(() => {
            throw "请在public文件夹下添加platform-config.json配置文件"
        })
}
