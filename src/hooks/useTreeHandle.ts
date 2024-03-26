//通过排除的方式删除树形列表中的数据
export function treeExcludeHandle(tree: Array<any>, key: number) {
    const newTree = []
    if (tree.length > 0) {
        tree.forEach(item => {
            if (item.key === key) {
                return
            }
            const currentItem = {
                ...item,
            }
            if (item.children && item.children.length > 0) {
                // Recursion
                currentItem["children"] = treeExcludeHandle(item.children, key)
            } else {
                currentItem["children"] = []
            }
            newTree.push(currentItem)
        })
    }

    return newTree.map(map => {
        if (map.children.length < 1) {
            delete map["children"]
        }
        return map
    })
}

//树形列表中添加节点
//tree原数据
//key上级节点key
//node 节点信息
export function treeAddNodeHandle(tree: Array<any>, key: number, node: any) {
    const newTree = []
    //如果key为空说明是根节点
    if (!key) {
        tree.push({
            ...node,
        })
        return tree
    }
    if (tree.length > 0) {
        tree.forEach(item => {
            if (item.key === key) {
                if (!item.children) {
                    item["children"] = []
                }
                item.children.push({
                    ...node,
                })
            }
            const currentItem = {
                ...item,
            }
            if (item.children && item.children.length > 0) {
                // Recursion
                currentItem["children"] = treeAddNodeHandle(
                    item.children,
                    key,
                    node,
                )
            }
            newTree.push(currentItem)
        })
    } else {
        newTree.push(node)
    }

    return newTree
}
