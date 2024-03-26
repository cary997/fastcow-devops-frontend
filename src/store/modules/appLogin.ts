import { defineStore } from "pinia"
import { userType } from "./types.d"
import { resetRouter, router } from "@/router"
import { setToken, getToken, removeToken } from "@/utils/storage/userLogin"
import {
    TokenResult,
    accessTokenApi,
    loginRequest,
    refreshTokenApi,
    tokenInfo,
} from "@/api/login/LoginApi"
import { useTabsStoreHook } from "./appTabs"
import { initRouter } from "@/router/routerUtils"
import useSettingsStore from "./appSettings"

const useUserStore = defineStore({
    id: "app-user",
    state: (): userType => ({
        //用户id
        user_id: getToken()?.user_id ?? "",
        //用户名
        username: getToken()?.username ?? "",
        //显示名
        nickname: getToken()?.nickname ?? "",
    }),
    actions: {
        /** 登入 */
        async loginByUsername(data: loginRequest) {
            return new Promise<tokenInfo>((resolve, reject) => {
                accessTokenApi(data)
                    .then(res => {
                        if (res.code) {
                            resolve(res.data)
                        }
                    })
                    .catch((error: Error) => {
                        reject(error)
                    })
            })
        },
        async cacheToken(data: tokenInfo) {
            setToken(data)
            this.user_id = data.user_id
            this.username = data.username
            this.nickname = data.nickname
        },
        /** 前端登出（不调用接口） */
        loginOut() {
            this.user_id = undefined
            this.username = undefined
            this.nickname = undefined
            resetRouter()
            removeToken()
            router.replace("/login")
            useTabsStoreHook().handleTags("clear")
        },
        /** 刷新`token` */
        async handRefreshToken(data: object) {
            return new Promise<TokenResult>((resolve, reject) => {
                refreshTokenApi(data)
                    .then(async (res: TokenResult) => {
                        if (res.code) {
                            setToken(res.data)
                            this.user_id = res.data.user_id
                            this.username = res.data.username
                            this.nickname = res.data.nickname
                            await initRouter(true)
                            resolve(res)
                        }
                    })
                    .catch((error: Error) => {
                        reject(error)
                    })
            })
        },
    },
})
export default useUserStore
