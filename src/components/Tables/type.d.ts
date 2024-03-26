import {
    InternalRowData,
    TableColumnGroup,
    TableBaseColumn,
    TableSelectionColumn,
    TableExpandColumn,
    TableColumnTitle,
    ColumnKey,
} from "naive-ui/lib/data-table/src/interface"

interface newTableSelectionColumn<T = InternalRowData>
    extends TableSelectionColumn<T> {
    title?: TableColumnTitle
    key: ColumnKey
}

type TableColumn<T = InternalRowData> =
    | TableColumnGroup<T>
    | TableBaseColumn<T>
    | newTableSelectionColumn<T>
    | TableExpandColumn<T>

export type TableColumns<T = InternalRowData> = Array<TableColumn<T>>
