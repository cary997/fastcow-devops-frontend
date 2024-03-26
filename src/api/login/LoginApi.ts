import { http } from "@/utils/http/index"

export interface loginRequest {
    /**验证方式 */
    grant_type?: string
    /**账户 */
    username: string
    /**密码 */
    password: string
    /** 作用域*/
    scope?: string
    /** 客户端标识*/
    client_id?: string
    /**客户端令牌 */
    client_secret?: string
    /**totp验证码*/
    totp_code?: string
}

export interface tokenInfo {
    /** token */
    access_token: string
    /** `access`的过期时间（时间戳10位） */
    expires_in: string
    /** 用于调用刷新accessToken的接口时所需的token */
    refresh_token: string
    /** 用户id */
    user_id: number
    /** 用户名 */
    username?: string
    /** 显示名称 */
    nickname?: string
    /** 令牌类型 */
    token_type?: string
    /**TOTP设置是否开启 */
    totp?: boolean
    /**用户是否未绑定令牌 */
    new?: boolean
    /**新生成令牌绑定链接 */
    new_totp?: string
}

export interface TokenResult extends BaseResponse {
    data: tokenInfo
}

/** 登录 */
export const accessTokenApi = (data?: loginRequest) => {
    return http.request<TokenResult>(
        "post",
        "/access-token",
        { data }, // 自定义的axios配置在下面对象填写即可
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    )
}

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
    return http.request<TokenResult>("post", "/refresh-token", { data })
}
