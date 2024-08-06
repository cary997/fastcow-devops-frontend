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

import { useClipboard, usePermission } from "@vueuse/core"

/**渲染Naive ui icon*/
export const renderIcon = (icon: Component, theme: Object = null) => {
  return () => {
    return h(NIcon, theme, {
      default: () => h(icon, theme),
    })
  }
}

/**复制内容到剪切板*/
export async function onCopy(value: string) {
  const { isSupported, copy } = useClipboard({
    source: value,
    // legacy: true,
  })
  console.log(isSupported.value)
  if (!isSupported.value) {
    window.$message.warning("Browser not supported!")
  } else {
    const data = unref(value)
    // copy(JSON.stringify(value, null, 2))
    if (navigator.clipboard && value != null) {
      await navigator.clipboard
        .writeText(data)
        .then(() => {
          window.$message.success("Copy complete!")
        })
        .catch(error => {
          window.$message.error(error)
        })
    } else {
      await copy(data)
        .then(() => {
          window.$message.success("Copy complete!")
        })
        .catch(error => {
          window.$message.error(error)
        })
    }
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
  var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":"
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
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
/**获取url query参数 */
export function getUrlQuery(url: string) {
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split("?")[1]
  // 创建空对象存储参数
  let obj = {}
  if (!urlStr) return obj
  // 再通过 & 将每一个参数单独分割出来
  let paramsArr = urlStr.split("&")
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    let arr = paramsArr[i].split("=")
    obj[arr[0]] = arr[1]
  }
  return obj
}

//字节转KB、MB、GB、TB、PB
export function bytesToSize(bytes) {
  if (bytes === 0 || bytes == null) return "0 B"
  var k = 1024, // or 1024
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i]
}
