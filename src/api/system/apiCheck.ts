/*
 * @Author: Cary
 * @Date: 2024-03-03 11:22:01
 * @LastEditors: Cary
 * @LastEditTime: 2024-03-06 09:43:15
 * @FilePath: /src/api/test/testApi.ts
 * @Descripttion:
 */
import { http } from "@/utils/http"
import { emailSettingsInfo, ldapConfingInfo } from "./type"

/**测试发送邮件*/
export const checkEmailSettingsApi = (
    data: emailSettingsInfo,
    receive: string,
) => {
    return http.request<BaseResponse>(
        "post",
        `/system/apicheck/email/?receive=${receive}`,
        { data },
        { printError: false },
    )
}

export interface checkLdapResault {
    username?: string
    nickname?: string
    email?: string
    phone?: string
}
interface checkLdapRespinse extends BaseResponse {
    data?: checkLdapResault
}

/**测试ldap*/
export const checkLdapSettingsApi = (
    data: ldapConfingInfo,
    username: string,
) => {
    return http.request<checkLdapRespinse>(
        "post",
        `/system/apicheck/ldap/?username=${username}`,
        { data },
        { printError: false },
    )
}
