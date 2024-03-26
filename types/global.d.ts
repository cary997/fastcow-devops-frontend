import { MessageApi, DialogApi, NotificationApi, LoadingBarApi } from "naive-ui"
import {
    type RouteComponent,
    type RouteLocationNormalized,
    type RouteRecordRaw,
} from "vue-router"
import { FunctionalComponent } from "vue"
import { TableColumns } from "@components/Tables/type"
import { AxiosRequestConfig } from "axios"
/**
 * @description 全局消息组件和进度条
 */
declare global {
    /**
     * 平台的名称、版本、运行所需的`node`和`npm`版本、依赖、最后构建时间的类型提示
     */
    const __APP_INFO__: {
        pkg: {
            name: string
            version: string
            lastBuildTime: string
            engines: {
                node: string
                npm: string
            }
            dependencies: Recordable<string>
            devDependencies: Recordable<string>
        }
    }

    interface menuSetting {
        /**最小宽度*/
        minMenuWidth?: number
        /**菜单宽度*/
        menuWidth?: number
        /**触发移动端侧边栏的宽度*/
        mobileWidth?: number
        /** 折叠菜单*/
        collapsed?: boolean
        /**是否开启手风琴模式*/
        accordion?: boolean
    }
    interface PlatformConfigs {
        /**ASE加解密key 和后端保持一致*/
        secret_key?: string
        /**ASE加解密IV 和后端保持一致*/
        secret_iv?: string
        /**axios基础url */
        axiosConfig?: AxiosRequestConfig
        /**网站标题 */
        title?: string
        /**登录页面标题*/
        logintitle?: string
        /**是否将路由缓存到浏览器sessionStorage*/
        CachingAsyncRoutes?: boolean
        /**菜单配置 */
        menuSetting?: menuSetting
    }

    interface Window {
        $message: MessageApi
        $dialog: DialogApi
        $notification: NotificationApi
        $loadingBar: LoadingBarApi
    }

    /**
     * @description 后端默认Response基础返回格式
     */
    interface BaseResponse {
        code?: Number
        message?: string
        data?: Map | Array<Map>
    }
    /**
     * @description 后端基础分页结果
     */
    interface BaseQueryResult {
        /** 查询结果 */
        result?: Map | Array<Map>
        /** 总条数 */
        total: number
        /** 总页数 */
        page_total: number
        /** 页码 */
        page: number
        /** 条数 */
        limit: number
    }

    /**
     * `src/router` 文件夹里的类型声明
     */
    interface toRouteType extends RouteLocationNormalized {
        meta: {
            /** 是否在菜单中显示（默认`true`）`可选` */
            showLink?: boolean
            /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
            keepAlive?: boolean
            /** 菜单类型 1-目录 2-页面 3-按钮  4-外链*/
            menu_type: number
            /** 中文菜单名称 `必填` */
            title: string | ComposerTranslation
            /** 英文菜单名称 `必填` */
            en_title: string | ComposerTranslation
            // 是否不添加信息到标签页，（默认`false`）为添加
            hiddenTag?: boolean
        }
    }

    /**
     * @description 完整子路由配置表
     */
    interface RouteChildrenConfigsTable {
        /**后端返回时会有id字段 */
        id?: number
        /** 子路由地址 `必填` */
        path: string
        /** 路由名字（对应不要重复，和当前组件的`name`保持一致）`必填` */
        name?: string
        /** 路由重定向 `可选` */
        redirect?: string
        /** 按需加载组件 `可选` */
        component?: RouteComponent
        /** 上级菜单id 后端返回路由 `可选` */
        parent?: number
        /** 上级菜单name 后端返回路由 `可选` */
        parent_key?: string
        meta?: {
            /** 中文菜单名称 `必填` */
            title: string | ComposerTranslation
            /** 英文菜单名称 `必填` */
            en_title: string | ComposerTranslation
            /** 菜单类型 1-目录 2-页面 3-按钮  4-外链*/
            menu_type?: number
            /** 菜单图标 `可选` */
            icon?: string | FunctionalComponent | IconifyIcon
            /** 是否在菜单中显示（默认`true`）`可选` */
            showLink?: boolean
            /** 是否显示父级菜单,只有当children子菜单数量为1时才生效 `可选` */
            showParent?: boolean
            /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
            keepAlive?: boolean
            /** 内嵌的`iframe`链接 `可选` */
            frameSrc?: string
            /** `iframe`页是否开启首次加载动画（默认`true`）`可选` */
            frameLoading?: boolean
            /** 页面加载动画（有两种形式，一种直接采用vue内置的`transitions`动画，另一种是使用`animate.css`写进、离场动画）`可选` */
            /**
             * @description 当前路由动画效果
             * @see {@link https://next.router.vuejs.org/guide/advanced/transitions.html#transitions}
             * @see animate.css {@link https://animate.style}
             */
            /** 进场动画 */
            enterTransition?: string
            /** 离场动画 */
            leaveTransition?: string
            // 是否不添加信息到标签页，（默认`false`）为添加
            hiddenTag?: boolean
        }
        /** 子路由配置项 */
        children?: Array<RouteChildrenConfigsTable>
    }

    /**
     *  @description 表格完整列配置
     */
    interface BaseTableColumns<T = InternalRowData> extends TableColumns<T> {}
}
