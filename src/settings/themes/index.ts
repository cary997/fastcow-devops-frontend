/*
 * @Author: Cray
 * @Date: 2024-03-26 14:59:56
 * @LastEditors: Cray
 * @LastEditTime: 2024-03-29 09:38:21
 * @FilePath: /src/settings/themes/index.ts
 * @Descripttion: ~
 */
import type { GlobalThemeOverrides } from "naive-ui"
export type breakpointsTuype = {
    xs: number
    s: number
    m: number
    l: number
    xl: number
    xxl: number
}

export const breakpoints: breakpointsTuype = {
    xs: 0,
    s: 640,
    m: 1024,
    l: 1280,
    xl: 1536,
    xxl: 1920,
}
export const lightThemeOverrides: GlobalThemeOverrides = {
    common: {
        borderRadius: "6px",
        primaryColor: "#05988a",
        primaryColorHover: "#1fada0",
        primaryColorPressed: "#1c776e",
        primaryColorSuppl: "#1fada0",
        infoColor: "#4889be",
        infoColorHover: "#76adda",
        infoColorPressed: "#376992",
        infoColorSuppl: "#76adda",
        successColor: "#13b17a",
        successColorHover: "#28b181",
        successColorPressed: "#109667",
        successColorSuppl: "#28b181",
        warningColor: "#e6b731",
        warningColorHover: "#e6be4b",
        warningColorPressed: "#caa12b",
        warningColorSuppl: "#e6be4b",
        errorColor: "#f33966",
        errorColorHover: "#f15a7f",
        errorColorPressed: "#cf2750",
        errorColorSuppl: "#f15a7f",
    },
    Checkbox: {
        checkMarkColorDisabledChecked: "#05988a",
    },
    Tag: {
        borderRadius: "4px",
    },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
    common: {
        borderRadius: "6px",
        primaryColor: "#7480ff",
        primaryColorHover: "#8e97fd",
        primaryColorPressed: "#646fdd",
        primaryColorSuppl: "#4851b6",
        infoColor: "#988cc9",
        infoColorHover: "#aca5ca",
        infoColorPressed: "#7d70b3",
        infoColorSuppl: "#655a96",
        successColor: "#61bc84",
        successColorPressed: "#4ea56f",
        successColorHover: "#71bb8e",
        successColorSuppl: "#3f8f5d",
        warningColor: "#ebc75e",
        warningColorHover: "#ebcd78",
        warningColorPressed: "#cfae4d",
        warningColorSuppl: "#b8993e",
        errorColor: "#dd5454",
        errorColorHover: "#df6c6c",
        errorColorPressed: "#bd4949",
        errorColorSuppl: "#a54141",
    },
    Checkbox: {
        checkMarkColorDisabledChecked: "#7480ff",
    },
    Tag: {
        borderRadius: "4px",
    },
}
