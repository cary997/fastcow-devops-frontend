/*
 * @Author: Cary
 * @Date: 2023-01-04 20:45:36
 * @LastEditors: Cary
 * @LastEditTime: 2024-03-09 05:49:39
 * @FilePath: /src/utils/http/repeatRequest.ts
 * @Descripttion:
 */
import Axios from "axios"
import qs from "qs"
import { HttpRequestConfig } from "./types.d"

//用于根据当前请求的信息，生成请求 Key
export function generateReqKey(config: HttpRequestConfig) {
    const { method, url, params, data } = config
    return [method, url, qs.stringify(params), qs.stringify(data)].join("&")
}

const pendingRequest = new Map()
//用于把当前请求信息添加到pendingRequest对象中
export function addPendingRequest(config: HttpRequestConfig) {
    const requestKey = generateReqKey(config)
    config.cancelToken =
        config.cancelToken ||
        new Axios.CancelToken(cancel => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel)
            }
        })
}

//检查是否存在重复请求，若存在则取消已发的请求
export function removePendingRequest(config: HttpRequestConfig) {
    const requestKey = generateReqKey(config)
    if (pendingRequest.has(requestKey)) {
        const cancelToken = pendingRequest.get(requestKey)
        cancelToken(requestKey)
        pendingRequest.delete(requestKey)
    }
}
