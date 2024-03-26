<template>
    <n-dropdown :options="options">
        <NButton text block class="h-16">
            <n-avatar
                v-if="username"
                round
                :size="48"
                :style="{ ...getGradientStyle(username) }"
            >
                {{ avatarName }}
            </n-avatar>

            <div class="text-left">
                <span
                    class="invisible ml-0 mr-0 block w-0 text-base m:visible m:ml-2 m:mr-4 m:w-auto overflow-hidden"
                    >{{ nickname }}</span
                >
                <span
                    class="invisible ml-0 mr-0 block w-0 text-xs m:visible m:ml-2 m:mr-4 m:w-auto overflow-hidden"
                    >{{ username }}</span
                >
            </div>
        </NButton>
    </n-dropdown>
    <changePassword />
    <userProfile />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import useUserStore from "@store/modules/appLogin.js"
import { NDropdown, NButton, NAvatar } from "naive-ui"
import {
    PersonCircleOutline as UserIcon,
    LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5"
import { Password } from "@vicons/carbon"
import { useI18n } from "vue-i18n"
import { renderIcon } from "@utils/tools"
import changePassword from "./changePassword.vue"
import userProfile from "./userProfile.vue"
import {
    currentUser,
    getCurrentUsersHandle,
    showPasswordModal,
    showProfileModal,
} from "."

const { t } = useI18n()
const { username, nickname } = storeToRefs(useUserStore())
const avatarName =
    nickname.value.length > 2 ? nickname.value.substring(1) : nickname.value
const options = [
    {
        label: () => t("headers.userProfile"),
        key: "profile",
        icon: renderIcon(UserIcon),
        props: {
            onClick: async () => {
                await getCurrentUsersHandle().then(res => {
                    currentUser.value = res
                    showProfileModal.value = true
                })
            },
        },
    },
    {
        label: () => t("headers.changePwd"),
        key: "password",
        icon: renderIcon(Password),
        props: {
            onClick: async () => {
                await getCurrentUsersHandle().then(res => {
                    currentUser.value = res
                    showPasswordModal.value = true
                })
            },
        },
    },
    {
        label: () => t("headers.loginOut"),
        key: "logout",
        icon: renderIcon(LogoutIcon),
        props: {
            onClick: () => {
                window.$dialog.info({
                    title: t("title.prompt"),
                    content: t("headers.loginOutPrompt"),
                    positiveText: t("action.confirm"),
                    onPositiveClick: () => {
                        useUserStore().loginOut()
                        window.$message.info(t("headers.loginOutMessage"))
                    },
                })
            },
        },
    },
]

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
