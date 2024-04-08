import Axios, {
    Method,
    AxiosError,
    AxiosResponse,
    AxiosRequestConfig,
} from "axios"

// export type resultType = {
//   access_token?: string;
// };

export type RequestMethods = Extract<
    Method,
    "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>
export interface HttpResponse extends AxiosResponse {
    config: HttpRequestConfig
}

export interface HttpError extends AxiosError {
    config: HttpRequestConfig
    isCancelRequest?: boolean
    response?: HttpResponse
}

export interface HttpRequestConfig extends AxiosRequestConfig {
    beforeRequestCallback?: (request: HttpRequestConfig) => void
    beforeResponseCallback?: (response: HttpResponse) => void
    /**是否使用message输出请求错误信息 */
    printError?: boolean
    /**是否显示进度条 */
    showNProgress?: boolean
}
