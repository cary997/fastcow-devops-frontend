import { NButton, NIcon, NSwitch } from "naive-ui"
import { h, ref } from "vue"

import { getAssetsFieldsApi, setAssetsFieldsApi } from "@/api/assets/FieldsApi"
import {
  AssetsFields,
  baseAssetsFields,
  BaseFields,
  getAssetsFieldsResponse,
} from "@/api/assets/type"
import { Delete20Regular, Edit20Regular } from "@vicons/fluent"

export const currentOptions = ref<string>("hosts")
export const allFileds = ref<AssetsFields>(null)
export const defaultFiledsList = ref<Array<BaseFields>>([])
export const extensionFieldsList = ref<Array<BaseFields>>([])

/**获取字段列表*/
export async function getAssetsFieldsHandle() {
  return new Promise<AssetsFields>((resolve, reject) => {
    getAssetsFieldsApi()
      .then((res: getAssetsFieldsResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**更新字段列表*/
export async function setAssetsFieldsHandle(data: baseAssetsFields) {
  return new Promise<AssetsFields>((resolve, reject) => {
    setAssetsFieldsApi(data)
      .then((res: getAssetsFieldsResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**刷新字段列表 */
export async function refreshAssetsFieldsHandle() {
  await getAssetsFieldsHandle().then((res: AssetsFields) => {
    allFileds.value = res
    if (currentOptions.value == "hosts") {
      defaultFiledsList.value = Object.values(res.hosts_default_fields)
      extensionFieldsList.value = Object.values(res.hosts_extension_fields)
    }
  })
}

export const createColumns = ({
  delFields,
  setFields,
}: {
  delFields: (rowData: BaseFields) => void
  setFields: (rowData: BaseFields) => void
}): BaseTableColumns<Array<BaseFields>> => {
  return [
    {
      title: "字段名",
      key: "field_name",
    },
    {
      title: "显示名",
      key: "field_display_name",
    },
    {
      title: "自动获取",
      key: "automatic",
      render(row) {
        return h(NSwitch, {
          checkedValue: row.automatic,
          defaultValue: row.automatic,
          size: "small",
          disabled: true,
        })
      },
    },
    {
      title: "关联字段",
      key: "link_field",
      render(row) {
        return h(
          "span",
          {
            class: "text-xs",
          },
          { default: () => (row.link_field ? row.link_field : "None") },
        )
      },
    },
    {
      title: "拼接符号",
      key: "joint_mark",
      render(row) {
        return h(
          "span",
          {
            class: "text-primary",
          },
          { default: () => (row.joint_mark ? `'${row.joint_mark}'` : null) },
        )
      },
    },
    {
      title: "单位",
      key: "unit",
    },
    {
      title: "操作",
      key: "actions",
      render(row) {
        return h("div", { class: "space-x-2" }, [
          h(
            NButton,
            {
              size: "tiny",
              onClick: () => setFields(row),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Edit20Regular,
                  class: "text-lightinfo",
                }),
              default: () => "编辑",
            },
          ),
          h(
            NButton,
            {
              size: "tiny",
              onClick: () => delFields(row),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Delete20Regular,
                  class: "text-lightinfo",
                }),
              default: () => "删除",
            },
          ),
        ])
      },
    },
  ]
}
