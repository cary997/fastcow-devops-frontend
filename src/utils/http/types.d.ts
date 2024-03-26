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
    printError?: boolean
    beforeRequestCallback?: (request: HttpRequestConfig) => void
    beforeResponseCallback?: (response: HttpResponse) => void
}
