import { defineStore } from "pinia"
import { store } from "@/store"
import { multiType } from "./types.d"
import { isBoolean } from "@pureadmin/utils"
import {
    getTags,
    removeTags,
    setTags,
    getIsTags,
    setIsTags,
} from "@/utils/storage/Tags"

const localTags = getTags()
const isTags = getIsTags()

export const useTabsStore = defineStore({
    id: "app-multiTags",
    state: () => ({
        //是否开启标签页
        isTags: isTags as boolean,
        // 存储标签页信息（路由信息）
        multiTags: localTags,
    }),
    actions: {
        handleTags<T>(mode: string, value?: T | multiType): T {
            switch (mode) {
                case "push": {
                    const tagVal = value as multiType
                    // 不添加到标签页
                    if (tagVal.hiddenTag) return
                    // 判断是否为页面类型
                    if (tagVal.menu_type != 2) return
                    // 如果title为空拒绝添加空信息到标签页
                    if (tagVal.tab.length === 0 && tagVal.en_tab.length === 0)
                        return
                    // showLink:false 不添加到标签页
                    if (isBoolean(tagVal?.show) && !tagVal?.show) return
                    const tagKey = tagVal.key
                    // 判断tag是否已存在
                    const tagHasExits = this.multiTags.some(tag => {
                        return tag.key === tagKey
                    })
                    if (tagHasExits) return

                    this.multiTags.push(value)
                    setTags(this.multiTags)
                    break
                }
                case "delete": {
                    const index = this.multiTags.findIndex(v => v.key === value)
                    if (index === -1) return
                    this.multiTags.splice(index, 1)
                    setTags(this.multiTags)
                    return index
                }
                case "clear": {
                    this.multiTags = []
                    removeTags()
                    break
                }
            }
        },
        handelIsTags(value: boolean) {
            this.isTags = value
            setIsTags(value)
        },
    },
})

export function useTabsStoreHook() {
    return useTabsStore(store)
}
