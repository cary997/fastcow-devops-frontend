import { useOsTheme, darkTheme } from "naive-ui"

export function setTheme(value: string) {
    localStorage.setItem("app-theme", value)
}

export function getTheme() {
    return localStorage.getItem("app-theme")
}
export function getThemeName() {
    const theme = getTheme()
    if (theme) {
        if (theme === "dark") {
            return "dark"
        } else if (theme === "os") {
            const osTheme = useOsTheme()
            return osTheme.value === "dark" ? "dark" : null
        } else {
            return null
        }
    } else {
        //如果没取到值,返回系统主题
        const osTheme = useOsTheme().value === "dark" ? "dark" : null
        return osTheme
    }
}
export function getThemeVar() {
    const theme = getTheme()
    if (theme) {
        if (theme === "dark") {
            return darkTheme
        } else if (theme === "os") {
            const osTheme = useOsTheme()
            return osTheme.value === "dark" ? darkTheme : null
        } else {
            return null
        }
    } else {
        //如果没取到值,返回系统主题
        const osTheme = useOsTheme().value === "dark" ? darkTheme : null
        return osTheme
    }
}
