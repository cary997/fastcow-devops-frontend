import { HttpError } from "./types.d"
import { resetRouter, router } from "@/router"
import { removeToken } from "../storage/userLogin"
import { unref } from "vue"

export const getErrors = (error: HttpError) => {
    const $error = error
    const $message = window.$message
    const { currentRoute } = router
    const currentRouter = unref(currentRoute)
    // 有response
    if ($error.response) {
        const { status } = $error.response
        switch (status) {
            case 401:
                //登录超时
                router.replace({
                    name: "login",
                    query: {
                        formUrl: encodeURIComponent(
                            router.currentRoute.value.fullPath,
                        ),
                    },
                })
                removeToken()
                resetRouter()
                $message.warning($error.response?.data?.message, {
                    closable: true,
                    duration: 10,
                })
                break
            case 403:
                $message.error($error.response?.data?.message)
                if (currentRouter.name !== "login") {
                    router.push("/result/403")
                }

                break
            // 404请求不存在
            case 404:
                $message.error("网络请求错误，未找到该资源!")
                if (currentRouter.name !== "login") {
                    router.push("/result/404")
                }
                break
            case 422:
                $message.error($error.response?.data?.message)
                break
            case 500:
                $message.error("服务器错误,请联系管理员!")
                if (currentRouter.name !== "login") {
                    router.push("/result/500")
                }

                break
            case 501:
                $message.error("网络未实现")
                break
            case 502:
                $message.error("网络错误")
                break
            case 503:
                $message.error("服务不可用，服务器暂时过载或维护!")
                break
            case 504:
                $message.error("网络超时")
                break
            case 505:
                $message.error("http版本不支持该请求!")
                break
            default:
                $message.warning($error.response?.data?.message)
        }
    } else {
        console.log($error)
        $message.error($error.message)
    }
}
