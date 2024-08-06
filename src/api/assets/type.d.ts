/**
 * 字段添加配置
 */
export interface BaseFields {
  field_name: string
  field_display_name: string
  automatic?: boolean
  link_field?: string
  joint_mark?: string
  unit?: string
}

export interface baseAssetsFields {
  /**
   * 主机默认字段
   */
  hosts_default_fields?: Record<string, BaseFields> | null
  /**
   * 主机扩展字段
   */
  hosts_extension_fields?: Record<string, BaseFields> | null
}


export interface AssetsFields extends baseAssetsFields { 
    id?: number | null
    create_at?: number | null
    update_at?: number | null
}

export interface getAssetsFieldsResponse extends BaseResponse {
  data: AssetsFields
}
