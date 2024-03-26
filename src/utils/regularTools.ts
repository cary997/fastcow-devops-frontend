/**密码强度校验 至少包含大写字母+小写字母+数字*/
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
/**用户名校验 字母-_ */
export const usernamePattern = /^[a-zA-Z]+[a-zA-Z0-9_-]{2,32}$/
/**判断是否以http(s)://开头 */
export const httpUrlPattern = /^https?:\/\/.+/
/**手机1开头11位 */
export const isMobilePattern = /^1\d{10}$/
/**判断是否是邮箱格式 */
export const isEmailPattenrn =
    /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
/**支持0.0.0.0到255.255.255.255(没有前导0) */
export const ipv4Pattenrn =
    /^(([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])$/
/**支持000.000.000.000到255.255.255.255(可以含有前导0) */
export const ipv4AllPattenrn =
    /^((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/
/**判断IP地址段127.0.0.0/24格式 */
export const maskIpv4Pattenrn =
    /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){3}((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\/){1}(\d|[1-3]\d)$/
/**判断IP地址段127.0.0.1-127.0.0.255格式 */
export const continuousIpv4Pattenrn =
    /^(([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])(-)(([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])$/
/**判断是否为移动端浏览器-_ */
export const isMobileBrowserPattern =
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
