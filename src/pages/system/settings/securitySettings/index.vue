<template>
    <div class="flex flex-col space-y-8">
        <div class="flex flex-col space-y-2">
            <div class="flex-1 flex-row">
                <span class="mr-2 text-base">开启MFA登录</span>
                <n-switch v-model:value="data.totp">
                    <template #checked> {{ $t("status.enable") }} </template>
                    <template #unchecked> {{ $t("status.disable") }} </template>
                </n-switch>
            </div>
            <NText depth="3" class="text-sm">
                开启MFA（多重身份验证），开启后用户下次登录将自动提示绑定动态令牌，未绑定的用户将无法通过系统登录。<br />
                注：平台MFA方案采用TOTP算法
            </NText>
        </div>
        <div class="flex flex-col space-y-2">
            <div class="flex-1 flex-row">
                <span class="mr-2 text-base">开启IP地址校验</span>
                <n-switch v-model:value="data.ip_check">
                    <template #checked> {{ $t("status.enable") }} </template>
                    <template #unchecked> {{ $t("status.disable") }} </template>
                </n-switch>
                <span class="ml-6 mr-2 text-base">IP校验模式 </span>
                <NDropdown
                    trigger="click"
                    :options="options"
                    @select="handleSelect"
                >
                    <n-button size="small">{{ ipMode }}</n-button>
                </NDropdown>
            </div>
            <NText depth="3" class="text-sm">
                开启IP校验后将通过判断用户的请求IP地址来限制用户访问，校验模式分为白名单和黑名单。<br />
                注: 白名单模式将只允许白名单列表中的IP地址访问<br />
                注: 黑名单模式将只允许不在黑名单列表中的IP地址访问
            </NText>
        </div>
        <div class="flex flex-col space-y-2">
            <div class="flex-1 flex-row">
                <span class="mr-2 text-base">IP黑名单列表</span>
                <span
                    v-show="data.ip_check_mode == 1"
                    class="ml-2 text-error"
                    >{{ checkMessage }}</span
                >
            </div>
            <n-input
                type="textarea"
                size="small"
                :status="blackListStatus"
                v-model:value="blackListData"
                @blur="handleBlackListBlur"
                placeholder="127.0.0.1,127.0.0.0/24,127.0.0.1-127.0.0.255"
                :disabled="!inputDisable"
                round
            />
        </div>
        <div class="flex flex-col space-y-2">
            <div class="flex-1 flex-row">
                <span class="mr-2 text-base">IP白名单列表</span>
                <span
                    v-show="data.ip_check_mode == 2"
                    class="ml-2 text-error"
                    >{{ checkMessage }}</span
                >
            </div>
            <n-input
                type="textarea"
                size="small"
                v-model:value="whiteListData"
                :status="whiteListStatus"
                @blur="handleWhiteListBlur"
                placeholder="127.0.0.1,127.0.0.0/24,127.0.0.1-127.0.0.255"
                :disabled="inputDisable"
                round
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { NSwitch, NText, NDropdown, NButton, NInput } from "naive-ui"
import { useI18n } from "vue-i18n"
import { securityInfo } from "@/api/system/type"
import { PropType, computed, onMounted, ref } from "vue"
import {
    ipv4Pattenrn,
    maskIpv4Pattenrn,
    continuousIpv4Pattenrn,
} from "@/utils/regularTools"
import { saveDisable, blackListData, whiteListData } from "../extend"
const { t } = useI18n()
//双向绑定
const data = defineModel({
    type: Object as PropType<securityInfo>,
})

const whiteListStatus = ref(null)
const blackListStatus = ref(null)
const ipMode = computed(() => {
    return data.value.ip_check_mode == 1 ? "黑名单" : "白名单"
})
const inputDisable = computed(() => {
    return data.value.ip_check_mode == 1 ? true : false
})

const options = [
    {
        label: "黑名单",
        key: 1,
    },

    {
        label: "白名单",
        key: 2,
    },
]
const handleSelect = (key: number) => {
    data.value.ip_check_mode = key
}

//Ip检查状态
const checkMessage = ref(null)
const checkIplist = (data: Array<string>) => {
    let res = true
    let newList = []
    data.every(item => {
        if (
            !ipv4Pattenrn.test(item) &&
            !maskIpv4Pattenrn.test(item) &&
            !continuousIpv4Pattenrn.test(item)
        ) {
            res = false
            checkMessage.value = `格式错误 - ${item}`
            return false
        } else if (newList.includes(item)) {
            res = false
            checkMessage.value = `重复配置 - ${item}`
            return false
        }
        newList.push(item)
        return true
    })
    return res
}
const handleBlackListBlur = () => {
    if (blackListData.value) {
        const ipList = blackListData.value.split(",")
        const checkRes = checkIplist(ipList)
        if (checkRes) {
            saveDisable.value = false
            checkMessage.value = null
            blackListStatus.value = "success"
            data.value.ip_black_list = ipList
        } else {
            saveDisable.value = true
            blackListStatus.value = "error"
        }
    } else {
        data.value.ip_black_list = []
        checkMessage.value = null
        blackListStatus.value = "success"
        saveDisable.value = false
    }
}
const handleWhiteListBlur = () => {
    if (whiteListData.value) {
        const ipList = whiteListData.value.split(",")
        const checkRes = checkIplist(ipList)
        if (checkRes) {
            saveDisable.value = false
            checkMessage.value = null
            whiteListStatus.value = "success"
            data.value.ip_white_list = ipList
        } else {
            saveDisable.value = true
            whiteListStatus.value = "error"
        }
    } else {
        data.value.ip_white_list = []
        saveDisable.value = false
        checkMessage.value = null
        whiteListStatus.value = "success"
    }
}
onMounted(() => {
    //初始化角色列表

    whiteListData.value = data.value.ip_white_list
        ? data.value.ip_white_list.join(",")
        : null
    blackListData.value = data.value.ip_black_list
        ? data.value.ip_black_list.join(",")
        : null
})
</script>

<style scoped></style>
