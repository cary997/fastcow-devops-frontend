import { resolve } from "path"
import { defineConfig, loadEnv } from "vite"
import {
    name,
    version,
    engines,
    dependencies,
    devDependencies,
    lastBuildTime,
} from "./package.json"
import vue from "@vitejs/plugin-vue"
import removeConsole from "vite-plugin-remove-console"
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Inspect from "vite-plugin-inspect"
/** 路径查找 */
const pathResolve = (dir: string): string => {
    console.log(resolve(__dirname, ".", dir))
    return resolve(__dirname, ".", dir)
}

/** 设置别名 */
const alias: Record<string, string> = {
    "@": pathResolve("src"),
    "@utils": pathResolve("src/utils"),
    "@components": pathResolve("src/components"),
    "@store": pathResolve("src/store"),
    "@router": pathResolve("src/router"),
    "@pages": pathResolve("src/pages"),
}

const __APP_INFO__ = {
    pkg: {
        dependencies,
        devDependencies,
        name,
        version,
        engines,
        lastBuildTime,
    },
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd())
    console.log(env)
    return {
        base: env.VITE_PUBLIC_PATH,
        plugins: [
            vue(),
            vueJsx(),
            removeConsole(),
            Inspect(),
            VueI18nPlugin({
                runtimeOnly: true,
                compositionOnly: true,
                include: [resolve("src/settings/i18n/lang/**")],
            }),
        ],
        // 服务端渲染
        server: {
            // 端口号
            port: Number(env.VITE_PORT),
            host: "0.0.0.0",
            // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
            proxy: {},
        },
        resolve: {
            // 路径别名
            alias,
        },
        build: {
            // target: "esnext",
            // 消除打包大小超过500kb警告
            chunkSizeWarningLimit: 4000,
            rollupOptions: {
                input: {
                    index: pathResolve("index.html"),
                },
                // 静态资源分类打包
                output: {
                    chunkFileNames: "static/js/[name].[hash].js",
                    entryFileNames: "static/js/[name].[hash].js",
                    assetFileNames: "static/[ext]/[name].[hash].[ext]",
                },
            },
        },
        define: {
            __VUE_I18N_FULL_INSTALL__: true,
            __VUE_I18N_LEGACY_API__: false,
            __INTLIFY_PROD_DEVTOOLS__: false,
            __APP_INFO__: JSON.stringify(__APP_INFO__),
        },
    }
})
