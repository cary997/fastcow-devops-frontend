<template>
    <n-avatar
        round
        :size="size"
        :style="{ ...getGradientStyle(text) }"
    >
        {{ content }}
    </n-avatar>
</template>

<script lang="ts" setup>
import { NAvatar } from "naive-ui"
defineProps<{
    size: number
    text: string
    content: string
}>()
//生成随机rgb颜色
function getRandomColor(str: string, alpha: number) {
    let asciiSum = 0
    for (let i = 0; i < str.length; i++) {
        asciiSum += str.charCodeAt(i)
    }

    const red = Math.abs(Math.sin(asciiSum) * 256).toFixed(0)
    const green = Math.abs(Math.sin(asciiSum + 1) * 256).toFixed(0)
    const blue = Math.abs(Math.sin(asciiSum + 2) * 256).toFixed(0)
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

//生成头像样式
const getGradientStyle = text => {
    const color1 = getRandomColor(text, 1)
    const color2 = getRandomColor(text, 0.7)

    return {
        backgroundImage: `linear-gradient(135deg, ${color1}, ${color2})`,
        fontWeight: "600",
        fontSize: "16px",
    }
}
</script>
