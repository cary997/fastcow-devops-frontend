import { createApp } from "vue"
import App from "@/App.vue"
import { router, setupRouter } from "@/router"
import { setupStore } from "@/store"
import { setupI18n } from "@/settings/i18n"
import "@/styles/tailwindcss.css"
import "@/styles/index.css"
// 通用字体
import "vfonts/Lato.css"
// 等宽字体
import "vfonts/FiraCode.css"
import { getPlatformConfig } from "./settings/config"

const app = createApp(App)

// 全局注册按钮级别权限组件
import {
    Auth,
    GlobalTooltip,
    GlobalCodeInput,
    GlobalShowPassword,
} from "@components/Global"
app.component("Auth", Auth)
app.component("tip", GlobalTooltip)
app.component("codeInput", GlobalCodeInput)
app.component("showPassword", GlobalShowPassword)

getPlatformConfig(app).then(async () => {
    // 挂载路由
    setupRouter(app)
    // 等待路由准备就绪
    await router.isReady()
    // 挂载pinia
    setupStore(app)
    // 挂载i18n
    setupI18n(app)
    console.log("接口配置的基础地址", import.meta.env.VITE_BASE_API)
    app.mount("#app", true)
})
