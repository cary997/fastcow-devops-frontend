import { NDataTable } from "naive-ui"

export const BaseProps = {
    ...NDataTable.props, // 这里继承原 UI 组件的 props
    tableTitle: {
        type: String,
        default: null,
    },
    refresData: {
        type: Function,
        default: null,
    },
}
