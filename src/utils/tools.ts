/*
 * @Author: Cary
 * @Date: 2024-02-15 22:23:54
 * @LastEditors:
 * @LastEditTime: 2024-02-22 04:19:25
 * @FilePath: /src/utils/tools.ts
 * @Descripttion:
 */

import { NIcon } from "naive-ui"
import { Component, h, unref } from "vue"
import { useClipboard } from "@vueuse/core"
/**渲染Naive ui icon*/
export const renderIcon = (icon: Component, theme: Object = null) => {
    return () => {
        return h(NIcon, theme, {
            default: () => h(icon, theme),
        })
    }
}

/**复制内容到剪切板*/
export function onCopy(value: any) {
    const { isSupported, copy } = useClipboard()
    if (!isSupported.value) {
        window.$message.warning("Browser not supported!")
        return
    }
    if (!value) {
        window.$message.warning("The content is empty!")
        return
    }
    try {
        value = unref(value)
        copy(JSON.stringify(value, null, 2))
        window.$message.success("Copy complete!")
    } catch (e) {
        window.$message.error(e)
    }
}

/**时间戳转换为YYYY-MM-DD HH:mm:ss格式*/
export function timestampFormat(timestamp) {
    //为null直接退出函数
    if (!timestamp) {
        return timestamp
    }
    // 时间戳为10位需*1000，时间戳为13位不需乘1000
    var date = new Date(
        timestamp.toString().length == 10
            ? parseInt(timestamp) * 1000
            : parseInt(timestamp),
    )
    var Y = date.getFullYear() + "-"
    var M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-"
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " "
    var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
    var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":"
    var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
}

/**批量删除object中的属性*/
export function delObjectProps(obj: object, keys: Array<string>) {
    keys.map(key => {
        if (key in obj) {
            delete obj[key]
        }
    })
    return obj
}

/**移除对象中值为null的元素 不改变原对象 */
export function removeObjectEmpty(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([k, v]) => {
            if (v == null || v === "") {
                return false
            } else {
                return true
            }
        }),
    )
}
