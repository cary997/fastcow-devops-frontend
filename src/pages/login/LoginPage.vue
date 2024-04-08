<template>
  <NGrid cols="4" item-responsive responsive="screen">
    <NGridItem span="0 m:2">
      <div class="flex h-screen flex-col items-center justify-center">
        <n-image
          :src="theme === null ? lightLogo : darkLogo"
          class="animate-pulse"
        />
        <h2 class="text-center text-6xl font-bold">
          {{ logintitle }}
        </h2>
      </div>
    </NGridItem>
    <NGridItem span="4 m:2">
      <div
        class="flex h-screen flex-col space-y-16 bg-lightbg bg-opacity-60 dark:bg-darkbg dark:bg-opacity-80"
      >
        <div class="flex flex-none flex-row justify-end pr-4 pt-4">
          <ThemeSelectVue />
        </div>
        <div
          class="flex flex-1 flex-grow flex-col items-center justify-center space-y-12"
        >
          <div class="flex-none">
            <h3 class="flex-none text-3xl font-medium">
              {{ $t("login.logintitle") }}
            </h3>
          </div>
          <div class="flex w-3/4 flex-none flex-col s:w-7/12 m:w-5/12">
            <NForm
              v-show="pageType == 1"
              ref="formRef"
              :model="formModel"
              :rules="rules"
              label-placement="top"
            >
              <NFormItem path="account" :label="$t('login.account')">
                <NInput
                  class="border-5 w-full border border-gray-400 border-opacity-25"
                  v-model:value="formModel.account"
                  clearable
                  type="text"
                  :placeholder="t('login.accountplaceholder')"
                  @keyup.enter="HandleLoginClick"
                >
                  <template #prefix>
                    <NIcon :component="Person" class="mr-2" />
                  </template>
                </NInput>
              </NFormItem>

              <NFormItem path="password" :label="t('login.password')">
                <NInput
                  class="w-full border border-solid border-gray-400 border-opacity-25"
                  v-model:value="formModel.password"
                  type="password"
                  show-password-on="mousedown"
                  :placeholder="t('login.passwprdplaceholder')"
                  @keyup.enter="HandleLoginClick"
                >
                  <template #prefix>
                    <NIcon :component="Key" class="mr-2" />
                  </template>
                </NInput>
              </NFormItem>
              <NCheckbox
                class="float-left"
                v-model:checked="isAutoLogin"
                :label="t('login.Rememberme')"
                @update:checked="handleCheckedChange"
              ></NCheckbox>
              <a class="link-hover link float-right font-bold">{{
                $t("login.ForgotPassword")
              }}</a>
              <NGrid cols="4" class="mt-10">
                <NGridItem :span="24">
                  <div class="flex justify-center">
                    <NButton
                      class="mb-8 w-full"
                      :disabled="loginBtnDisabled"
                      :loading="loginBtnLoading"
                      :bordered="false"
                      round
                      type="primary"
                      @click="HandleLoginClick"
                    >
                      <template #icon>
                        <n-icon><LogInOutline /></n-icon>
                      </template>
                      {{ $t("login.login") }}
                    </NButton>
                  </div>
                </NGridItem>
              </NGrid>
            </NForm>
            <totpRegister v-if="pageType == 2" />
            <totpForm v-if="pageType == 3" v-model="totpCode" />
            <NDivider class="mb-10" />
            <LanguageSelectVue :show-label="true" />
          </div>
        </div>
      </div>
    </NGridItem>
  </NGrid>
</template>

<script lang="ts" setup>
import {
  FormRules,
  NButton,
  NCheckbox,
  NDivider,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NIcon,
  NImage,
  NInput,
} from "naive-ui"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

import { LanguageSelectVue } from "@components/Layout/header"

import darkLogo from "@/assets/image/darkLogo.svg"
import lightLogo from "@/assets/image/lightLogo.svg"
import { ThemeSelectVue } from "@/components/Layout/header"
import { getConfig } from "@/settings/config"
import useThemesStore from "@/store/modules/appThemes"
import { Key, LogInOutline, Person } from "@vicons/ionicons5"

import {
  formModel,
  formRef,
  HandleLoginClick,
  loginBtnDisabled,
  loginBtnLoading,
  pageType,
  totpCode,
} from "./extend"
import totpForm from "./totpInput.vue"
import totpRegister from "./totpRegister.vue"

const { t } = useI18n()
const logintitle = getConfig().logintitle
const { theme } = storeToRefs(useThemesStore())

const isAutoLogin = ref(true)
function handleCheckedChange(checked: boolean) {
  if (checked) {
    sessionStorage.setItem("isAutoLogin", "on")
  } else {
    sessionStorage.setItem("isAutoLogin", "off")
  }
}

const rules: FormRules = {
  account: [
    {
      required: true,
      message: () => t("Form.required"),
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: () => t("Form.required"),
      trigger: ["input", "blur"],
    },
  ],
}
</script>
@/settings/config
