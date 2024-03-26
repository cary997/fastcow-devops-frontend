import { getCurrentUsersApi } from "./UsersApi"
/*
 * @Author: Cary
 * @Date: 2023-07-14 15:14:16
 * @LastEditors:
 * @LastEditTime: 2024-02-22 03:05:26
 * @FilePath: \fastapi-naive-web\src\api\auth\types.d.ts
 * @Descripttion:
 */

/**删除统一响应*/
export interface deleteResult extends BaseResponse {
    data: {
        id: number
    }
}
/**创建菜单参数格式*/
export interface menuType {
    /**id创建时不用填写，此处用于后端返回时提示 */
    id?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    update_at?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    create_at?: number
    /** 子路由地址 `必填` */
    path?: string
    /** 路由名字（对应不要重复，和当前组件的`name`保持一致）`必填` */
    name?: string
    /** 路由重定向 `可选` */
    redirect?: string
    /** 按需加载组件 `可选` */
    component?: string
    /** 上级菜单id 后端返回路由 `可选` */
    parent?: number
    /** 菜单元数据信息 */
    meta?: {
        /** 中文菜单名称 `必填` */
        title?: string
        /** 英文菜单名称 `必填` */
        en_title?: string
        /** 菜单类型 1-目录 2-页面 3-按钮  4-外链*/
        menu_type?: number
        /** 菜单图标 `可选` */
        icon?: string
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
        rank?: number
        // 是否不添加信息到标签页，（默认`false`）为添加
        hiddenTag?: boolean
    }
}

/**查询菜单列表响应*/
export interface listMenusResult extends BaseResponse {
    data: {
        result: Array<RouteChildrenConfigsTable>
    }
}
/**创建菜单响应*/
export interface addMenusResult extends BaseResponse {
    data: menuType
}

/**更新菜单响应*/
export interface setMenusResult extends addMenusResult {}

//roles
/**角色创建参数*/
export interface rolesCreateRequest {
    /**id创建时不用填写，此处用于后端返回时提示 */
    id?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    update_at?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    create_at?: number
    /**name 唯一标识（必填）*/
    name?: string
    /**nickname 显示名称（必填）*/
    nickname?: string
    /**desc 描述*/
    desc?: string
    /**role_status 角色禁用启用*/
    role_status?: boolean
    /**menus 角色关联的菜单ID*/
    menus?: Array<number>
}
/**角色创建响应*/
export interface rolesCreateResult extends BaseResponse {
    data: rolesCreateRequest
}

/**角色列表响应*/
interface rolesListBaseResult extends rolesCreateRequest {
    /**关联用户数 */
    user_count?: number
}
export interface rolesListResult extends BaseResponse {
    data: {
        result: Array<rolesListBaseResult>
    }
}

/**更新角色响应*/
export interface setRolesResult extends rolesCreateResult {}

//Users Type
/**用户创建参数 */
export interface UserCreateRequest {
    /**id创建时不用填写，此处用于后端返回时提示 */
    id?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    update_at?: number
    /**update_at创建时不用填写，此处用于后端返回时提示 */
    create_at?: number
    /** 用户名 （必填）*/
    username?: string
    /** 显示名称 （必填）*/
    nickname?: string
    /** 密码 （创建时必填）*/
    password?: string
    /** 手机号 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** 用户类型 */
    user_type?: number
    /** 用户状态 */
    user_status?: boolean
    /** 角色 */
    roles?: Array<number>
}
/**用户列表查询请求参数 */
export interface UsersQueryRequestParams {
    /** 用户名 */
    username?: string
    /** 显示名称 */
    nickname?: string
    /** 手机号 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** 用户类型 */
    user_type?: number
    /** 用户状态 */
    user_status?: boolean
    /** 角色 */
    roles?: number
    /**偏移量 */
    limit?: number
    /**页码 */
    page?: number
    /**排序 */
    order_by?: string
}
/**用户列表查询响应 */
export interface queryUsersResult extends BaseQueryResult {
    /**查询结果 */
    result: Array<UserCreateRequest>
    /**查询总数 */
    total: number
    /**查询分页总数 */
    page_total: number
    /**当前页码 */
    page: number
    /**每页显示条数 */
    limit: number
}
/**用户列表响应*/
export interface queryUsersResponse extends BaseResponse {
    data: queryUsersResult
}

/**用户新建响应*/
export interface addUsersResponse extends BaseResponse {
    data: UserCreateRequest
}

/**用户更新请求*/
export interface setUsersRequest {
    /** 显示名称*/
    nickname?: string
    /** 手机号 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** 用户类型 */
    user_type?: number
    /** 用户状态 */
    user_status?: boolean
    /** 角色 */
    roles?: Array<number>
    /**是否要更新角色，更新则必须设置为true*/
    update_roles?: boolean
}
/**用户更新响应 */
export interface setUsersResponse extends addUsersResponse {}

/**更新密码请求*/
export interface setUserPasswordRequest {
    user_id: number
    is_reset?: boolean
    password?: string
    repassword?: string
}
/**批量删除用户 */
export interface bulkSetUsersRequest {
    user_list?: Array<number>
    user_type?: number
    user_status?: boolean
    roles?: Array<number>
    /**是否要更新角色，更新则必须设置为true*/
    update_roles?: boolean
}
export interface bulkSetUsersResponse extends BaseResponse {
    data: Array<number>
}

/**批量删除用户 */
export interface bulkDelUsersRequest {
    user_list: Array<number>
}
export interface bulkDelUsersResponse extends BaseResponse {
    data: Array<number>
}

/**查询当前用户返回格式 */
export interface getCurrentUsers extends UserCreateRequest {
    roles: Array<rolesCreateRequest>
}
/**查询当前用户响应 */
export interface getCurrentUsersResponse extends BaseResponse {
    data: getCurrentUsers
}
