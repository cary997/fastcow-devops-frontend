<template>
    <div class="flex-1 flex flex-row">
        <input
            ref="firstinput"
            :key="0"
            v-model="verificationCodes[0]"
            @input="handleInput(0, $event)"
            @keydown="handleKeyDown(0, $event)"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <input
            :key="1"
            v-model="verificationCodes[1]"
            @input="handleInput(1, $event)"
            @keydown="handleKeyDown(1, $event)"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <input
            :key="2"
            v-model="verificationCodes[2]"
            @input="handleInput(2, $event)"
            @keydown="handleKeyDown(2, $event)"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <input
            :key="3"
            v-model="verificationCodes[3]"
            @input="handleInput(3, $event)"
            @keydown="handleKeyDown(3, $event)"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <input
            :key="4"
            v-model="verificationCodes[4]"
            @input="handleInput(4, $event)"
            @keydown="handleKeyDown(4, $event)"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <input
            :key="5"
            v-model="verificationCodes[5]"
            @input="handleInput(5, $event)"
            @keydown="handleKeyDown(5, $event)"
            @keyup.enter="verifyClick"
            class="input input-sm w-4 ml-1.5 mr-1.5 border-0 border-b rounded-t-md rounded-none border-primary focus:outline-none"
        />
        <tip :value="t('action.clear')" placement="right">
            <NButton type="info" text @click="handleClearClick">
                <n-icon :size="20">
                    <Eraser24Filled />
                </n-icon>
            </NButton>
        </tip>
    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, PropType } from "vue"
import { useI18n } from "vue-i18n"
import { NButton, NIcon } from "naive-ui"
import { Eraser24Filled } from "@vicons/fluent"
const { t } = useI18n()
defineProps({
    verifyClick: {
        type: Function as PropType<(...arg: any[]) => void | Promise<any>>,
        default() {
            return "Default function"
        },
        required: true,
    },
})
//双向绑定
const codes = defineModel()
const verificationCodes = ref(["", "", "", "", "", ""])

const handleInput = (index, event) => {
    const value = event.target.value
    verificationCodes.value[index] = value

    // 判断是否输入完成
    if (verificationCodes.value.join("").length === 6) {
        codes.value = verificationCodes.value.join("")
    }
    // 自动跳到下一个输入框
    if (value && index < verificationCodes.value.length - 1) {
        const nextInput = event.target.nextElementSibling
        if (nextInput) {
            nextTick(() => {
                nextInput.focus()
            })
        }
    }
}
const handleKeyDown = (index, event) => {
    // 处理删除操作
    if (event.key === "Backspace" && !event.target.value && index > 0) {
        codes.value = verificationCodes.value.join("")
        const prevInput = event.target.previousElementSibling
        if (prevInput) {
            nextTick(() => {
                prevInput.focus()
            })
        }
    }
    if (verificationCodes.value.join("").length === 0) {
        codes.value = null
    }
}
const handleClearClick = () => {
    verificationCodes.value = ["", "", "", "", "", ""]
    codes.value = null
    firstinput.value.focus()
}
// 获取第一个元素的ref
const firstinput = ref()

// 页面一加载就使第一个框聚焦
onMounted(() => {
    // 等待dom渲染完成，在执行focus,否则无法获取到焦点
    nextTick(() => {
        firstinput.value.focus()
    })
})
</script>

<style scoped></style>
