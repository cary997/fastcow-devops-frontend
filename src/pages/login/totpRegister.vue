<template>
    <div class="flex-1 flex flex-col space-y-6">
        <div class="flex flex-row justify-center items-center">
            <n-steps size="small" :current="nextValue">
                <n-step :title="t('login.totpRegister.step1')" />
                <n-step :title="t('login.totpRegister.step2')" />
                <n-step :title="t('login.totpRegister.step3')" />
            </n-steps>
        </div>
        <div class="flex-1 flex flex-row">
            <n-tabs
                v-show="nextValue == 1"
                type="line"
                animated
                justify-content="space-around"
            >
                <n-tab-pane
                    name="IOS"
                    tab="IOS"
                    class="flex flex-row justify-center items-center space-x-10"
                >
                    <span class="flex flex-col justify-center items-center">
                        <n-qr-code
                            value="https://apps.apple.com/app/microsoft-authenticator/id983156458"
                            error-correction-level="Q"
                            color="#0067b8"
                        />
                        Microsoft
                    </span>
                    <span class="flex flex-col justify-center items-center">
                        <n-qr-code
                            value="https://apps.apple.com/us/app/2fa-authenticator-2fas/id1217793794"
                            error-correction-level="Q"
                            color="#e20613"
                        />
                        2FAS
                    </span>
                </n-tab-pane>
                <n-tab-pane
                    name="Android"
                    tab="Android"
                    class="flex flex-row justify-center items-center space-x-10"
                >
                    <span class="flex flex-col justify-center items-center">
                        <n-qr-code
                            value="https://play.google.com/store/apps/details?id=com.azure.authenticator&referrer=  adjust_reftag%3Dc6f1p4ErudH2C%26utm_source%3DLanding%2BPage%2BOrganic%2B-%2Bapp%2Bstore%2Bbadges%26utm_campaign%3Dappstore_android"
                            error-correction-level="Q"
                            color="#0067b8"
                        />
                        Microsoft
                    </span>
                    <span class="flex flex-col justify-center items-center">
                        <n-qr-code
                            value="https://play.google.com/store/apps/details?id=com.twofasapp"
                            error-correction-level="Q"
                            color="#e20613"
                        />
                        2FAS
                    </span>
                </n-tab-pane>
            </n-tabs>
            <div
                v-show="nextValue == 2"
                class="flex-1 flex flex-col justify-center space-y-2 items-center"
            >
                <n-qr-code id="totp-qr-code" :value="codeText"  error-correction-level="Q" />
                <n-button type="primary" size="tiny" @click="handleDownloadQRCode">
                下载
                </n-button>
                <span class="text-center font-semibold text-primary">此二维码只出现一次，请立即绑定或保存至设备稍后绑定</span>
            </div>
        </div>
        <div class="flex-none" v-show="nextValue == 1">
            {{ $t("login.totpRegister.message") }}
        </div>
        <div class="flex-none" v-show="nextValue == 2">
            {{ $t("login.totpRegister.message2") }}
        </div>
        <div class="flex-none flex flex-row justify-center items-certer">
            <n-button
                v-show="nextValue == 1"
                round
                type="primary"
                class="w-1/3"
                @click="handleNextClick"
                >{{ $t("login.totpRegister.next") }}
            </n-button>
            <n-button
                v-show="nextValue == 2"
                round
                type="primary"
                class="w-20 ml-4 mr-4"
                @click="handlePreviousClick"
                >{{ $t("login.totpRegister.previous") }}
            </n-button>
            <n-button
                v-show="nextValue == 2"
                round
                type="primary"
                class="w-20 ml-4 mr-4"
                @click="handleCompleteClick"
                >{{ $t("login.totpRegister.complete") }}
            </n-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { NQrCode, NButton, NTabs, NTabPane, NSteps, NStep } from "naive-ui"
import { pageType, codeText } from "./extend"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const nextValue = ref<number>(1)
const handleNextClick = () => {
    nextValue.value = nextValue.value + 1
}
const handlePreviousClick = () => {
    nextValue.value = nextValue.value - 1
}
const handleCompleteClick = () => {
    pageType.value = pageType.value + 1
    nextValue.value = nextValue.value = 1
    codeText.value = null
}

const handleDownloadQRCode = () => {
      const canvas = document
        .querySelector('#totp-qr-code')
        ?.querySelector<HTMLCanvasElement>('canvas')
      if (canvas) {
        const url = canvas.toDataURL()
        const a = document.createElement('a')
        a.download = 'fastcow-totp.png'
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
</script>
