/**常规配置 */
export interface generalInfo {
    watermark?: boolean
    watermarkContent?: number
    watermarkSize?: number
    user_default_password?: string
    user_default_roles?: Array<number>
}

/**安全配置 */
export interface securityInfo {
    /**控制MFA开启 */
    totp?: boolean
    /**IP地址校验 */
    ip_check?: boolean
    /**IP地址校验模式 */
    ip_check_mode?: number
    /**IP地址黑名单 */
    ip_black_list?: Array<str>
    /**IP地址白名单 */
    ip_white_list?: Array<str>
}
/**ldap连接配置 */
export interface ldapConfingInfo {
    enable?: boolean
    hosts?: Array<string>
    user?: string
    password?: string
    base_ou?: string
    paged_size?: number
    attributes?: {
        username?: string
        nickname?: string
        email?: string
        phone?: string
    }
}
/**ldap同步配置 */
export interface ldapSyncInfo {
    /**启用同步 */
    enable?: boolean
    /**同步间隔（分钟 */
    interval?: number
    /**用户是否默认启用*/
    default_status?: boolean
    /**冲突时策略 1以平台为主 2以ldap为主 */
    sync_rule?: number
}
export interface ldapInfo {
    config?: ldapConfingInfo
    sync?: ldapSyncInfo
}
/**邮件服务配置 */
export interface emailSettingsInfo {
    mail_from?: string
    mail_port?: number
    mail_server?: string
    mail_ssl?: boolean
    mail_password?: string
    mail_start_tls?: boolean
    mail_username?: string
    mail_from_name?: string
}
export interface channelsInfo {
    /**邮件服务配置 */
    email?: emailSettingsInfo
}
/**系统文件路径设置 */
export interface pathSettingsInfo { 
    base_path?: string
    tasks_templates_path?: string
    upload_temp_path?: string
    download_temp_path?: string
}
/**系统设置查询返回结果 */
export interface settingsInfo {
    /**id创建时不用填写，此处用于后端返回时提示 */
    id?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    update_at?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    create_at?: number
    /**常规配置 */
    general?: generalInfo
    /**ldap配置 */
    ldap?: ldapInfo
    /**安全配置 */
    security?: securityInfo
    /**通知渠道配置 */
    channels?: channelsInfo
    /**系统文件路径设置 */
    system_path?: pathSettingsInfo
}

export interface settingsResponse extends BaseResponse {
    data: settingsInfo
}

export type LdapSyncResult = {
    /**
     * 状态
     */
    code?: number;
    /**
     * 提示信息
     */
    message?: (string | null);
    /**
     * 完成时间
     */
    date_done?: (string | null);
    /**
     * 同步总数
     */
    user_num?: (number | null);
    /**
     * 已存在并跳过数量
     */
    skip_num?: (number | null);
    /**
     * 更新数量
     */
    update_num?: (number | null);
    /**
     * 新建数量
     */
    create_num?: (number | null);
};

export interface LdapSyncResultResponse extends BaseResponse {
    /**LDAP同步结果查询响应 */
    data?: (Array<LdapSyncResult> | null);
};

