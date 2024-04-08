import Axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CustomParamsSerializer,
} from "axios"
import {
    HttpError,
    RequestMethods,
    HttpResponse,
    HttpRequestConfig,
} from "./types.d"
import { stringify } from "qs"
import { getToken, formatToken } from "@utils/storage/userLogin"
import { simpleConfig } from "@/settings/config"
import useUserStore from "@/store/modules/appLogin"
import { getErrors } from "./errors"
import NProgress from "@utils/progress"

// 配置参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
    //后端请求路径
    baseURL: import.meta.env.VITE_BASE_API,
    // 请求超时时间
    timeout: 10000,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
    paramsSerializer: {
        serialize: stringify as unknown as CustomParamsSerializer,
    },
}

class HttpRequest {
    constructor() {
        this.httpInterceptorsRequest()
        this.httpInterceptorsResponse()
    }
    /** token过期后，暂存待执行的请求 */
    private static requests = []

    /** 防止重复刷新token */
    private static isRefreshing = false

    /** 初始化配置对象 */
    private static initConfig: HttpRequestConfig = {}

    /** 保存当前Axios实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)

    /** 重连原始请求 */
    private static retryOriginalRequest(config: HttpRequestConfig) {
        return new Promise(resolve => {
            HttpRequest.requests.push((token: string) => {
                config.headers["Authorization"] = formatToken(token)
                resolve(config)
            })
        })
    }

    /** 请求拦截 */
    private httpInterceptorsRequest(): void {
        HttpRequest.axiosInstance.interceptors.request.use(
            async (config: HttpRequestConfig): Promise<any> => {
                // 设置加载进度条(开始..)
                if (config.showNProgress) {
                    NProgress.start()
                }
                // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
                if (typeof config.beforeRequestCallback === "function") {
                    config.beforeRequestCallback(config)
                    return config
                }
                if (HttpRequest.initConfig.beforeRequestCallback) {
                    HttpRequest.initConfig.beforeRequestCallback(config)
                    return config
                }
                /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
                const whiteList = simpleConfig.whiteListBackend
                return whiteList.some(v => config.url!.indexOf(v) > -1)
                    ? config
                    : new Promise(resolve => {
                          const userInfo = getToken()
                          if (userInfo) {
                              const now = new Date().getTime()
                              const expires_in =
                                  userInfo.expires_in.toString().length == 10
                                      ? parseInt(userInfo.expires_in) * 1000
                                      : parseInt(userInfo.expires_in)
                              const expired = expires_in - now <= 0
                              if (expired) {
                                  if (!HttpRequest.isRefreshing) {
                                      HttpRequest.isRefreshing = true
                                      // token过期刷新
                                      useUserStore()
                                          .handRefreshToken({
                                              access_token:
                                                  userInfo.access_token,
                                              expired_in: userInfo.expires_in,
                                              refresh_token:
                                                  userInfo.refresh_token,
                                          })
                                          .then(res => {
                                              const token =
                                                  res.data.access_token
                                              config.headers!["Authorization"] =
                                                  formatToken(token)
                                              HttpRequest.requests.forEach(cb =>
                                                  cb(token),
                                              )
                                              HttpRequest.requests = []
                                          })
                                          .finally(() => {
                                              HttpRequest.isRefreshing = false
                                          })
                                  }
                                  resolve(
                                      HttpRequest.retryOriginalRequest(config),
                                  )
                              } else {
                                  config.headers!["Authorization"] =
                                      formatToken(userInfo.access_token)
                                  resolve(config)
                              }
                          } else {
                              resolve(config)
                          }
                      })
            },
            error => {
                return Promise.reject(error)
            },
        )
    }
    /** 响应拦截 */
    private httpInterceptorsResponse(): void {
        const instance = HttpRequest.axiosInstance
        instance.interceptors.response.use(
            (response: HttpResponse) => {
                const $config = response.config
                // 设置加载进度条(结束..)
                if ($config.showNProgress) {
                    NProgress.done()
                }
                // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
                if (typeof $config.beforeResponseCallback === "function") {
                    $config.beforeResponseCallback(response)
                    return response.data
                }
                if (HttpRequest.initConfig.beforeResponseCallback) {
                    HttpRequest.initConfig.beforeResponseCallback(response)
                    return response.data
                }
                //响应成功的返回
                return response.data
            },
            (error: HttpError) => {
                const $error = error
                const $config = $error.config
                // 打印错误信息
                if (!("printError" in $config)) {
                    getErrors($error)
                }
                // 设置加载进度条(结束..)
                if ($config.showNProgress) {
                    NProgress.done()
                }
                //响应失败的返回
                return Promise.reject($error)
            },
        )
    }

    /** 通用请求工具函数 */
    public request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: HttpRequestConfig,
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param,
            ...axiosConfig,
        } as HttpRequestConfig

        // 单独处理自定义请求/响应回掉
        return new Promise((resolve, reject) => {
            HttpRequest.axiosInstance
                .request(config)
                .then((response: any) => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

export const http = new HttpRequest()
