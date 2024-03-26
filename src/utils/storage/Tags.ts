export function setTags(value) {
    localStorage.setItem("app-tags", JSON.stringify(value))
}

export function getTags() {
    const tags = JSON.parse(localStorage.getItem("app-tags"))
    return tags ? tags : []
}

export function removeTags() {
    localStorage.removeItem("app-tags")
}

export function setIsTags(value) {
    localStorage.setItem("tags-show", value)
}
export function getIsTags() {
    const value = localStorage.getItem("tags-show")
    if (value === "true") {
        return true
    } else {
        return false
    }
}
