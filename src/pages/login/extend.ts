import { ref, reactive } from "vue"
import { initRouter } from "@/router/routerUtils"
import useUserStore from "@/store/modules/appLogin.js"
import { router } from "@/router"
import { FormInst } from "naive-ui"
import { $t } from "@/settings/i18n"

//根据此值显示不同的页面
export const pageType = ref<number>(1)
export const codeText = ref(null)
interface ModelType {
    account: string | null
    password: string | null
}

export const loginBtnDisabled = ref(false)
export const loginBtnLoading = ref(false)
export const formRef = ref<FormInst>()
export const totpCode = ref(null)
export const formModel = reactive<ModelType>({
    account: null,
    password: null,
})

//触发登录函数
export async function HandleLoginClick() {
    formRef.value?.validate(async errors => {
        if (!errors && !loginBtnDisabled.value) {
            loginBtnDisabled.value = true
            loginBtnLoading.value = true
            await onLogin()
        }
    })
}
const userStore = useUserStore

//登录函数
export const onLogin = async () => {
    const data = {
        username: formModel.account,
        password: formModel.password,
        totp_code: totpCode.value,
    }
    await userStore()
        .loginByUsername(data)
        .then(async resData => {
            if ("totp" in resData) {
                if (resData.totp) {
                    if (resData.new) {
                        pageType.value = 2
                        codeText.value = resData.new_totp
                    } else {
                        pageType.value = 3
                    }
                }
            } else {
                //缓存token
                await userStore().cacheToken(resData)
                // 获取后端路由
                await initRouter().then(() => {
                    const toPath = decodeURIComponent(
                        (router.currentRoute.value.query?.formUrl ||
                            "/") as string,
                    )
                    if (toPath === "/") {
                        router.push({
                            path: "/",
                        })
                    } else {
                        router.replace({
                            path: toPath,
                        })
                    }
                    window.$message.success(() => $t("login.MessageSuccess"))
                    pageType.value = 1
                    totpCode.value = null
                })
            }
        })
        .finally(() => {
            loginBtnLoading.value = false
            loginBtnDisabled.value = false
        })
}
