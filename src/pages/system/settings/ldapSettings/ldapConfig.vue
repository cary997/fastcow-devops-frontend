<template>
  <div class="flex flex-row items-center space-x-8">
    <n-split
      :direction="isMobile ? 'vertical' : 'horizontal'"
      :max="0.7"
      :min="0.4"
    >
      <template #1>
        <div class="flex flex-1 flex-col space-y-4 p-4">
          <n-form
            v-model:model="data"
            label-placement="left"
            label-width="auto"
            label-align="right"
            :rules="rules"
          >
            <n-form-item label="域服务器" path="hosts">
              <n-dynamic-input
                v-model:value="data.hosts"
                :min="1"
                clearable
                placeholder="ldap(s)://ldap.dc01.com:389"
              >
                <template #action="{ index, create, remove }">
                  <div class="m-2 space-x-2">
                    <n-button size="tiny" @click="() => create(index)">
                      <n-icon>
                        <add />
                      </n-icon>
                    </n-button>
                    <n-button size="tiny" @click="() => remove(index)">
                      <n-icon>
                        <Remove />
                      </n-icon>
                    </n-button>
                  </div>
                </template>
              </n-dynamic-input>
            </n-form-item>
            <n-form-item label="绑定用户" path="user">
              <n-input
                v-model:value="data.user"
                clearable
                placeholder="CN=test,CN=Users,DC=example,DC=com"
              />
            </n-form-item>
            <n-form-item label="绑定密码" path="password">
              <n-input
                v-model:value="data.password"
                clearable
                type="password"
                show-password-on="click"
                placeholder="**********"
                class="mr-2"
              />
              <show-password
                v-if="data.password"
                :value="data.password"
              ></show-password>
            </n-form-item>
            <n-form-item label="基础OU" path="base_ou">
              <n-input
                v-model:value="data.base_ou"
                clearable
                placeholder="OU=base,DC=example,DC=com"
              />
            </n-form-item>
            <n-form-item label="搜索分页" path="paged_size">
              <n-input-number
                v-model:value="data.paged_size"
                clearable
                :showButton="false"
                placeholder="<1000"
              />
            </n-form-item>
            <n-form-item label="字段映射" path="attributes">
              <n-descriptions
                label-placement="left"
                label-align="left"
                :column="1"
                bordered
                size="small"
              >
                <n-descriptions-item label="用户名">
                  <n-input
                    size="small"
                    v-model:value="data.attributes.username"
                    clearable
                  />
                </n-descriptions-item>
                <n-descriptions-item label="显示名">
                  <n-input
                    size="small"
                    v-model:value="data.attributes.nickname"
                    clearable
                  />
                </n-descriptions-item>
                <n-descriptions-item label="邮箱">
                  <n-input
                    size="small"
                    v-model:value="data.attributes.email"
                    clearable
                  />
                </n-descriptions-item>
                <n-descriptions-item label="手机">
                  <n-input
                    size="small"
                    v-model:value="data.attributes.phone"
                    clearable
                  />
                </n-descriptions-item>
              </n-descriptions>
            </n-form-item>
            <n-form-item label="启用ldap登录" path="config.enable">
              <NSwitch v-model:value="data.enable" />
            </n-form-item>
          </n-form>
        </div>
      </template>
      <template #2>
        <div class="flex flex-1 flex-col space-y-4 p-4">
          <n-form-item label-placement="left" label="用户名" path="testUser">
            <n-input
              v-model:value="testUser"
              clearable
              :style="{ width: '50%' }"
              :placeholder="data.attributes.username"
              class="mr-2"
            />
            <n-button @click="handleTestClick" :loading="testLoading">
              <n-icon v-if="testStatus == 1" :size="18" class="text-success">
                <CheckmarkCircle20Filled />
              </n-icon>
              <n-icon v-if="testStatus == 2" :size="18" class="text-error">
                <ErrorCircle20Filled />
              </n-icon>
              测试连接
            </n-button>
          </n-form-item>
          <span class="text-error">{{ testMsg }}</span>
          <n-descriptions
            label-placement="top"
            :column="4"
            bordered
            size="small"
            v-if="testStatus == 1"
          >
            <n-descriptions-item label="用户名">
              {{ testSuccessData.username }}
            </n-descriptions-item>
            <n-descriptions-item label="显示名">
              {{ testSuccessData.nickname }}
            </n-descriptions-item>
            <n-descriptions-item label="邮箱">
              {{ testSuccessData.email }}
            </n-descriptions-item>
            <n-descriptions-item label="手机">
              {{ testSuccessData.phone }}
            </n-descriptions-item>
          </n-descriptions>
        </div>
      </template>
    </n-split>
  </div>
</template>

<script lang="ts" setup>
import {
  FormRules,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NDynamicInput,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NInputNumber,
  NSplit,
  NSwitch,
} from "naive-ui"
import {Add,Remove} from "@vicons/ionicons5"

import { storeToRefs } from "pinia"
import { PropType, ref, toRaw, unref } from "vue"
import { useI18n } from "vue-i18n"

import { checkLdapResault, checkLdapSettingsApi } from "@/api/system/apiCheck"
import { ldapConfingInfo } from "@/api/system/type"
import usewebSiteStore from "@/store/modules/appWebSite"
import { Eye24Regular, EyeOff24Filled } from "@vicons/fluent"
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from "@vicons/fluent"

const { t } = useI18n()
const { isMobile } = storeToRefs(usewebSiteStore())
//双向绑定
const data = defineModel({
  type: Object as PropType<ldapConfingInfo>,
})

//测试配置回调
const testStatus = ref<number>(0)
const testUser = ref<string>(null)
const testMsg = ref<string>(null)
const testSuccessData = ref<checkLdapResault>({
  username: null,
  nickname: null,
  email: null,
  phone: null,
})

const testLoading = ref<boolean>(false)
const handleTestClick = async () => {
  testLoading.value = true
  const testConfig = toRaw(unref(data.value))
  const usernmae = toRaw(unref(testUser.value))
  await checkLdapSettingsApi(testConfig, usernmae)
    .then(res => {
      if (res.code) {
        testStatus.value = 1
      }
      testMsg.value = null
      testSuccessData.value = res.data
    })
    .catch(error => {
      testStatus.value = 2
      if (error?.response?.data?.message) {
        console.log(error)
        testMsg.value = error.response.data.message
      } else {
        testMsg.value = error.message
      }
    })
    .finally(() => {
      testLoading.value = false
    })
}

const rules: FormRules = {
  hosts: [
    {
      required: true,
      message: t("Form.required"),
    },
  ],
  user: [
    {
      required: true,
      message: t("Form.required"),
    },
  ],
  password: [
    {
      required: true,
      message: t("Form.required"),
    },
  ],
  base_ou: [
    {
      required: true,
      message: t("Form.required"),
    },
  ],
}
</script>
@/api/system/testApi
