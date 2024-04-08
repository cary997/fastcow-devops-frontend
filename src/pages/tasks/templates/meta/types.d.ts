import { TreeOption } from "naive-ui/es/tree/src/interface"

export interface filesTreeOption extends TreeOption {
    /**
     * 文件名称
     */
    name: string
    /**
     * 相对路径
     */
    path: string
    /**
     * 文件类型
     */
    type?: number
    /**
     * 父路径
     */
    parent?: string | null
    /** 是否编辑*/
    isedit:boolean
}
export interface filesTreeDropInfo<T> {
    event: DragEvent
    node: T
    dragNode: T
    dropPosition: "before" | "inside" | "after"
}
export interface filesTreeRenderProps<T> {
    option: T;
    checked: boolean;
    selected: boolean;
}